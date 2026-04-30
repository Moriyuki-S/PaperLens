# AI Usage and Confidentiality Rules

## Purpose

PaperLens is a PDF desktop app, so development work may involve documents that contain personal, business, legal, financial, academic, or customer information. Treat every real PDF and environment value as sensitive unless it is clearly public test data.

## Do Not Share With AI

Do not paste, upload, summarize, screenshot, or otherwise provide the following to AI tools:

- `.env` files or environment variable dumps.
- API keys, tokens, passwords, private certificates, signing keys, or recovery codes.
- Personal PDFs, business PDFs, contracts, invoices, statements, manuscripts, research drafts, or customer documents.
- Proprietary documents, internal meeting notes, private emails, or unpublished specs.
- Logs that include local file paths, usernames, access tokens, document text, URLs with credentials, or document metadata.
- Screenshots that show private PDF content, account information, file paths, or secrets.

## Safe Ways To Ask AI For Help

- Use synthetic PDFs, public sample PDFs, or minimal repro files with fake content.
- Replace secrets with placeholders such as `REDACTED_API_KEY`, `example.pdf`, or `https://example.com/sample.pdf`.
- Describe document structure without copying the real content, for example: "a 12-page PDF with a nested outline and rotated pages."
- Share code, stack traces, and test failures only after checking that they do not include document text or secrets.
- Prefer small, focused excerpts over full logs.

## Required Review Before Sharing

Before sending any project artifact to an AI tool, check:

- Does it contain real PDF text or metadata?
- Does it contain credentials, tokens, local paths, usernames, or customer identifiers?
- Does it reveal private business, personal, legal, financial, medical, or academic content?
- Can the same question be answered with a synthetic sample instead?

If the answer is unclear, do not share it. Create a sanitized reproduction.

## Rules For AI-Generated Changes

- AI-generated code must not introduce telemetry, document upload, remote processing, or persistence of PDF content without explicit human approval.
- AI-generated tests must use synthetic or public sample data only.
- AI-generated documentation must not include real user document content, real secrets, or private local paths.
- Any feature that stores recent files, document metadata, extracted text, or thumbnails must include an explicit privacy review before implementation.

## Incident Handling

If sensitive information is accidentally shared with an AI tool:

1. Stop sharing related context immediately.
2. Record what was shared and where.
3. Rotate any exposed credentials or tokens.
4. Replace the conversation input with sanitized examples before continuing.
5. Review the resulting code or docs for copied sensitive content.
