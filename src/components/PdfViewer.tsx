import { Skeleton } from '@heroui/skeleton';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import {
    type ChangeEvent,
    type DragEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Document, Outline, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PdfViewerProps {
    className?: string;
}

const options = {
    cMapUrl: '/cmaps/',
};

const Message = ({ children }: { children: ReactNode }) => (
    <div className="flex h-full items-center justify-center px-4 text-sm text-foreground-500">
        {children}
    </div>
);

const LoadingSkeleton = () => (
    <div className="flex w-full flex-col gap-4">
        <Skeleton className="h-6 w-48 w-full rounded-large" />
        <Skeleton className="h-[700px] w-full rounded-large" />
        <Skeleton className="h-[700px] w-full rounded-large" />
    </div>
);

export const PdfViewer = ({ className = '' }: PdfViewerProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const dropZoneRef = useRef<HTMLDivElement | null>(null);
    const dragDepthRef = useRef(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(
        null,
    );
    const [containerWidth, setContainerWidth] = useState<number>();
    const [numPages, setNumPages] = useState<number>(0);
    const [isDragActive, setIsDragActive] = useState<boolean>(false);

    const updateWidth = useCallback(() => {
        const element = dropZoneRef.current;
        if (element) {
            setContainerWidth(element.clientWidth);
        }
    }, []);

    // Update container width on resize
    useEffect(() => {
        updateWidth();
        const element = dropZoneRef.current;
        if (!element) {
            return;
        }

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', updateWidth);
            return () => {
                window.removeEventListener('resize', updateWidth);
            };
        }

        const observer = new ResizeObserver(() => {
            updateWidth();
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [updateWidth]);

    const selectFile = useCallback((files: FileList | File[] | null) => {
        if (!files || files.length === 0) {
            return;
        }

        const pdfFile = Array.from(files).find(
            (file) =>
                file.type === 'application/pdf' ||
                file.name.toLowerCase().endsWith('.pdf'),
        );

        if (!pdfFile) {
            return;
        }

        setSelectedFile(pdfFile);
        dragDepthRef.current = 0;
        setIsDragActive(false);
    }, []);

    const handleSelectFile = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            selectFile(event.target.files);
            event.target.value = '';
            setNumPages(0);
        },
        [selectFile],
    );

    const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepthRef.current += 1;
        setIsDragActive(true);
    }, []);

    const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }, []);

    const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepthRef.current = Math.max(dragDepthRef.current - 1, 0);
        if (dragDepthRef.current === 0) {
            setIsDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();
            dragDepthRef.current = 0;
            setIsDragActive(false);
            selectFile(event.dataTransfer?.files ?? null);
        },
        [selectFile],
    );

    const handleLoadSuccess = useCallback((pdf: PDFDocumentProxy) => {
        setNumPages(pdf.numPages);
        setPdfDocument(pdf);
    }, []);

    const handleOutlineItemClick = useCallback(
        async ({
            dest,
            pageNumber,
        }: {
            dest?: unknown;
            pageIndex: number;
            pageNumber: number;
        }) => {
            if (!pdfDocument || !dest) {
                return;
            }

            try {
                // Get the destination array
                const destination =
                    typeof dest === 'string'
                        ? await pdfDocument.getDestination(dest)
                        : dest;

                if (!Array.isArray(destination)) {
                    return;
                }

                const [ref] = destination;

                // Get page index from reference
                const targetPageIndex =
                    typeof ref === 'object' && ref !== null
                        ? await pdfDocument.getPageIndex(ref)
                        : pageNumber - 1;

                // Find the target page element
                const pageElement = document.querySelector(
                    `[data-page-number="${targetPageIndex + 1}"]`,
                ) as HTMLElement | null;

                if (pageElement) {
                    // Get the page viewport to calculate the Y position
                    const page = await pdfDocument.getPage(targetPageIndex + 1);
                    const viewport = page.getViewport({ scale: 1 });

                    // destination[3] contains the Y coordinate
                    const destY =
                        typeof destination[3] === 'number' ? destination[3] : 0;

                    // Calculate scroll position (PDF Y coordinates are from bottom)
                    const scrollContainer =
                        dropZoneRef.current?.querySelector('.overflow-auto');
                    if (scrollContainer) {
                        const pageRect = pageElement.getBoundingClientRect();
                        const containerRect =
                            scrollContainer.getBoundingClientRect();

                        // Convert PDF coordinates to screen coordinates
                        const scale = pageRect.height / viewport.height;
                        const offsetY = (viewport.height - destY) * scale;

                        const scrollTop =
                            pageElement.offsetTop +
                            offsetY -
                            containerRect.height / 5;

                        scrollContainer.scrollTo({
                            top: Math.max(0, scrollTop),
                            behavior: 'smooth',
                        });
                    }
                }
            } catch (error) {
                //FIXME: エラーハンドリング
                console.error('Failed to navigate to outline item:', error);
            }
        },
        [pdfDocument],
    );

    const pages = useMemo(() => {
        return Array.from({ length: numPages }, (_, index) => {
            const pageNumber = index + 1;
            const innerPadding = 48;
            const availableWidth =
                containerWidth && containerWidth > innerPadding
                    ? containerWidth - innerPadding
                    : (containerWidth ?? undefined);

            return (
                <Page
                    key={`page_${pageNumber}`}
                    pageNumber={pageNumber}
                    renderAnnotationLayer
                    renderTextLayer
                    width={
                        availableWidth
                            ? Math.min(availableWidth, 1200)
                            : undefined
                    }
                    className="w-full overflow-hidden rounded-large shadow-sm"
                />
            );
        });
    }, [containerWidth, numPages]);

    const dropZoneBase =
        'relative flex-1 overflow-hidden bg-content1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-sky-600';
    const dropZoneActive = isDragActive
        ? 'outline outline-2 outline-offset-0 outline-sky-500 ring-0'
        : 'outline outline-transparent';

    return (
        <div className={`flex h-full flex-col ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleSelectFile}
                className="hidden"
            />

            {/** biome-ignore lint/a11y/noStaticElementInteractions: PDFドラッグに必要なコンポーネントのため */}
            <div
                ref={dropZoneRef}
                className={`${dropZoneBase} ${dropZoneActive}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="presentation"
            >
                {selectedFile ? (
                    <div className="flex h-full flex-col">
                        <div className="flex flex-wrap items-center gap-3 border-b border-default-200 bg-content2/80 px-6 py-3">
                            <div className="flex min-w-0 flex-1 items-center gap-2 text-sm text-foreground-500">
                                <span className="truncate font-medium text-foreground">
                                    {selectedFile.name}
                                </span>
                                <span className="shrink-0 text-foreground-400">
                                    {numPages > 0
                                        ? `${numPages}ページ`
                                        : '読み込み中…'}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="shrink-0 rounded-large bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 active:bg-sky-700"
                            >
                                別のPDFを選択
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto px-6 pb-6">
                            <Document
                                file={selectedFile}
                                onLoadSuccess={handleLoadSuccess}
                                loading={<LoadingSkeleton />}
                                error={
                                    <Message>
                                        PDFの読み込みに失敗しました。
                                    </Message>
                                }
                                noData={
                                    <Message>
                                        PDFファイルを選択してください
                                    </Message>
                                }
                                options={options}
                                className="w-full flex flex-col items-center gap-6"
                            >
                                <Outline
                                    className={[
                                        '[&>ul]:list-disc',
                                        '[&>ul]:pl-5]}',
                                    ]}
                                    onItemClick={handleOutlineItemClick}
                                />
                                {pages}
                            </Document>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`flex h-full flex-col items-center justify-center gap-4 px-8 text-center ${
                            isDragActive ? 'bg-sky-50/70' : ''
                        }`}
                    >
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded-3xl bg-sky-600 px-10 py-5 text-lg font-semibold text-white shadow-lg transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-sky-500 active:bg-sky-700"
                        >
                            PDFを選択
                        </button>
                        <p className="text-sm text-foreground-500">
                            {isDragActive
                                ? 'ここにドロップしてください'
                                : 'またはPDFファイルをここにドラッグ＆ドロップ'}
                        </p>
                        <p className="text-xs text-foreground-400">
                            対応形式: PDFファイル (.pdf)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
