# Feature: Web Player

## Module
Export & Publish

## Overview
The Web Player provides an interactive, shareable web-based presentation viewer. Unlike video exports, the web player allows click-to-advance navigation and maintains the interactive qualities of the presentation.

## User Stories

### US-WP-001: Generate Shareable Link
**As a** content creator  
**I want to** get a shareable link to my presentation  
**So that** viewers can watch it in their browser

**Acceptance Criteria:**
- [ ] One-click to generate link
- [ ] Link format: visualstory.app/play/{id}
- [ ] Link works without login
- [ ] Can regenerate/invalidate link

### US-WP-002: View Presentation in Browser
**As a** viewer  
**I want to** watch the presentation in my browser  
**So that** I don't need to download anything

**Acceptance Criteria:**
- [ ] Presentation loads quickly
- [ ] Animations play smoothly
- [ ] Voice-over plays automatically (with user interaction)
- [ ] Works on desktop and mobile

### US-WP-003: Interactive Navigation
**As a** viewer  
**I want to** control playback  
**So that** I can watch at my own pace

**Acceptance Criteria:**
- [ ] Play/pause button
- [ ] Previous/next slide buttons
- [ ] Progress bar with scrubbing
- [ ] Keyboard shortcuts (space, arrows)

### US-WP-004: Auto-Play Mode
**As a** viewer  
**I want to** watch in auto-play mode  
**So that** I can sit back and watch like a video

**Acceptance Criteria:**
- [ ] Auto-advance slides at set timing
- [ ] Voice-over synced with auto-play
- [ ] Toggle between manual and auto mode
- [ ] Full-screen support

### US-WP-005: Embed in External Sites
**As a** content creator  
**I want to** embed my presentation on my website  
**So that** visitors can watch without leaving

**Acceptance Criteria:**
- [ ] Embed code provided (iframe)
- [ ] Responsive embed sizing
- [ ] Privacy options (unlisted vs public)
- [ ] Custom player dimensions

## Technical Specifications

### Player Page Architecture

```typescript
// app/play/[id]/page.tsx
interface PlayerPageProps {
  params: { id: string };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const project = await getPublicProject(params.id);
  
  if (!project || !project.isPublished) {
    notFound();
  }
  
  return (
    <WebPlayer
      project={project}
      voiceConfig={project.voiceConfig}
    />
  );
}
```

### Web Player Component

```typescript
interface WebPlayerProps {
  project: Project;
  voiceConfig: VoiceConfig | null;
  embedded?: boolean;
}

const WebPlayer: React.FC<WebPlayerProps> = ({
  project,
  voiceConfig,
  embedded = false,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentSlide = project.slides[currentSlideIndex];
  const totalDuration = calculateTotalDuration(project.slides);
  
  // Handle auto-advance
  useEffect(() => {
    if (!isPlaying || !isAutoMode) return;
    
    const slideEndTime = calculateSlideEndTime(project.slides, currentSlideIndex);
    
    if (currentTime >= slideEndTime && currentSlideIndex < project.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  }, [currentTime, isPlaying, isAutoMode]);
  
  // Sync audio with playback
  useEffect(() => {
    if (!audioRef.current || !voiceConfig) return;
    
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, voiceConfig]);
  
  return (
    <div className={cn(
      "relative bg-black",
      embedded ? "w-full h-full" : "w-screen h-screen"
    )}>
      {/* Presentation Canvas */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-[1920px] aspect-video">
          <SlideRenderer
            slide={currentSlide}
            isPlaying={isPlaying}
            currentTime={currentTime - calculateSlideStartTime(project.slides, currentSlideIndex)}
          />
        </div>
      </div>
      
      {/* Audio */}
      {voiceConfig?.globalAudioUrl && (
        <audio
          ref={audioRef}
          src={voiceConfig.globalAudioUrl}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime * 1000)}
        />
      )}
      
      {/* Controls */}
      <PlayerControls
        isPlaying={isPlaying}
        isAutoMode={isAutoMode}
        currentTime={currentTime}
        totalDuration={totalDuration}
        currentSlide={currentSlideIndex + 1}
        totalSlides={project.slides.length}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onPrevSlide={() => goToSlide(currentSlideIndex - 1)}
        onNextSlide={() => goToSlide(currentSlideIndex + 1)}
        onSeek={(time) => seekTo(time)}
        onToggleAutoMode={() => setIsAutoMode(!isAutoMode)}
        onFullscreen={() => toggleFullscreen()}
      />
    </div>
  );
};
```

### Player Controls Component

