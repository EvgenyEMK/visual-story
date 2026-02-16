# Demo

> **Status:** `planned`
> **MVP:** Yes (minimal)

## Overview

The demo module provides an interactive product demonstration for prospective users. It allows visitors to experience the core value of VisualStory without signing up — either through a guided walkthrough or a sandbox environment with pre-loaded content.

## Planned Features

| Feature | Status | Summary |
|---------|--------|---------|
| Guided demo | `planned` | Step-by-step walkthrough showing script → slides → animation → export flow |
| Sample presentations | `planned` | Pre-built example presentations that visitors can view in the web player |
| Try-it sandbox | `planned` | Limited editor experience with pre-loaded content (no account required) |

## User Flow

1. Visitor clicks "See Demo" from home page or navigation
2. Chooses guided walkthrough or browses sample presentations
3. Experiences the core product loop (script → generate → preview)
4. CTA: "Create your own — Sign up free" → redirected to [auth/](../auth/) sign-up

## Dependencies

- [slide-player/](../slide-player/) — Sample presentations use the web player
- [slide-editor/](../slide-editor/) — Sandbox mode uses a restricted version of the editor

## Notes

- Demo scope for MVP is minimal — likely just sample presentations in the web player.
- Full interactive sandbox is a Phase 2 feature.
