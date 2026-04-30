# Tauri Map

## Current Structure

- `src-tauri/src/lib.rs` builds the Tauri app, initializes `tauri_plugin_opener`, registers commands, and runs the app.
- `src-tauri/src/main.rs` is the binary entry point.
- `src-tauri/src/greeting.rs` contains testable Rust logic for the sample greeting command.
- `src-tauri/tests/` contains Rust integration tests against the crate.
- `src-tauri/tauri.conf.json` contains app packaging and Tauri configuration.
- `src-tauri/capabilities/default.json` contains desktop capability permissions.
- `src-tauri/Cargo.toml` and `src-tauri/Cargo.lock` own Rust dependencies.

## Command Pattern

Use this shape for new Tauri commands:

```rust
mod feature_module;

#[tauri::command]
fn command_name(input: String) -> Result<OutputType, String> {
    feature_module::run(input).map_err(|error| error.to_string())
}

tauri::generate_handler![greet, command_name]
```

- Keep validation and filesystem or platform logic in `feature_module`.
- Return `Result<T, String>` or another serializable error shape when failures are expected.
- Add tests for the module logic before relying on frontend-driven behavior.

## Frontend Integration

- Use `@tauri-apps/api` from feature-level code when calling Rust from React.
- Keep browser-only fallbacks or guards explicit if a path can run in Vite outside Tauri.
- Avoid importing Tauri APIs into generic UI components unless the component is desktop-specific.

## Validation

- Run `npm run test:rust` or `cargo test --manifest-path src-tauri/Cargo.toml` after Rust changes.
- Run `bun run test:unit` when TypeScript invocation code changes.
- Run `bun run build` when command types, bundling, or shared configuration changes.
