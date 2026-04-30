# /pr-description

Generate a pull request title and description for the current PaperLens changes.

## Usage

```text
/pr-description [optional base branch or extra context]
```

## Prompt

Use `AGENTS.md`, `AI_USAGE.md`, and `skills/paper-lens-pr`.

Generate a GitHub pull request title and description for the current changes.

If an optional base branch or extra context is provided, use it:

```text
[optional base branch or extra context]
```

Requirements:

- Follow the `paper-lens-pr` workflow.
- Read and follow the repository pull request template when one exists.
- Do not commit, push, create a PR, edit files, run formatters, or run fixers.
- Return only the PR title and GitHub Markdown description.
