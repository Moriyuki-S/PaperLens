# /review-ai-risk

Review current changes for AI usage, privacy, and confidentiality risks.

## Usage

```text
/review-ai-risk
```

## Prompt

Use `AGENTS.md` and `AI_USAGE.md`.

Review the current working tree for AI usage and confidentiality risks.

Requirements:

- Inspect changed files only unless a changed file references another relevant file.
- Look for committed secrets, real PDF content, private file paths, document text, tokens, credentials, telemetry, remote upload behavior, document persistence, thumbnails, metadata storage, and logs that may expose private content.
- Treat PaperLens PDF handling as privacy-sensitive by default.
- Report findings first, ordered by severity, with file and line references.
- If no issues are found, say that clearly and mention residual risk.
