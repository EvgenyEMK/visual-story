# Smart List Editor & Cross-Slide Aggregation — Concept Document

> **Parent:** [Smart Item Lists](./smart-item-lists.md) > [Element Editing](./README.md)
> **Status:** Concept / Proposal
> **Features covered:** SL-F19 (Cross-Slide Item Aggregator) + new "Smart List Editor" concept
> **Date:** 2026-02-16

---

## 1. Problem Statement

Business users frequently maintain the same structured list data across multiple contexts:

- A project status list appears on 3 slides: a summary slide, a detail slide with expanded items, and a "risks only" filtered view.
- Two team leads each own a task list; the PM needs a single "All Action Items" summary on slide 1.
- Weekly status reviews need to show the _same_ list with a different snapshot date.
- A list is maintained by an external tool (Jira, Asana) and needs to flow into multiple presentation views.

**Today's pain:** Every presentation tool treats each list as an isolated copy. Updates are manual, error-prone, and require touching every slide individually. No tool offers shared list data across slides or collaborative list editing outside the slide view.

---

## 2. How Smart Lists Are Stored Today

### 2.1. Current Storage Model

```
SLIDE row
  └── items_tree (jsonb)  ─── SlideItem[]
         └── WidgetItem
               ├── widgetType: 'smart-list'
               ├── config: SmartListConfig   ← icon set, reveal mode, filtering, etc.
               └── data: SmartListData       ← { items: SmartListItem[] }
```

Each smart list is **embedded inline** in a slide's `items_tree` JSONB column. The list data (`SmartListItem[]`) is stored directly inside the `WidgetItem.data` field.

**Implications:**
- Each list is a self-contained island — no cross-references.
- Duplicating a list across slides means duplicating the data (no single source of truth).
- Editing one copy doesn't propagate to others.
- No way to share a list outside the presentation context.

### 2.2. The `globalItem` Field (Reserved)

The `SlideItemBase` already has a reserved field:

```typescript
globalItem?: { id: string };
```

This was designed for exactly this scenario — referencing a shared item definition. However, it's currently unimplemented. The SL-F19 design builds on this concept.

---

## 3. Proposed Architecture: Shared Smart Lists

### 3.1. New Entity: `SmartListSource`

Introduce a new **project-level** entity that holds the canonical list data:

```
PROJECT row
  └── smart_list_sources (jsonb OR separate table)
        └── SmartListSource[]
              ├── id: string (UUID)
              ├── name: string ("Sprint 24 Tasks", "Q1 Risks")
              ├── description?: string
              ├── iconSetId: string
              ├── secondaryIconSetId?: string
              ├── items: SmartListItem[]
              ├── snapshots?: SmartListSnapshot[]
              ├── externalLink?: ExternalDataLink
              ├── collaborators?: CollaboratorRef[]
              ├── shareToken?: string (for external URL access)
              ├── updatedAt: string (ISO timestamp)
              └── createdAt: string (ISO timestamp)
```

### 3.2. Widget → Source Reference

The `WidgetItem` for a shared list changes from embedding data to referencing a source:

```typescript
// Before (embedded data):
{
  type: 'widget',
  widgetType: 'smart-list',
  config: { iconSetId: 'task-status', ... },
  data: { items: [...] }  // <-- data lives here
}

// After (referenced data):
{
  type: 'widget',
  widgetType: 'smart-list',
  config: {
    iconSetId: 'task-status',
    sourceId: 'abc-123',       // <-- NEW: reference to SmartListSource
    viewFilter: ['in-progress', 'todo'],  // <-- optional view-level filter
    viewGroupBy: true,         // <-- optional view-level grouping
    viewColumns: ['text', 'primaryIcon', 'description'],  // <-- which fields to show
    ...
  },
  data: {}  // <-- empty when sourceId is set; data comes from the source
}
```

**Key principle:** The `SmartListSource` is the single source of truth. Each widget on a slide is a **view** into that source, with its own display configuration (filtering, grouping, which columns/fields to show, size, formatting).

