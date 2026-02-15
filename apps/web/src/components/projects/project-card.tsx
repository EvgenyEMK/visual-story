/**
 * Project card for the dashboard grid — shows thumbnail, inline rename, and action menu.
 * @source docs/modules/user-management/projects-library.md
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import type { ProjectSummary } from '@/types/project';
import { formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProjectCardProps {
  project: ProjectSummary;
  onOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProjectCard({
  project,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
}: ProjectCardProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the rename input
  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isRenaming]);

  const commitRename = () => {
    const trimmed = newName.trim();
    if (trimmed && trimmed !== project.name) {
      onRename(project.id, trimmed);
    } else {
      setNewName(project.name);
    }
    setIsRenaming(false);
  };

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:border-primary hover:shadow-md"
      onClick={() => !isRenaming && onOpen(project.id)}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-muted">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground/50"
            >
              <path d="m22 8-6 4 6 4V8Z" />
              <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
            </svg>
          </div>
        )}
      </div>

      {/* Published indicator */}
      {project.isPublished && (
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-green-500/90 px-2 py-0.5 text-[0.625rem] font-medium text-white shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Published
        </div>
      )}

      {/* Info section */}
      <div className="p-3">
        {isRenaming ? (
          <input
            ref={inputRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') {
                setNewName(project.name);
                setIsRenaming(false);
              }
            }}
            className="w-full border-b border-primary bg-transparent text-sm font-medium outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className="truncate text-sm font-medium">{project.name}</h3>
        )}

        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{project.slideCount} slides</span>
          <span>{formatRelativeTime(project.updatedAt as unknown as string)}</span>
        </div>
      </div>

      {/* Dropdown menu */}
      <div className="absolute bottom-3 right-2 opacity-0 transition-opacity group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem
              onClick={() => {
                setIsRenaming(true);
                setNewName(project.name);
              }}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(project.id)}>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(project.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
