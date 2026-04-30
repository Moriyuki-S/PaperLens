---
name: paper-lens-pdf-viewer
description: Build and maintain the PaperLens PDF viewer React feature. Use when Codex is asked to change PDF loading, URL/file selection, drag and drop, react-pdf/pdf.js rendering, outline navigation, zoom, print, viewer layout, or tests under src/features/pdf-viewer.
---

# PaperLens PDF Viewer

## Overview

Use this skill for feature work in the React PDF viewer. Keep changes consistent with the existing feature module rather than spreading viewer-specific logic across the app.

## Workflow

1. Read `references/pdf-viewer-map.md` before editing viewer behavior.
2. Locate the smallest owner file for the requested behavior.
3. Preserve the current source model: file upload and remote URL are mutually exclusive, and selecting a new source resets viewer state.
4. Keep PDF.js setup intact unless the task is explicitly about worker or CMap loading.
5. Add or update focused Vitest tests for component or utility behavior. Use Playwright only for browser-level flows such as empty state, file selection, rendering, or keyboard-visible interactions.

## Implementation Notes

- Keep feature exports routed through `src/features/pdf-viewer/index.ts`.
- Use existing component boundaries under `components/` before adding new top-level state to `PdfViewer.tsx`.
- Prefer small pure utilities in `utils/` when behavior can be tested without rendering React.
- Maintain accessible names for toolbar controls; tests query buttons by role and name.
- Keep layout dimensions stable around page rendering, zoom controls, outline collapse, and loading skeletons to avoid visual shifts.

## References

- `references/pdf-viewer-map.md`: file ownership, react-pdf setup, behavior invariants, and test guidance.