### 3.3. Backward Compatibility

Lists without a `sourceId` continue to work exactly as today — embedded data, no cross-references. Migration path:

1. User creates a list (embedded, as today).
2. User clicks "Convert to shared list" in the side panel → data is extracted into a `SmartListSource`, widget gets a `sourceId`.
3. User can then add additional views of the same source on other slides.

---

## 4. Cross-Slide Item Aggregator (SL-F19)

### 4.1. How It Works with Shared Sources

The aggregator is a special `SmartListConfig` variant:

```typescript
{
  widgetType: 'smart-list',
  config: {
    aggregator: true,
    aggregateFrom: [
      { sourceId: 'abc-123', filter: ['todo', 'blocked'] },
      { sourceId: 'def-456' },  // all items from this source
    ],
    groupBySource: true,     // group items under source-name headers
    deduplicateById: true,   // if same item appears in multiple sources
    ...
  },
  data: {}
}
```

**Rendering:** The aggregator collects items from multiple `SmartListSource`s, applies per-source filters, deduplicates, and renders them as a unified list. Source name appears as section headers when `groupBySource` is true.

### 4.2. Real-Time Reactivity

Since all views reference the same source, changes propagate automatically:

```
SmartListSource (Zustand store)
     ↓ subscribe
  ┌──┴──────────────────────┐
  │                         │
  Slide 2: "Detail View"   Slide 1: "Summary (Aggregator)"
  (filter: all)             (filter: todo + blocked)
  │                         │
  Slide 5: "Risks Only"    Slide 8: "All Action Items"
  (filter: risk icon)       (aggregate from 3 sources)
```

No polling, no manual sync — Zustand subscriptions ensure all widgets re-render when the source updates.

---

## 5. Smart List Editor UI

### 5.1. Concept

A **dedicated full-screen editor** for list data that is independent of the slide canvas. Think of it as a lightweight spreadsheet / Kanban hybrid optimized for status-tracked lists.

**Entry points:**
- Side panel → "Edit in Smart List Editor" button when a shared list is selected.
- Project menu → "Manage Smart Lists" (shows all lists in the project).
- Direct URL: `/[locale]/projects/[projectId]/lists/[listId]` (shareable).

### 5.2. Editor Capabilities

| Capability | Description |
|------------|-------------|
| **Table View** | Spreadsheet-like grid with all SmartListItem fields as columns: text, description, primaryIcon, secondaryIcon, detail, visible, children. Bulk editing. |
| **Column Mapping** | User configures which columns map to which visual elements in the presentation view. E.g., "Column A → text, Column B → description (hidden, shown only in detail popup), Column C → primaryIcon". |
| **Kanban View** | Group items by primaryIcon status. Drag items between status columns. |
| **Import / Paste** | Paste from Excel/Google Sheets, CSV import. AI-assisted column mapping. |
| **Color Mapping** | Visual preview of how each status maps to colors in the presentation. Editable — click a status to change its accent color. |
| **Snapshot Manager** | Create named snapshots, view diff between any two snapshots, restore a previous snapshot. |
| **Access Control** | Per-list permissions: viewer, editor. Separate from slide-level permissions. |

### 5.3. Column-to-Presentation Mapping

This is the core innovation. The Smart List Editor shows **all** data, but each presentation view shows only a subset:

