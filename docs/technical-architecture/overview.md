# Technical Architecture Overview

## 1. Architecture Principles

1. **Simplicity First**: Use managed services where possible to minimize ops burden
2. **Serverless-Native**: Leverage edge/serverless for cost efficiency and scalability
3. **React Everywhere**: Next.js frontend + Remotion video = unified React mental model
4. **Type Safety**: TypeScript throughout for reliability and developer experience
5. **Cost-Conscious**: Optimize for startup budget (R2 over S3, Vercel free tier friendly)

---

## 2. Technology Stack

### 2.1. Core Stack Summary

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | Next.js | 14+ | App Router, SSR, API routes |
| **Language** | TypeScript | 5.x | Type safety |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **UI Components** | shadcn/ui | latest | Accessible, customizable components |
| **State** | Zustand | 4.x | Lightweight global state |
| **Video Engine** | Remotion | 4.x | React-based video rendering |
| **Database** | PostgreSQL | 15+ | Via Supabase |
| **ORM** | Prisma | 5.x | Type-safe database access |
| **Auth** | NextAuth.js | 5.x (Auth.js) | OAuth + credentials |
| **AI - LLM** | OpenAI | GPT-4o | Script analysis, generation |
| **AI - TTS** | ElevenLabs | v1 | Text-to-speech |
| **Storage** | Cloudflare R2 | - | S3-compatible object storage |
| **Payments** | Stripe | - | Subscriptions, metering |
| **Hosting** | Vercel | - | Frontend + API |
| **Video Render** | Remotion Lambda | - | Serverless video rendering |

### 2.2. Stack Rationale

#### Why Next.js + Remotion?
- **Next.js**: Industry standard for React apps, excellent DX, built-in API routes eliminates need for separate backend
- **Remotion**: Only production-ready React-based video framework; enables reusing React components for video
- **Synergy**: Same component can render in browser preview AND in final video export

#### Why Supabase over Firebase?
- PostgreSQL = relational queries, better for project/slide relationships
- Row-level security for multi-tenant data
- Generous free tier, predictable pricing
- Better TypeScript/Prisma integration

#### Why Cloudflare R2 over AWS S3?
- Zero egress fees (critical for video streaming)
- S3-compatible API (easy migration if needed)
- Global distribution via Cloudflare CDN

#### Alternatives Considered

| Choice | Alternative | Why Not |
|--------|-------------|---------|
| Remotion | FFmpeg + custom | Would require building animation system from scratch |
| Supabase | PlanetScale | MySQL less suited for complex relationships |
| ElevenLabs | AWS Polly | Lower voice quality, less natural |
| Vercel | Railway | Less optimized for Next.js, more ops work |

---

## 3. System Architecture

### 3.1. High-Level Architecture

```mermaid
flowchart TB
    subgraph client [Client Layer]
        Browser[Web Browser]
        Preview[Remotion Player]
    end
    
    subgraph edge [Edge Layer - Vercel]
        NextApp[Next.js App]
        API[API Routes]
        Middleware[Auth Middleware]
    end
    
    subgraph services [Service Layer]
        direction LR
        AIService[AI Service]
        VoiceService[Voice Service]
        RenderService[Render Service]
        BillingService[Billing Service]
    end
    
    subgraph external [External APIs]
        OpenAI[OpenAI API]
        ElevenLabs[ElevenLabs API]
        Stripe[Stripe API]
        RemotionLambda[Remotion Lambda]
    end
    
    subgraph data [Data Layer]
        Supabase[(Supabase PostgreSQL)]
        R2[(Cloudflare R2)]
        Redis[(Upstash Redis)]
    end
    
    Browser --> NextApp
    NextApp --> Preview
    NextApp --> API
    API --> Middleware
    Middleware --> AIService
    Middleware --> VoiceService
    Middleware --> RenderService
    Middleware --> BillingService
    
    AIService --> OpenAI
    VoiceService --> ElevenLabs
    RenderService --> RemotionLambda
    BillingService --> Stripe
    
    API --> Supabase
    API --> R2
    API --> Redis
    RemotionLambda --> R2
```

### 3.2. Component Architecture

```mermaid
flowchart LR
    subgraph pages [Pages]
        Home[Home]
        Dashboard[Dashboard]
        Editor[Editor]
        Player[Player]
    end
    
    subgraph features [Feature Modules]
        StoryEditor[Story Editor]
        AnimationEngine[Animation Engine]
        VoiceSync[Voice Sync]
        ExportPublish[Export/Publish]
    end
    
    subgraph shared [Shared]
        UI[UI Components]
        Hooks[Custom Hooks]
        Utils[Utilities]
        Types[Type Definitions]
    end
    
    subgraph state [State Management]
        ProjectStore[Project Store]
        UIStore[UI Store]
        UserStore[User Store]
    end
    
    pages --> features
    features --> shared
    features --> state
```

