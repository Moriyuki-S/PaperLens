# PaperLens Agent Guide

## Project Overview

PaperLens is a Tauri v2 desktop app built with React, TypeScript, Vite, Tailwind CSS, HeroUI, and Rust. The main product surface is a PDF viewer that supports local file selection, remote PDF URLs, drag and drop, PDF.js rendering through `react-pdf`, outlines, zoom, and printing.

## Working Rules

- Keep changes tightly scoped to the requested behavior.
- Do not revert or overwrite unrelated user changes.
- Prefer existing project patterns over new abstractions.
- Use `rg` or `rg --files` for repository search.
- Use `apply_patch` for manual file edits.
- Keep generated or edited text ASCII unless an existing file requires otherwise.
- Add focused tests when behavior changes; do not add broad test churn for documentation-only edits.
- Follow `AI_USAGE.md` before sharing logs, screenshots, PDFs, environment values, or document-derived content with AI tools.

## Role & Persona
You are an expert Full-Stack Developer specializing in Tauri v2, React, TypeScript, and Rust. You write clean, maintainable, and highly performant code. You always strictly follow the user's instructions and project patterns without introducing unnecessary abstractions.

## Architecture Notes

- `src/features/pdf-viewer/` owns PDF viewer state, UI, hooks, and utilities.
- `src/components/ui/` contains reusable UI primitives.
- `src/tests/` contains shared Vitest and React Testing Library setup.
- `e2e/` contains Playwright browser tests.
- `src-tauri/` owns the Tauri shell, Rust commands, capabilities, and Rust tests.
- `skills/` contains Codex skills that document recurring workflows for this repository.

## Skills Usage

- Use `skills/paper-lens-pdf-viewer` for PDF loading, file or URL selection, drag and drop, rendering, outline navigation, zoom, print, layout, or viewer tests.
- Use `skills/paper-lens-tauri` for Tauri commands, Rust modules, desktop capabilities, frontend-to-Rust invocation, and Rust tests.
- Use `skills/paper-lens-quality` when choosing validation commands before finishing work.
- Use `skills/paper-lens-pr` for generating pull request titles and descriptions from local changes.

## Custom Commands

- Use `.codex/commands/plan-pdf.md` as `/plan-pdf` for PDF viewer implementation planning.
- Use `.codex/commands/impl-pdf.md` as `/impl-pdf` for PDF viewer implementation work.
- Use `.codex/commands/impl-tauri.md` as `/impl-tauri` for Tauri and Rust implementation work.
- Use `.codex/commands/check.md` as `/check` for selecting and running validation.
- Use `.codex/commands/review-ai-risk.md` as `/review-ai-risk` for AI usage, privacy, and confidentiality review.
- Use `.codex/commands/pr-description.md` as `/pr-description` for generating a pull request title and description.

## Validation

- Use Bun for frontend scripts because `bun.lock` is present.
- Run `bun run test:unit` for React components, hooks, utilities, and jsdom behavior.
- Run `bun run test:e2e` for browser-visible flows such as the empty state, file selection, rendering, and major PDF viewer interactions.
- Run `bun run build` when TypeScript types, Vite config, PDF.js assets, or production bundling may be affected.
- Run `npm run test:rust` for Rust or Tauri command logic.
- Run `bun run lint:check` for lint and import validation when TypeScript or JSX structure changes.

## UI Guidelines

- Preserve accessible names for controls; tests rely on role and name queries.
- Prefer existing HeroUI, Tailwind, and local `cn` patterns.
- Keep fixed-format UI stable around toolbars, PDF pages, outlines, counters, and loading states.
- Use existing component boundaries before moving state into `PdfViewer.tsx`.
- Use browser-level tests for user-visible workflows and Vitest for component or utility behavior.