```
Smart List Editor (all columns):
┌─────────────────┬────────┬──────────┬───────┬─────────────────┬──────────────┐
│ Task            │ Status │ Priority │ Owner │ Detail Notes    │ Risk Flag    │
├─────────────────┼────────┼──────────┼───────┼─────────────────┼──────────────┤
│ API migration   │ ✅ Done│ P1       │ Alex  │ Completed 2/10  │ 🟢 OK       │
│ Payment gateway │ 🔄 WIP│ P1       │ Sam   │ Stripe v3 issue │ ⚠️ Warning   │
│ Data migration  │ 🔄 WIP│ P2       │ Chris │ 2M records...   │ 🔴 Risk     │
└─────────────────┴────────┴──────────┴───────┴─────────────────┴──────────────┘

Slide 2 — "Executive Summary" view config:
  columns: [Task, Status]  ← clean, minimal

Slide 5 — "Technical Detail" view config:
  columns: [Task, Status, Priority, Detail Notes, Risk Flag]  ← full context

Slide 8 — "Risk Report" view config:
  columns: [Task, Risk Flag, Detail Notes]
  filter: Risk Flag ∈ [Warning, Risk]
```

### 5.4. Separate URL per List

Each shared list gets a direct URL:

```
https://app.visualstory.com/en/projects/proj-123/lists/list-abc
```

**Use cases:**
- PM sends the list URL to a team lead: "Update your team's items before Thursday's presentation."
- Two people maintain two different lists; the PM's slide aggregates both.
- List is bookmarked in Slack / Teams for easy access without navigating through slides.
- List can be edited on mobile (the Smart List Editor is responsive).

**Authentication:** Same project-level permissions apply. The share token allows read-only access without authentication (for embedding in dashboards, etc.).

---

## 6. DB-Light Mode: Can Lists Cross-Reference Each Other?

### 6.1. What "DB-Light" Means

The current architecture stores all presentation data as JSONB in Supabase. There's no separate relational model for individual list items. This is intentional — it keeps the data model simple and avoids the complexity of a full database schema for list items.

"DB-light" means we can get 80% of the cross-referencing value without a full relational schema:

| Approach | Complexity | Cross-ref capability |
|----------|-----------|---------------------|
| **Embedded (today)** | Minimal | None — each list is isolated |
| **DB-light (proposed)** | Low-medium | Lists reference sources by ID; sources stored as project-level JSONB |
| **Full relational** | High | Individual items are rows with foreign keys, full SQL querying |

### 6.2. Recommended: DB-Light with JSONB Sources

Store `SmartListSource[]` as a **JSONB column** on the PROJECT table (or a separate `smart_list_sources` table with a JSONB `data` column):

```sql
-- Option A: JSONB column on PROJECT
ALTER TABLE projects ADD COLUMN smart_list_sources jsonb DEFAULT '[]';

-- Option B: Separate table (preferred for larger lists)
CREATE TABLE smart_list_sources (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid REFERENCES projects(id) ON DELETE CASCADE,
  name        text NOT NULL,
  icon_set_id text NOT NULL,
  data        jsonb NOT NULL DEFAULT '{"items":[]}',
  share_token text UNIQUE,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_smart_list_sources_project ON smart_list_sources(project_id);
CREATE INDEX idx_smart_list_sources_share ON smart_list_sources(share_token) WHERE share_token IS NOT NULL;
```

**Option B is recommended** because:
- Lists can grow large (100+ items with detail text).
- Separate rows enable per-list locking for concurrent editing.
- RLS policies can be set per-list (team A's list vs team B's list).
- Snapshots can be stored as additional JSONB rows without bloating the project record.

### 6.3. Cross-Reference Mechanics

Lists can reference each other through the aggregator pattern:

```
SmartListSource "Sprint Tasks"     SmartListSource "Risk Register"
   ├── item-1 (done)                  ├── risk-A (mitigated)
   ├── item-2 (in-progress)           ├── risk-B (active)
   └── item-3 (todo)                  └── risk-C (active)
                     ↘                 ↙
               Aggregator Widget (Slide 1)
               sourceIds: ["sprint-tasks", "risk-register"]
               → "All Open Items" (filter: not done/mitigated)
```

Each source is independent — no foreign keys between items. The aggregator is a read-only view that collects from multiple sources. This avoids the complexity of inter-list foreign keys while enabling the most requested use case (summary views).

### 6.4. Future: Item-Level Cross-References

