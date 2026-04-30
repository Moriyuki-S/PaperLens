---
name: paper-lens-tauri
description: Add, debug, or test PaperLens desktop integration through Tauri v2 and Rust. Use when Codex is asked to change src-tauri, Tauri commands, Rust modules, desktop capabilities, tauri.conf.json, the Tauri opener plugin, frontend-to-Rust invocation, or Rust tests.
---

# PaperLens Tauri

## Overview

Use this skill for PaperLens desktop-shell work. Keep Rust logic testable outside Tauri command wrappers, and keep frontend integration aligned with Tauri v2.

## Workflow

1. Read `references/tauri-map.md` before changing `src-tauri`.
2. Put reusable Rust logic in a module under `src-tauri/src/`; keep command functions thin.
3. Register new commands in `tauri::generate_handler!` and update capabilities only when required by the feature.
4. If the React app invokes the command, keep the TypeScript call site isolated behind a small helper or feature-level function.
5. Run Rust tests for Rust changes and frontend checks for TypeScript call-site changes.

## Implementation Notes

- Prefer typed command arguments and return values that serialize cleanly through Tauri.
- Avoid putting business logic directly inside `#[tauri::command]` functions when it can be tested as plain Rust.
- Keep `src-tauri/tests/` for integration tests that use the public crate API.
- Preserve the existing Tauri v2 plugin setup unless the requested feature needs another plugin.

## References

- `references/tauri-map.md`: current Tauri files, command pattern, test approach, and validation commands.
