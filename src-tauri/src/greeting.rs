pub fn format_greeting(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg(test)]
mod tests {
    use super::format_greeting;

    #[test]
    fn formats_the_expected_message() {
        assert_eq!(
            format_greeting("PaperLens"),
            "Hello, PaperLens! You've been greeted from Rust!",
        );
    }
}