For advanced scenarios (e.g., "Risk B blocks Task 2"), a `relatedItems` field could be added:

```typescript
export interface SmartListItem {
  // ... existing fields ...
  /** References to items in other lists (future). */
  relatedItems?: Array<{
    sourceId: string;
    itemId: string;
    relation: 'blocks' | 'blocked-by' | 'relates-to' | 'duplicates';
  }>;
}
```

This is **not recommended for Phase 3** — it adds significant UI complexity (showing cross-list links) and is better suited for Phase 4 when external data source integration (Jira, Asana) provides a natural need for cross-references.

---

## 7. Assessment: Is This a Differentiator?

### 7.1. Competitive Landscape

| Feature | Gamma | Google Slides | PowerPoint | Keynote | VisualStory (proposed) |
|---------|-------|---------------|------------|---------|----------------------|
| Inline list editing | ✅ Basic | ✅ Basic bullets | ✅ Basic bullets | ✅ Basic bullets | ✅ Smart widgets |
| Shared list data across slides | ❌ | ❌ | ❌ | ❌ | ✅ **Unique** |
| Dedicated list editor | ❌ | ❌ | ❌ | ❌ | ✅ **Unique** |
| Separate URL per list | ❌ | ❌ | ❌ | ❌ | ✅ **Unique** |
| Cross-slide aggregation | ❌ | ❌ | ❌ | ❌ | ✅ **Unique** |
| Column-to-view mapping | ❌ | ❌ | ❌ | ❌ | ✅ **Unique** |
| Status tracking + filtering | ❌ | ❌ | ❌ | ❌ | ✅ Already implemented |
| External data import | ❌ | Partial (add-ons) | Partial (add-ins) | ❌ | 🔜 Phase 4 |
| Collaborative list editing | ❌ | ✅ (whole doc) | ✅ (whole doc) | ❌ | ✅ **Per-list granularity** |

### 7.2. Demand Assessment

| Feature | Demand | Frequency | Differentiator | Priority |
|---------|--------|-----------|----------------|----------|
| Shared list across slides | ⭐⭐⭐⭐⭐ | Every multi-slide deck | **Strong** — nobody does this | **High** |
| Smart List Editor UI | ⭐⭐⭐⭐ | Weekly+ for recurring decks | **Strong** — eliminates context-switching | **High** |
| Separate URL per list | ⭐⭐⭐⭐ | Weekly for team scenarios | **Moderate-Strong** — unique in presentation tools | **Medium-High** |
| Cross-slide aggregation | ⭐⭐⭐⭐ | Monthly for status reviews | **Strong** — solves real pain point | **High** |
| Column-to-view mapping | ⭐⭐⭐ | Monthly | **Strong** — bridges spreadsheet↔presentation gap | **Medium** |
| Per-list collaborative editing | ⭐⭐⭐ | Weekly for teams | **Moderate** — unique granularity | **Medium** |
| Item-level cross-references | ⭐⭐ | Rare | Low — niche PM use case | **Low** |

### 7.3. Verdict

**Yes, this is a strong differentiator.** The combination of shared list data + dedicated editor + per-list URLs + cross-slide aggregation creates a unique value proposition that no existing presentation tool offers. It transforms VisualStory from "a slide tool with smart lists" into "a data-aware presentation platform where content flows from structured sources into visual views."

The key insight is that **business presentations are not documents — they are views on top of evolving data**. No current tool treats them this way.

### 7.4. Risk / Complexity Assessment

| Risk | Mitigation |
|------|-----------|
| Over-engineering for MVP | Phase incrementally: shared sources first, editor later, URLs last |
| UX complexity | Smart List Editor is optional — inline editing still works for simple cases |
| Data consistency | Zustand subscriptions + optimistic updates; conflict resolution via last-write-wins (sufficient for small teams) |
| Performance with large lists | Virtualize rendering (react-window); paginate in the editor for 100+ items |
| Share token security | Read-only by default; write access requires authentication |

---

