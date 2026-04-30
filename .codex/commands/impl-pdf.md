# /impl-pdf

Implement a PaperLens PDF viewer change.

## Usage

```text
/impl-pdf <PDF viewer implementation request>
```

## Prompt

Use `AGENTS.md`, `AI_USAGE.md`, `skills/paper-lens-pdf-viewer`, and `skills/paper-lens-quality`.

Implement this PDF viewer request:

```text
<PDF viewer implementation request>
```

Requirements:

- Read the relevant skill reference before editing.
- Keep file and URL PDF sources mutually exclusive.
- Preserve PDF.js worker, CMap, annotation layer, and text layer setup unless the request specifically targets them.
- Keep accessible names stable for viewer controls.
- Add or update focused Vitest tests for component, hook, or utility behavior.
- Run the smallest credible validation set and report any command that could not run.
