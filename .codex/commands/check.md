# /check

Choose and run the right validation checks for the current PaperLens changes.

## Usage

```text
/check
```

## Prompt

Use `AGENTS.md`, `AI_USAGE.md`, and `skills/paper-lens-quality`.

Inspect the current working tree and run the smallest credible validation set for the changes.

Requirements:

- Start with `git status --short` and inspect changed files.
- Select checks based on the touched surfaces.
- Prefer targeted checks when possible.
- Do not run formatters or fixers unless explicitly asked.
- Report each command run and whether it passed, failed, or could not run.
- If a check fails, summarize the failure and identify the likely owner area.