---

## 4. Data Architecture

### 4.1. Database Schema (ERD)

```mermaid
erDiagram
    USER ||--o{ PROJECT : owns
    USER ||--o{ SUBSCRIPTION : has
    PROJECT ||--o{ SLIDE : contains
    SLIDE ||--o{ ELEMENT : contains
    PROJECT ||--o| VOICE_CONFIG : has
    PROJECT ||--o{ EXPORT : generates
    
    USER {
        uuid id PK
        string email UK
        string name
        string avatar_url
        enum plan
        int exports_this_month
        string stripe_customer_id
        timestamp created_at
    }
    
    PROJECT {
        uuid id PK
        uuid user_id FK
        string name
        text script
        enum intent
        jsonb settings
        enum status
        timestamp created_at
        timestamp updated_at
    }
    
    SLIDE {
        uuid id PK
        uuid project_id FK
        int order
        text content
        string template_id
        int duration_ms
        enum transition
        jsonb animation_config
    }
    
    ELEMENT {
        uuid id PK
        uuid slide_id FK
        enum type
        text content
        jsonb position
        jsonb style
        jsonb animation
    }
    
    VOICE_CONFIG {
        uuid id PK
        uuid project_id FK
        string voice_id
        string audio_url
        jsonb sync_points
    }
    
    EXPORT {
        uuid id PK
        uuid project_id FK
        enum type
        enum status
        string output_url
        int duration_ms
        timestamp created_at
    }
    
    SUBSCRIPTION {
        uuid id PK
        uuid user_id FK
        string stripe_subscription_id
        enum status
        timestamp current_period_end
    }
```

### 4.2. Storage Strategy

| Data Type | Storage | Retention | Access Pattern |
|-----------|---------|-----------|----------------|
| User data | Supabase | Permanent | Frequent read/write |
| Project data | Supabase | Permanent | Frequent read/write |
| Generated audio | R2 | 90 days | Read-heavy, CDN cached |
| Exported videos | R2 | 30 days (free) / 1 year (paid) | Read-heavy, CDN cached |
| Temp render files | R2 | 24 hours | Write once, read once |
| Session data | Upstash Redis | 7 days | High frequency |

---

## 5. Key Technical Flows

### 5.1. Script-to-Slides Generation

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as API Route
    participant AI as OpenAI
    participant DB as Supabase
    
    U->>FE: Submit script + intent
    FE->>API: POST /api/projects/{id}/generate
    API->>AI: Analyze script structure
    AI-->>API: Section breakdown
    
    loop For each section
        API->>AI: Generate slide config
        AI-->>API: Slide + element definitions
    end
    
    API->>DB: Save slides + elements
    DB-->>API: Confirmed
    API-->>FE: Generated project data
    FE->>U: Show slides in editor
```

### 5.2. Voice Generation & Sync

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as API Route
    participant TTS as ElevenLabs
    participant R2 as Cloudflare R2
    participant DB as Supabase
    
    U->>FE: Click "Generate Voice"
    FE->>API: POST /api/projects/{id}/voice
    API->>TTS: Generate speech with timestamps
    TTS-->>API: Audio + word timestamps
    API->>R2: Upload audio file
    R2-->>API: Audio URL
    API->>API: Calculate sync points
    API->>DB: Save voice config + sync points
    DB-->>API: Confirmed
    API-->>FE: Voice config with sync data
    FE->>U: Play preview with synced animation
```

### 5.3. Video Export

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as API Route
    participant Lambda as Remotion Lambda
    participant R2 as Cloudflare R2
    participant DB as Supabase
    
    U->>FE: Click "Export Video"
    FE->>API: POST /api/projects/{id}/export
    API->>DB: Create export record (pending)
    API->>Lambda: Trigger render job
    Lambda-->>API: Job ID
    API-->>FE: Export started (job ID)
    
    Note over Lambda,R2: Async rendering (30-60s)
    
    Lambda->>R2: Upload rendered video
    Lambda->>API: Webhook: render complete
    API->>DB: Update export (completed)
    
    FE->>API: Poll export status
    API-->>FE: Export ready + URL
    FE->>U: Download/share link
