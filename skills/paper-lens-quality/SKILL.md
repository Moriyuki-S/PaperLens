---
name: paper-lens-quality
description: Choose and run the right PaperLens validation workflow. Use when Codex is asked to test, lint, format, build, prepare a PR, verify changes, debug failing checks, or decide which Bun, Vitest, Playwright, Biome, TypeScript, Vite, Cargo, or Tauri checks apply.
---

# PaperLens Quality

## Overview

Use this skill to select the smallest credible validation set for PaperLens changes. Prefer targeted checks while editing, then broaden when the touched surface crosses React, Tauri, build config, or end-to-end behavior.

## Workflow

1. Read `references/checks.md` before choosing checks.
2. Identify touched surfaces: React component, utility, PDF viewer behavior, Tauri/Rust, config, dependency, or browser workflow.
3. Run the most targeted check first.
4. Broaden only when the change affects shared behavior, integration, bundling, or user-visible flows.
5. Report any check that could not run, including the command and the reason.

## Defaults

- Use Bun for frontend package scripts because `bun.lock` is present.
- Use `npm run test:rust` for the Rust crate because the README documents that repo-root command.
- Use Playwright for browser behavior, not for pure component logic.
- Use `bun run build` when TypeScript types, Vite config, PDF.js assets, or Tauri-facing frontend code are touched.

## References

- `references/checks.md`: command matrix, when to run each check, and common validation paths.