## 8. Proposed Implementation Phases

### Phase 3a — Shared Sources (Foundation)

1. Add `SmartListSource` type definitions.
2. Add `smart_list_sources` table (or project-level JSONB).
3. Add `sourceId` to `SmartListConfig`.
4. Zustand store: `useSmartListSourceStore` — CRUD, subscriptions.
5. "Convert to shared list" action in the side panel.
6. Widgets with `sourceId` read from the source store instead of embedded data.

### Phase 3b — Cross-Slide Aggregator (SL-F19)

1. `aggregator` config variant.
2. Aggregator renderer: collects items from multiple sources, applies filters.
3. Demo + side panel UI for configuring aggregate sources.

### Phase 3c — Smart List Editor UI

1. Route: `/[locale]/projects/[projectId]/lists/[listId]`.
2. Table view with inline editing.
3. Column mapping configuration.
4. Kanban view by status.
5. Import from clipboard (paste from Excel).

### Phase 3d — Shareable URLs + Collaboration

1. `shareToken` generation.
2. Read-only public URL.
3. Per-list permissions (viewer/editor).
4. Real-time collaborative editing (Supabase Realtime or Y.js for CRDT).

---

## 9. Alternative / Additional Features Considered

### 9.1. "List Templates" Library

**Idea:** Pre-built list structures for common scenarios:
- Sprint retrospective (What went well / What to improve / Action items)
- RAID log (Risks / Assumptions / Issues / Dependencies)
- OKR tracker (Objective → Key Results with progress)
- Meeting minutes (Agenda → Discussion → Decisions → Actions)

**Assessment:** ⭐⭐⭐⭐ demand, easy to implement as JSON templates. Should be part of the "insert widget" flow. **Recommended for Phase 3.**

### 9.2. "List Diff View" (Enhancement to SL-F21)

**Idea:** Side-by-side visual diff between two snapshots of the same list. Color-coded: green = new, yellow = status changed, red = removed, gray = unchanged.

**Assessment:** ⭐⭐⭐⭐⭐ for recurring presentations (weekly standup, monthly review). Natural extension of the snapshot feature. **Recommended for Phase 3.**

### 9.3. "Embedded Mini-Chart" per List

**Idea:** A small sparkline or bar chart auto-generated from the list's status distribution, embeddable alongside the list widget. More visual than the text-only progress summary.

**Assessment:** ⭐⭐⭐ demand. Nice-to-have. Could be a simple enhancement to the existing progress bar. **Recommended for Phase 4.**

### 9.4. "List Webhook" for External Automation

**Idea:** Each shared list exposes a webhook URL. External tools (Zapier, n8n, custom scripts) can push updates to the list via POST request.

**Assessment:** ⭐⭐⭐ demand (power users). Enables scenarios like "Jira status change → update list → presentation auto-updates." Significant differentiator for enterprise users. **Recommended for Phase 4.**

### 9.5. "AI List Summarizer"

**Idea:** AI reads all items + detail text and generates a 2-3 sentence executive summary. Auto-placed as a text atom above or below the list.

**Assessment:** ⭐⭐⭐⭐ demand. Leverages existing OpenAI integration. Quick to implement. **Recommended for Phase 3.**

---

## 10. Recommended Priority Order

1. **Phase 3a: Shared Sources** — Foundation that enables everything else.
2. **Phase 3b: Aggregator (SL-F19)** — Most impactful user-facing feature.
3. **List Templates Library** (9.1) — Quick win, high discoverability.
4. **AI List Summarizer** (9.5) — Quick win, leverages existing infra.
5. **Phase 3c: Smart List Editor** — Medium effort, strong differentiator.
6. **List Diff View** (9.2) — Enhances snapshot feature.
7. **Phase 3d: Shareable URLs** — Unlocks collaboration scenarios.
8. **Embedded Mini-Chart** (9.3) — Nice-to-have polish.
9. **List Webhook** (9.4) — Enterprise-tier feature.
