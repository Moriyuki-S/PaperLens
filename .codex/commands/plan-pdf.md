# /plan-pdf

Plan a PaperLens PDF viewer change before implementation.

## Usage

```text
/plan-pdf <PDF viewer change request>
```

## Prompt

Use `AGENTS.md`, `AI_USAGE.md`, `Plan.md`, `skills/paper-lens-pdf-viewer`, and `skills/paper-lens-quality`.

Create a decision-complete implementation plan for this PDF viewer request:

```text
<PDF viewer change request>
```

Requirements:

- Inspect the current code before planning.
- Keep the plan scoped to `src/features/pdf-viewer` unless another area is clearly required.
- Identify affected behavior, component boundaries, tests, and validation commands.
- Do not implement changes while planning.
- Include assumptions if the request is ambiguous.
