-- VisualStory Initial Schema
-- Supabase PostgreSQL
-- See docs/product-summary/MVP-architecture.md for data model overview

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE plan_type AS ENUM ('free', 'creator', 'pro');
CREATE TYPE visibility_type AS ENUM ('public', 'unlisted', 'password');
CREATE TYPE project_status AS ENUM ('draft', 'generating', 'ready', 'exporting');
CREATE TYPE member_role AS ENUM ('owner', 'admin', 'editor', 'viewer');
CREATE TYPE content_intent AS ENUM ('educational', 'promotional', 'storytelling');

-- =============================================================================
-- TABLES
-- =============================================================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  plan plan_type NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';

-- Tenants (workspaces) — each user gets a personal tenant on signup
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  plan plan_type NOT NULL DEFAULT 'free',
  exports_this_month INT NOT NULL DEFAULT 0,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE tenants IS 'Workspaces/tenants — MVP: personal workspaces only, team collaboration Phase 2';

-- Tenant memberships — links users to tenants with roles
CREATE TABLE tenant_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'editor',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);
COMMENT ON TABLE tenant_memberships IS 'User-to-tenant membership with roles';

-- Projects — the core content entity
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL DEFAULT 'Untitled Project',
  description TEXT,
  intent content_intent NOT NULL DEFAULT 'educational',
  script TEXT DEFAULT '',
  settings JSONB NOT NULL DEFAULT '{"aspectRatio":"16:9","defaultTransition":"fade"}',
  status project_status NOT NULL DEFAULT 'draft',
  thumbnail_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE projects IS 'User projects — scoped to tenant';

-- Slides — ordered visual slides within a project
CREATE TABLE slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  "order" INT NOT NULL DEFAULT 0,
  content TEXT DEFAULT '',
  animation_template TEXT,
  elements JSONB NOT NULL DEFAULT '[]',
  duration INT NOT NULL DEFAULT 5000,
  transition JSONB NOT NULL DEFAULT '{"type":"fade","duration":0.5,"easing":"easeInOut"}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE slides IS 'Slides with elements stored as JSONB. Duration in milliseconds.';

-- Voice configs — TTS and sync settings per project
CREATE TABLE voice_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  voice_id TEXT NOT NULL,
  global_audio_url TEXT,
  slide_configs JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE voice_configs IS 'Voice-over configuration and sync data per project';

-- Exports — tracks video/web export jobs
CREATE TABLE exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'video',
  quality TEXT NOT NULL DEFAULT '1080p',
  status TEXT NOT NULL DEFAULT 'queued',
  render_id TEXT,
  download_url TEXT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE exports IS 'Export jobs — video (Remotion Lambda) or web link';

-- Published projects — sharing and embedding
CREATE TABLE published_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  share_id TEXT NOT NULL UNIQUE,
  visibility visibility_type NOT NULL DEFAULT 'unlisted',
  password TEXT,
  allow_embed BOOLEAN NOT NULL DEFAULT true,
  allow_download BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  view_count INT NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  og_image_url TEXT
);
COMMENT ON TABLE published_projects IS 'Published/shared presentations with visibility controls';

-- Project views — analytics for published presentations
CREATE TABLE project_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  published_id UUID NOT NULL REFERENCES published_projects(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  watch_duration INT,
  country TEXT,
  referrer TEXT,
  user_agent TEXT
);
COMMENT ON TABLE project_views IS 'View analytics for published presentations';

-- Subscriptions — Stripe subscription tracking
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  price_id TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE subscriptions IS 'Stripe subscription state per user';

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_tenant_memberships_user ON tenant_memberships(user_id);
CREATE INDEX idx_tenant_memberships_tenant ON tenant_memberships(tenant_id);
CREATE INDEX idx_projects_tenant ON projects(tenant_id);
CREATE INDEX idx_projects_created_by ON projects(created_by_user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_slides_project ON slides(project_id);
CREATE INDEX idx_slides_order ON slides(project_id, "order");
CREATE INDEX idx_exports_user ON exports(user_id);
CREATE INDEX idx_exports_created ON exports(created_at);
CREATE INDEX idx_published_share ON published_projects(share_id);
CREATE INDEX idx_project_views_published ON project_views(published_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Tenants: accessible by members
CREATE POLICY "Members can view tenant" ON tenants
  FOR SELECT USING (id IN (
    SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
  ));

-- Tenant memberships: members can view their tenant's memberships
CREATE POLICY "Members can view memberships" ON tenant_memberships
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
  ));

-- Projects: tenant-scoped CRUD
CREATE POLICY "Members can view projects" ON projects
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
  ));
CREATE POLICY "Members can create projects" ON projects
  FOR INSERT WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
  ));
CREATE POLICY "Members can update projects" ON projects
  FOR UPDATE USING (tenant_id IN (
    SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
  ));
CREATE POLICY "Members can delete projects" ON projects
  FOR DELETE USING (tenant_id IN (
    SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
  ));

-- Slides: accessible via project tenant membership
CREATE POLICY "Members can manage slides" ON slides
  FOR ALL USING (project_id IN (
    SELECT id FROM projects WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
    )
  ));

-- Voice configs: accessible via project tenant membership
CREATE POLICY "Members can manage voice configs" ON voice_configs
  FOR ALL USING (project_id IN (
    SELECT id FROM projects WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
    )
  ));

-- Exports: users can view/create their own
CREATE POLICY "Users can view own exports" ON exports
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create exports" ON exports
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Published projects: public read, owner manage
CREATE POLICY "Anyone can view published projects" ON published_projects
  FOR SELECT USING (true);
CREATE POLICY "Project owners can manage publishing" ON published_projects
  FOR ALL USING (project_id IN (
    SELECT id FROM projects WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
    )
  ));

-- Project views: anyone can insert (analytics), owners can read
CREATE POLICY "Anyone can record views" ON project_views
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can view analytics" ON project_views
  FOR SELECT USING (published_id IN (
    SELECT id FROM published_projects WHERE project_id IN (
      SELECT id FROM projects WHERE tenant_id IN (
        SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
      )
    )
  ));

-- Subscriptions: users can view their own
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Auto-create profile and personal tenant on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_tenant_id UUID;
BEGIN
  -- Create profile
  INSERT INTO profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Create personal tenant (workspace)
  new_tenant_id := gen_random_uuid();
  INSERT INTO tenants (id, name, slug)
  VALUES (
    new_tenant_id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'My Workspace'),
    NEW.id::TEXT
  );

  -- Add user as owner of their personal tenant
  INSERT INTO tenant_memberships (tenant_id, user_id, role)
  VALUES (new_tenant_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER voice_configs_updated_at
  BEFORE UPDATE ON voice_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