```

---

## 6. Security Architecture

### 6.1. Authentication Flow

```mermaid
flowchart LR
    subgraph auth [Authentication]
        Login[Login Page]
        OAuth[OAuth Providers]
        Session[Session Management]
    end
    
    subgraph middleware [Middleware]
        AuthCheck[Auth Check]
        RateLimit[Rate Limiting]
        CSRF[CSRF Protection]
    end
    
    subgraph protected [Protected Resources]
        API[API Routes]
        Projects[User Projects]
    end
    
    Login --> OAuth
    OAuth --> Session
    Session --> AuthCheck
    AuthCheck --> RateLimit
    RateLimit --> CSRF
    CSRF --> API
    API --> Projects
```

### 6.2. Security Measures

| Layer | Measure | Implementation |
|-------|---------|----------------|
| Auth | OAuth 2.0 + JWT | NextAuth.js with secure cookies |
| API | Rate limiting | Upstash Redis rate limiter |
| Data | Row-level security | Supabase RLS policies |
| Storage | Signed URLs | Time-limited access to R2 objects |
| Payments | Webhook verification | Stripe signature validation |
| Frontend | CSP headers | Next.js security headers |

---

## 7. Scalability Considerations

### 7.1. Expected Load (MVP)

| Metric | Initial | Growth Target |
|--------|---------|---------------|
| DAU | 100 | 1,000 |
| Projects created/day | 50 | 500 |
| Videos exported/day | 20 | 200 |
| Storage (monthly) | 50 GB | 500 GB |

### 7.2. Scaling Strategy

| Component | Scaling Approach |
|-----------|------------------|
| Frontend | Vercel auto-scales (edge) |
| API | Vercel serverless (auto-scale) |
| Database | Supabase Pro tier (connection pooling) |
| Video Render | Remotion Lambda (parallel functions) |
| Storage | R2 (unlimited, pay-per-use) |
| AI Calls | Queue + rate limiting |

---

## 8. Cost Estimation (MVP)

### 8.1. Monthly Costs at 1,000 Users

| Service | Tier | Est. Cost |
|---------|------|-----------|
| Vercel | Pro | $20/month |
| Supabase | Pro | $25/month |
| Cloudflare R2 | Pay-as-you-go | $15/month (500GB) |
| Upstash Redis | Free tier | $0 |
| OpenAI | Pay-as-you-go | $50/month |
| ElevenLabs | Creator | $22/month |
| Remotion Lambda | Pay-per-render | $100/month |
| Stripe | 2.9% + $0.30 | Variable |
| **Total** | | **~$230/month** |

### 8.2. Cost Optimization

- Cache AI responses for common script patterns
- Use Remotion composition caching
- Implement smart garbage collection for R2
- Batch ElevenLabs requests where possible

---

## 9. Development Environment

### 9.1. Local Setup

```bash
# Prerequisites
node >= 20.x
pnpm >= 8.x

# Clone and install
git clone https://github.com/your-org/visualstory.git
cd visualstory
pnpm install

# Environment setup
cp .env.example .env.local
# Fill in API keys

# Database setup
pnpm db:push
pnpm db:seed

# Start development
pnpm dev
```

### 9.2. Project Structure

```
visualstory/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages
│   │   ├── (dashboard)/       # Dashboard pages
│   │   ├── editor/[id]/       # Editor page
│   │   ├── player/[id]/       # Public player
│   │   └── api/               # API routes
│   │
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── editor/           # Editor-specific
│   │   ├── player/           # Player-specific
│   │   └── shared/           # Shared components
│   │
│   ├── features/             # Feature modules
│   │   ├── story-editor/
│   │   ├── animation-engine/
│   │   ├── voice-sync/
│   │   ├── ai-assistant/
│   │   └── export-publish/
│   │
│   ├── lib/                  # Utilities
│   │   ├── db/              # Prisma client
│   │   ├── ai/              # OpenAI helpers
│   │   ├── storage/         # R2 helpers
│   │   └── utils/           # General utils
│   │
│   ├── remotion/            # Remotion compositions
│   │   ├── compositions/
│   │   ├── templates/
│   │   └── components/
│   │
│   ├── stores/              # Zustand stores
│   └── types/               # TypeScript types
│
├── prisma/
│   └── schema.prisma        # Database schema
│
├── public/                  # Static assets
├── tests/                   # Test files
└── package.json
```

---

## 10. Related Documentation

- [Frontend Architecture](./frontend-architecture.md)
- [Backend Services](./backend-services.md)
- [Video Rendering Pipeline](./video-rendering-pipeline.md)
- [AI Integration](./ai-integration.md)
