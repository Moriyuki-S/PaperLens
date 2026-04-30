# PaperLens Implementation Roadmap

## Product Direction

PaperLens is a desktop PDF reading app focused on opening, inspecting, and navigating PDFs with a reliable native-app feel. The near-term goal is to turn the current viewer foundation into a dependable reading workflow before expanding desktop integrations.

## Current State

- The app can open PDFs from local files or remote URLs.
- PDF rendering is handled by `react-pdf` and PDF.js, including worker and CMap setup.
- The viewer includes drag and drop, an empty state, source dialog, outline panel, zoom controls, header visibility, and print support.
- Tauri v2 is configured with a Rust crate, a sample command, and Rust tests.
- Validation is available through Vitest, Playwright, Biome, Vite build, and Cargo tests.

## Roadmap

### 1. Viewer Reliability

- Improve load failure states for invalid files, unreachable URLs, unsupported PDFs, and blocked remote resources.
- Keep PDF.js worker and CMap asset handling stable across development, production build, and Tauri runtime.
- Make source switching predictable by preserving the rule that file and URL sources are mutually exclusive.
- Acceptance criteria: users can understand why a PDF failed to open and can recover by selecting another source without refreshing the app.

### 2. Reading UX

- Add direct page navigation and current page visibility.
- Improve outline navigation feedback and collapsed outline behavior.
- Add document search after page navigation is stable.
- Acceptance criteria: users can move to a known page, see where they are in the document, and navigate document structure without losing context.

### 3. Desktop Integration

- Move desktop-specific file workflows behind Tauri commands or plugins when browser APIs are not enough.
- Add recently opened PDFs once source persistence and privacy expectations are defined.
- Keep Rust logic testable in modules under `src-tauri/src/` with thin Tauri command wrappers.
- Acceptance criteria: desktop-only behavior works in Tauri without breaking Vite browser development.

### 4. Quality Baseline

- Keep component and utility behavior covered by Vitest.
- Expand Playwright coverage around the core PDF opening flow as viewer features mature.
- Run Rust tests for Tauri logic and production builds for PDF.js or Vite changes.
- Acceptance criteria: each feature lands with the smallest credible validation set documented in the final change summary.

## Validation Strategy

- React component or utility changes: run `bun run test:unit`.
- PDF rendering, worker, CMap, or Vite asset changes: run `bun run test:unit`, `bun run build`, and `bun run test:e2e`.
- Browser-visible PDF workflows: run `bun run test:unit` and `bun run test:e2e`.
- Tauri or Rust command changes: run `npm run test:rust`; add frontend checks when TypeScript invocation changes.
- Shared config or dependency changes: run `bun run lint:check`, `bun run test:unit`, and `bun run build`.
