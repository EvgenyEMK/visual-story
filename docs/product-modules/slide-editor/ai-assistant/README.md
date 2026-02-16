# AI Assistant

> **Parent module:** [Slide Editor](../README.md)
> **Status:** `ToDo`
> **MVP:** Yes

## Purpose

The AI Assistant provides intelligent automation within the slide editor — users can issue natural-language prompts to modify slides, receive feedback on their script, get visual suggestions, and trigger auto-generation of slide content and animations. In MVP, this focuses on prompt-based slide modification, script feedback via OpenAI, and icon suggestions from a curated library.

The AI assistant is a cross-cutting capability that enhances many other workflows (element editing, animation, content generation) through a unified prompt interface.

## UI Touchpoints

| UI Zone | Role | What Happens Here |
|---------|------|-------------------|
| **Side Panel** | **Primary** | AI tab with chat-style prompt input, suggestion list, feedback display |
| **Canvas** | Secondary | AI-generated changes applied and previewed on the canvas |

## Features

| ID | Feature | Description | MVP | Status |
|----|---------|-------------|-----|--------|
| AI-F01 | [Prompt-Based Slide Modification](#ai-f01-prompt-based-slide-modification) | Natural-language prompts to change the current slide | Yes | `ToDo` |
| AI-F02 | [Script Feedback](#ai-f02-script-feedback) | AI analysis and improvement suggestions for script/narrative | Yes | `ToDo` |
| AI-F03 | [Visual Suggestions](#ai-f03-visual-suggestions) | AI-recommended icons and visual elements based on content | Yes | `ToDo` |
| AI-F04 | [Slide Regeneration](#ai-f04-slide-regeneration) | Regenerate a slide with AI based on a prompt and existing content | Yes | `ToDo` |
| AI-F05 | [Asset Generation](#ai-f05-asset-generation) | AI-generated images and assets for slides (Phase 2) | No | `ToDo` |

---

## User Stories

### AI-F01: Prompt-Based Slide Modification

#### US-AI-001: Modify Slide via Prompt — `ToDo`
**As a** business user,
**I want to** type a natural-language prompt to ask the AI to modify my slide,
**so that** I can make changes without manually editing each element.

**Acceptance Criteria:**
- [ ] Chat-style input field in the AI tab of the side panel
- [ ] User can type prompts like "make this slide more dynamic" or "add icons to each bullet point"
- [ ] AI generates a modified version of the current slide
- [ ] User can accept, reject, or request further changes
- [ ] Conversation history preserved for the current editing session

#### US-AI-002: Modify Selected Element via Prompt — `ToDo`
**As a** business user,
**I want to** ask the AI to change a specific selected element,
**so that** I can get AI help for targeted edits.

**Acceptance Criteria:**
- [ ] When an element is selected, prompts are scoped to that element
- [ ] Example: "make this title shorter" or "suggest a better icon for this"
- [ ] AI modifies only the selected element, leaving others untouched

---

### AI-F02: Script Feedback

#### US-AI-003: Get Script Feedback from AI — `ToDo`
**As a** business user,
**I want to** receive AI feedback on my presentation script,
**so that** I can improve narrative structure and clarity.

**Acceptance Criteria:**
- [ ] AI analyzes the full script or selected section
- [ ] Suggestions for: hook, structure, transitions, call-to-action, pacing
- [ ] Each suggestion is actionable (accept to apply, dismiss to ignore)
- [ ] Feedback appears as a list in the AI tab

---

### AI-F03: Visual Suggestions

#### US-AI-004: Get Icon Suggestions for Content — `ToDo`
**As a** business user,
**I want** the AI to suggest icons that match my slide content,
**so that** I can enhance slides visually without searching manually.

**Acceptance Criteria:**
- [ ] AI analyzes slide text content and suggests relevant icons
- [ ] Suggestions appear as a grid in the AI tab
- [ ] Click to insert icon onto the canvas
- [ ] Icon style matches the current theme

---

### AI-F04: Slide Regeneration

#### US-AI-005: Regenerate Slide with Prompt — `ToDo`
**As a** business user,
**I want to** regenerate a slide using a prompt and the existing content as context,
**so that** I can explore alternative visual approaches.

**Acceptance Criteria:**
- [ ] "Regenerate" button or prompt like "try a different layout for this slide"
- [ ] AI generates 1-3 alternative versions of the slide
- [ ] User can preview each alternative and choose one
- [ ] Original version always available to revert to

---

### AI-F05: Asset Generation

#### US-AI-006: Generate Images via AI — `ToDo`
**As a** business user,
**I want to** generate custom images using AI for my slides,
**so that** I can create unique visual content without external tools.

**Acceptance Criteria:**
- [ ] Text prompt to describe desired image
- [ ] AI generates image and places it on the canvas
- [ ] Multiple generation options to choose from
- [ ] Image respects slide dimensions and layout constraints

> **Note:** Phase 2 feature. MVP uses placeholder images and stock library.

---

## Technical References

- Previous module docs (absorbed into this cluster):
  - `ai-assistant/visual-suggestions.md`
  - `ai-assistant/script-feedback.md`
  - `ai-assistant/asset-generation.md`
- OpenAI GPT-4o integration (script analysis, slide generation)

## Dependencies

- Element editing (AI modifies elements on the canvas)
- Layouts and templates (AI may suggest layout changes)
- Animation and timing (auto-animation triggered by AI)
- Zustand `project-store` (slide data for AI context)
- OpenAI API (LLM integration)
