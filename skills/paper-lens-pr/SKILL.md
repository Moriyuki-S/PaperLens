---
name: paper-lens-pr
description: Generate PaperLens pull request titles and descriptions from local changes. Use when Codex is asked to draft PR text, summarize a branch for review, or prepare GitHub-ready PR copy without creating the PR.
---

# PaperLens PR Description

## Overview

Use this skill to draft reviewer-ready pull request titles and descriptions from the current working tree. The output should be specific, concise, and safe to paste into GitHub.

## Workflow

1. Read `AGENTS.md` and `AI_USAGE.md` before inspecting content that may be included in the PR description.
2. Read the pull request template before drafting. Prefer `.github/PULL_REQUEST_TEMPLATE.md`; if it does not exist, look for templates under `.github/PULL_REQUEST_TEMPLATE/`.
3. Start with `git status --short` and inspect changed files.
4. Inspect the current branch name and available local base refs before choosing a comparison base.
5. Prefer a user-provided base branch when one is supplied.
6. If no base branch is supplied, compare against the best available local base ref in this order: `origin/main`, `main`, `origin/develop`, `develop`.
7. Include uncommitted changes in the summary when present.
8. Generate only PR copy; do not commit, push, create a PR, edit files, run formatters, or run fixers.

## Privacy Rules

- Do not include private document text, real PDF metadata, secrets, credentials, local absolute paths, usernames, or sensitive environment values.
- If sensitive content appears in a diff, summarize it as redacted rather than quoting it.
- Keep PaperLens PDF handling privacy-sensitive by default.

## Output

- Output in English unless the user asks for another language.
- Provide a concise title in imperative or noun-phrase style.
- Provide a GitHub Markdown description ready to paste.
- Follow the repository pull request template structure and preserve its headings unless the user explicitly asks for a different format.
- Fill template placeholders with concrete content from the diff.
- Keep unresolved related issues as `N/A` instead of inventing an issue number.
- In checklist sections, mark only items that are clearly satisfied by the changes or available validation evidence.
- If validation evidence is unavailable, leave the relevant checklist item unchecked and mention `Not run (description generation only).` in the most appropriate template section.
- Add extra sections only when there is meaningful reviewer context, a migration concern, privacy concern, or known limitation that does not fit the template.
