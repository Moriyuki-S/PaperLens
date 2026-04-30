# /impl-tauri

Implement a PaperLens Tauri or Rust desktop integration change.

## Usage

```text
/impl-tauri <Tauri or Rust implementation request>
```

## Prompt

Use `AGENTS.md`, `AI_USAGE.md`, `skills/paper-lens-tauri`, and `skills/paper-lens-quality`.

Implement this Tauri or Rust request:

```text
<Tauri or Rust implementation request>
```

Requirements:

- Keep reusable Rust logic in modules under `src-tauri/src`.
- Keep Tauri command wrappers thin and serializable.
- Register new commands in the Tauri invoke handler when needed.
- Update capabilities only when the feature requires it.
- Add Rust tests for testable Rust logic.
- Run `npm run test:rust`; also run frontend checks if TypeScript invocation changes.
