# PDF Viewer Map

## Feature Files

- `src/features/pdf-viewer/PdfViewer.tsx` owns viewer state: selected file or URL, PDF document proxy, page count, current page, drag state, header visibility, load errors, zoom, page sizes, source dialog, scroll progress, and print.
- `src/features/pdf-viewer/components/PdfSourceInput/` owns shared file-drop and URL-entry UI.
- `src/features/pdf-viewer/components/PdfSourceDialog/` wraps source selection after the viewer is active.
- `src/features/pdf-viewer/components/PdfEmptyState/` owns the first-run source selection experience.
- `src/features/pdf-viewer/components/PdfViewerHeader/` owns document title, change PDF, zoom, print, and header-hide controls.
- `src/features/pdf-viewer/components/PdfOutlinePanel/` owns outline display and collapsed width behavior.
- `src/features/pdf-viewer/hooks/usePdfOutline.ts` resolves PDF outline destinations to page numbers and active outline state.
- `src/features/pdf-viewer/utils/pdfUrl.ts` normalizes and builds remote PDF URLs.

## PDF.js and Rendering

- `PdfViewer.tsx` configures `pdfjs.GlobalWorkerOptions.workerSrc` with `pdfjs-dist/build/pdf.worker.min.mjs`.
- Vite copies `pdfjs-dist/cmaps` to the app root through `vite-plugin-static-copy`; `Document` uses `options = { cMapUrl: '/cmaps/' }`.
- Do not replace the worker or CMap setup unless the task is specifically about PDF.js asset loading.
- `react-pdf` CSS imports for the annotation and text layers live in `PdfViewer.tsx`; keep them loaded when changing page rendering.

## Behavior Invariants

- `selectedFile` and `selectedUrl` are mutually exclusive.
- `resetViewerState()` should run when switching source and should reset page count, document proxy, current page, scroll progress, render/load flags, zoom, page sizes, drag depth, and header visibility.
- Drag state uses `dragDepthRef`; update it carefully so nested drag enter/leave events do not flicker.
- Zoom is clamped between `ZOOM_MIN` and `ZOOM_MAX`, rounded to one decimal, and displayed relative to `DEFAULT_ZOOM`.
- Outline clicks should resolve PDF destinations and scroll the internal viewer container, not the window.
- File object URLs used for printing must be revoked.

## Tests

- Component tests use Vitest, React Testing Library, and `user-event`.
- Utility tests live beside utilities, such as `src/features/pdf-viewer/utils/pdfUrl.test.ts`.
- Keep accessible labels stable when changing controls; existing tests use `getByRole`.
- Use Playwright for browser-visible flows in `e2e/app.spec.ts`.
- Useful commands:
  - `bun run test:unit`
  - `bun run test:e2e`
