# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Rust Tests

Run the Tauri crate tests from the repo root with:

```bash
npm run test:rust
```

Or call Cargo directly:

```bash
cargo test --manifest-path src-tauri/Cargo.toml
```

Place Rust integration tests under `src-tauri/tests` and testable logic in regular Rust modules under `src-tauri/src`.

## React Tests

Vitest is configured with `jsdom` and React Testing Library.

Run the frontend tests with:

```bash
bun run test:unit
```

Shared test setup lives in `src/tests/setup.ts`.
