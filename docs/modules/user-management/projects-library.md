# Feature: Projects Library

## Module
User Management

## Overview
The Projects Library is the user's dashboard for managing all their VisualStory projects. It provides project listing, creation, organization, and basic project management functions.

## User Stories

### US-PL-001: View All Projects
**As a** user  
**I want to** see all my projects in one place  
**So that** I can find and access them easily

**Acceptance Criteria:**
- [ ] Grid or list view of projects
- [ ] Project thumbnail preview
- [ ] Project name and last modified date
- [ ] Sort by name, date created, date modified
- [ ] Search projects by name

### US-PL-002: Create New Project
**As a** user  
**I want to** create a new project  
**So that** I can start building a new presentation

**Acceptance Criteria:**
- [ ] "New Project" button
- [ ] Project name input
- [ ] Optional: start from template
- [ ] Creates project and opens editor

### US-PL-003: Open Existing Project
**As a** user  
**I want to** open a project  
**So that** I can continue editing

**Acceptance Criteria:**
- [ ] Click project card to open
- [ ] Opens in editor view
- [ ] Loads project state

### US-PL-004: Rename Project
**As a** user  
**I want to** rename a project  
**So that** I can keep my library organized

**Acceptance Criteria:**
- [ ] Rename option in project menu
- [ ] Inline rename on project card
- [ ] Save on Enter or blur

### US-PL-005: Duplicate Project
**As a** user  
**I want to** duplicate a project  
**So that** I can create variations

**Acceptance Criteria:**
- [ ] Duplicate option in project menu
- [ ] Creates copy with "(Copy)" suffix
- [ ] Copies all slides and settings
- [ ] Does not copy published state

### US-PL-006: Delete Project
**As a** user  
**I want to** delete a project  
**So that** I can remove projects I no longer need

**Acceptance Criteria:**
- [ ] Delete option in project menu
- [ ] Confirmation dialog
- [ ] Soft delete with 30-day recovery (Phase 2)
- [ ] Unpublishes if published

## Technical Specifications

### Project Data Model

```typescript
interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  intent: ContentIntent;
  script: string;
  slides: Slide[];
  voiceConfig?: VoiceConfig;
  settings: ProjectSettings;
  status: ProjectStatus;
  thumbnailUrl?: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectSettings {
  aspectRatio: '16:9' | '4:3' | '1:1';
  defaultTransition: TransitionType;
  brandColors?: string[];
  fontFamily?: string;
}

type ProjectStatus = 'draft' | 'generating' | 'ready' | 'exporting';
type ContentIntent = 'educational' | 'promotional' | 'storytelling';
```

### API Endpoints

```typescript
// GET /api/projects
interface ListProjectsRequest {
  page?: number;
  limit?: number;
  sort?: 'name' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
  search?: string;
}

interface ListProjectsResponse {
  projects: ProjectSummary[];
  total: number;
  page: number;
  totalPages: number;
}

interface ProjectSummary {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  status: ProjectStatus;
  isPublished: boolean;
  slideCount: number;
  duration: number; // total seconds
  createdAt: string;
  updatedAt: string;
}

// POST /api/projects
interface CreateProjectRequest {
  name: string;
  intent?: ContentIntent;
  templateId?: string;
}

// PUT /api/projects/{id}
interface UpdateProjectRequest {
  name?: string;
  script?: string;
  intent?: ContentIntent;
  settings?: Partial<ProjectSettings>;
}

// POST /api/projects/{id}/duplicate
interface DuplicateProjectResponse {
  newProjectId: string;
}

// DELETE /api/projects/{id}
// Returns 204 No Content
```

### Project Handler

```typescript
// app/api/projects/route.ts
export async function GET(req: Request) {
  const user = await getAuthUser(req);
  const { searchParams } = new URL(req.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const sort = searchParams.get('sort') || 'updatedAt';
  const order = searchParams.get('order') || 'desc';
  const search = searchParams.get('search') || '';
  
  const where = {
    userId: user.id,
    ...(search && {
      name: { contains: search, mode: 'insensitive' },
    }),
  };
  
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      select: {
        id: true,
        name: true,
        thumbnailUrl: true,
        status: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { slides: true } },
        slides: { select: { duration: true } },
      },
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.project.count({ where }),
  ]);
  
  return Response.json({
    projects: projects.map(p => ({
      ...p,
      slideCount: p._count.slides,
      duration: p.slides.reduce((acc, s) => acc + s.duration, 0),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  const { name, intent, templateId } = await req.json();
  
  let initialSlides: Slide[] = [];
  
  if (templateId) {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { slides: true },
    });
    if (template) {
      initialSlides = template.slides;
    }
  }
  
  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: name || 'Untitled Project',
      intent: intent || 'educational',
      status: 'draft',
      slides: {
        create: initialSlides,
      },
    },
    include: { slides: true },
  });
  
  return Response.json(project, { status: 201 });
}
```

