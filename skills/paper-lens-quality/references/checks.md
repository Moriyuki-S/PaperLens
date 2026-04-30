# PaperLens Checks

## Commands

- `bun run test:unit`: Vitest tests for React components, hooks, utilities, and jsdom behavior.
- `bun run test:coverage`: Vitest with coverage when broader confidence is needed.
- `bun run test:e2e`: Playwright browser tests; Vite server is started by `playwright.config.ts`.
- `bun run test:e2e:headed`: Playwright with a visible browser for debugging.
- `bun run lint:check`: Biome check using `biome.json`.
- `bun run lint:fix`: Biome fix for safe lint and import organization changes.
- `bun run format:check`: Biome format check.
- `bun run format:fix`: Biome write formatting.
- `bun run build`: TypeScript check plus Vite production build.
- `npm run test:rust`: Cargo tests for `src-tauri/Cargo.toml`.

## Check Selection

- React component only: run the touched component tests or `bun run test:unit`; add `bun run lint:check` if imports, accessibility, or structure changed.
- Utility only: run the utility test file or `bun run test:unit`; add build if exported types changed.
- PDF viewer rendering, worker, CMap, or Vite asset config: run `bun run test:unit`, `bun run build`, and `bun run test:e2e`.
- Browser-visible workflow such as file selection, empty state, drag/drop, zoom, print, or outline: run `bun run test:unit` plus `bun run test:e2e`.
- Tauri or Rust command logic: run `npm run test:rust`; add `bun run test:unit` if frontend invocation changed.
- Shared config or dependencies: run `bun run lint:check`, `bun run test:unit`, and `bun run build`; add targeted Rust or Playwright checks if affected.

## Project Notes

- Biome is configured for 4-space indentation and single quotes in JavaScript/TypeScript.
- `biome.json` currently includes `src/**/*.{astro,ts,js,tsx,jsx,md,mdx}` and excludes `src/lib`.
- Vitest uses `src/tests/setup.ts` and React Testing Library helpers from `src/tests/test-utils.tsx`.
- Keep tests focused on observable behavior and accessible names.
- Do not leave long-running dev servers open after validation unless the user asked for one.
