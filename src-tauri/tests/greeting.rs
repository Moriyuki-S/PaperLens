use paper_lens_lib::greeting::format_greeting;

#[test]
fn greeting_module_is_available_to_integration_tests() {
    assert_eq!(
        format_greeting("Tauri"),
        "Hello, Tauri! You've been greeted from Rust!",
    );
}