```typescript
interface PlayerControlsProps {
  isPlaying: boolean;
  isAutoMode: boolean;
  currentTime: number;
  totalDuration: number;
  currentSlide: number;
  totalSlides: number;
  onPlayPause: () => void;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onSeek: (time: number) => void;
  onToggleAutoMode: () => void;
  onFullscreen: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = (props) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setIsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsVisible(false), 3000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);
  
  return (
    <div className={cn(
      "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      {/* Progress bar */}
      <ProgressBar
        current={props.currentTime}
        total={props.totalDuration}
        onSeek={props.onSeek}
      />
      
      {/* Control buttons */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={props.onPrevSlide}>
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={props.onPlayPause}>
            {props.isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>
          <Button variant="ghost" onClick={props.onNextSlide}>
            <SkipForward className="w-5 h-5" />
          </Button>
          <span className="text-white text-sm ml-2">
            {formatTime(props.currentTime)} / {formatTime(props.totalDuration)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={props.onToggleAutoMode}
            className={props.isAutoMode ? 'text-blue-400' : 'text-white'}
          >
            <Clock className="w-5 h-5" />
            <span className="ml-1 text-sm">Auto</span>
          </Button>
          <span className="text-white text-sm">
            Slide {props.currentSlide} / {props.totalSlides}
          </span>
          <Button variant="ghost" onClick={props.onFullscreen}>
            <Maximize className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
```

### Embed Code Generation

```typescript
// API endpoint for embed code
// GET /api/projects/{id}/embed
interface EmbedResponse {
  embedCode: string;
  iframeUrl: string;
  previewImage: string;
}

export async function GET(req: Request) {
  const { projectId } = req.params;
  const project = await getProject(projectId);
  
  if (!project.isPublished) {
    return Response.json({ error: 'Project not published' }, { status: 403 });
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const iframeUrl = `${baseUrl}/embed/${projectId}`;
  
  const embedCode = `<iframe 
  src="${iframeUrl}" 
  width="800" 
  height="450" 
  frameborder="0" 
  allow="autoplay; fullscreen" 
  allowfullscreen
></iframe>`;
  
  return Response.json({
    embedCode,
    iframeUrl,
    previewImage: project.thumbnailUrl,
  });
}
```

## UI Components

### Share Dialog

```
┌─────────────────────────────────────────────────────────────┐
│  Share Presentation                                    [X]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📎 Share Link                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ https://visualstory.app/play/abc123xyz               │  │
│  └───────────────────────────────────────────────────────┘  │
│  [Copy Link]                                                │
│                                                             │
│  ─────────────────────────────────────                      │
│                                                             │
│  📋 Embed Code                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ <iframe src="https://visualstory.app/embed/abc123"   │  │
│  │   width="800" height="450" frameborder="0"           │  │
│  │   allow="autoplay; fullscreen" allowfullscreen>      │  │
│  │ </iframe>                                             │  │
│  └───────────────────────────────────────────────────────┘  │
│  [Copy Embed Code]                                          │
│                                                             │
│  ─────────────────────────────────────                      │
│                                                             │
│  Visibility: ○ Public  ● Unlisted (link only)              │
│                                                             │
│  [Regenerate Link]  [Disable Sharing]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Mobile Responsiveness

```typescript
// Touch-friendly controls for mobile
const MobilePlayerControls: React.FC<PlayerControlsProps> = (props) => {
  const [showControls, setShowControls] = useState(false);
  
  // Tap to show/hide controls
  const handleTap = () => {
    setShowControls(!showControls);
  };
  
  // Swipe left/right for slide navigation
  const handlers = useSwipeable({
    onSwipedLeft: () => props.onNextSlide(),
    onSwipedRight: () => props.onPrevSlide(),
    preventScrollOnSwipe: true,
  });
  
  return (
    <div {...handlers} onClick={handleTap}>
      {showControls && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-8">
            <button onClick={props.onPrevSlide} className="p-4">
              <ChevronLeft className="w-12 h-12 text-white" />
            </button>
            <button onClick={props.onPlayPause} className="p-4">
              {props.isPlaying ? (
                <Pause className="w-16 h-16 text-white" />
              ) : (
                <Play className="w-16 h-16 text-white" />
              )}
            </button>
            <button onClick={props.onNextSlide} className="p-4">
              <ChevronRight className="w-12 h-12 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

## Dependencies
- Remotion Player for slide rendering
- react-swipeable for mobile gestures
- Screenfull.js for fullscreen API

## Related Features
- [Video Export](./video-export.md)
- [Embed & Sharing](./embed-sharing.md)