### Thumbnail Generation

```typescript
// Generate thumbnail from first slide
import { renderStill } from '@remotion/renderer';

async function generateThumbnail(projectId: string): Promise<string> {
  const project = await getProject(projectId);
  
  if (!project.slides.length) {
    return DEFAULT_THUMBNAIL_URL;
  }
  
  const thumbnailPath = `/tmp/thumb-${projectId}.png`;
  
  await renderStill({
    composition: {
      id: 'Slide',
      width: 1920,
      height: 1080,
      fps: 30,
      durationInFrames: 1,
      defaultProps: { slide: project.slides[0] },
    },
    output: thumbnailPath,
    frame: 0,
    scale: 0.2, // 384x216
  });
  
  // Upload to R2
  const url = await uploadToR2(thumbnailPath, `thumbnails/${projectId}.png`);
  
  // Update project
  await prisma.project.update({
    where: { id: projectId },
    data: { thumbnailUrl: url },
  });
  
  return url;
}
```

## UI Components

### Projects Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  VisualStory                              [Search...]         [User Menu ▼] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  My Projects                                    Sort: [Last Modified ▼]     │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │             │  │             │  │             │  │      +      │        │
│  │   [thumb]   │  │   [thumb]   │  │   [thumb]   │  │             │        │
│  │             │  │             │  │             │  │    New      │        │
│  │─────────────│  │─────────────│  │─────────────│  │   Project   │        │
│  │ Project A   │  │ Project B   │  │ Project C   │  │             │        │
│  │ 5 slides    │  │ 12 slides   │  │ 3 slides    │  │             │        │
│  │ 2 days ago  │  │ 1 week ago  │  │ Just now    │  │             │        │
│  │ [⋮]         │  │ [⋮] 🌐      │  │ [⋮]         │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐                                          │
│  │             │  │             │                                          │
│  │   [thumb]   │  │   [thumb]   │                                          │
│  │             │  │             │                                          │
│  │─────────────│  │─────────────│                                          │
│  │ Project D   │  │ Project E   │                                          │
│  │ 8 slides    │  │ 6 slides    │                                          │
│  │ 2 weeks ago │  │ 1 month ago │                                          │
│  │ [⋮]         │  │ [⋮]         │                                          │
│  └─────────────┘  └─────────────┘                                          │
│                                                                             │
│  Showing 1-6 of 6 projects                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Project Card Component

```typescript
interface ProjectCardProps {
  project: ProjectSummary;
  onOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(project.name);
  
  return (
    <div
      className="group relative rounded-lg border bg-card overflow-hidden cursor-pointer hover:border-primary transition-colors"
      onClick={() => !isRenaming && onOpen(project.id)}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-muted">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <FileVideo className="w-12 h-12" />
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="p-3">
        {isRenaming ? (
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={() => {
              onRename(project.id, newName);
              setIsRenaming(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onRename(project.id, newName);
                setIsRenaming(false);
              }
            }}
            className="w-full font-medium bg-transparent border-b border-primary outline-none"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className="font-medium truncate">{project.name}</h3>
        )}
        
        <div className="flex items-center justify-between mt-1 text-sm text-muted-foreground">
          <span>{project.slideCount} slides</span>
          <span>{formatRelativeTime(project.updatedAt)}</span>
        </div>
        
        {/* Published indicator */}
        {project.isPublished && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
            Published
          </div>
        )}
      </div>
      
      {/* Actions menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-3 right-2 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsRenaming(true)}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate(project.id)}>
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(project.id)}
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
```

### New Project Dialog

```typescript
const NewProjectDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, intent: ContentIntent) => void;
}> = ({ open, onOpenChange, onCreate }) => {
  const [name, setName] = useState('');
  const [intent, setIntent] = useState<ContentIntent>('educational');
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Presentation"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Content Type</Label>
            <RadioGroup value={intent} onValueChange={setIntent}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="educational" id="educational" />
                <Label htmlFor="educational">Educational</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="promotional" id="promotional" />
                <Label htmlFor="promotional">Promotional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="storytelling" id="storytelling" />
                <Label htmlFor="storytelling">Storytelling</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onCreate(name || 'Untitled', intent)}>
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

## Dependencies
- Prisma for database access
- Remotion for thumbnail generation
- Cloudflare R2 for thumbnail storage

## Related Features
- [Authentication](./authentication.md)
- [Subscription Billing](./subscription-billing.md)
