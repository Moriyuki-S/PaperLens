import { Skeleton } from '@heroui/skeleton';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import {
    type ChangeEvent,
    type DragEvent,
    type FormEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { cn } from '../../lib/utils';
import { PdfEmptyState } from './components/PdfEmptyState';
import { PdfOutlinePanel } from './components/PdfOutlinePanel';
import { PdfSourceDialog } from './components/PdfSourceDialog';
import { PdfViewerHeader } from './components/PdfViewerHeader';
import { type OutlineEntry, usePdfOutline } from './hooks/usePdfOutline';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PdfViewerProps {
    className?: string;
}

interface PageSize {
    width: number;
    height: number;
}

const options = {
    cMapUrl: '/cmaps/',
};
const ZOOM_MIN = 0.6;
const DEFAULT_ZOOM = 0.9;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.1;
const clampZoom = (value: number) =>
    Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));
const roundZoom = (value: number) => Math.round(value * 10) / 10;

const Message = ({ children }: { children: ReactNode }) => (
    <div
        className={cn([
            'flex h-full items-center justify-center',
            'px-4 text-sm',
            'text-[#6b7280]',
        ])}
    >
        {children}
    </div>
);

const LoadingSkeleton = () => (
    <div className={cn(['flex w-full flex-col', 'gap-4'])}>
        <Skeleton className={cn(['h-6 w-48 w-full', 'rounded-large'])} />
        <Skeleton className={cn(['h-[700px] w-full', 'rounded-large'])} />
        <Skeleton className={cn(['h-[700px] w-full', 'rounded-large'])} />
    </div>
);

export const PdfViewer = ({ className = '' }: PdfViewerProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const dropZoneRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const pageAreaRef = useRef<HTMLDivElement | null>(null);
    const dragDepthRef = useRef(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
    const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(
        null,
    );
    const [containerWidth, setContainerWidth] = useState<number>();
    const [numPages, setNumPages] = useState<number>(0);
    const [isDragActive, setIsDragActive] = useState<boolean>(false);
    const [scrollProgress, setScrollProgress] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasRenderedPage, setHasRenderedPage] = useState<boolean>(false);
    const [hasLoadError, setHasLoadError] = useState<boolean>(false);
    const [isOutlineCollapsed, setIsOutlineCollapsed] =
        useState<boolean>(false);
    const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
    const [pageSizes, setPageSizes] = useState<Record<number, PageSize>>({});
    const [isSourceDialogOpen, setIsSourceDialogOpen] =
        useState<boolean>(false);
    const [urlInput, setUrlInput] = useState<string>('');
    const [selectionMenu, setSelectionMenu] = useState<{
        text: string;
        top: number;
        left: number;
    } | null>(null);
    const {
        outlineWithPages,
        activeOutlineId,
        activeOutlineIds,
        hoveredOutlineId,
        setHoveredOutlineId,
    } = usePdfOutline(pdfDocument, currentPage);
    const selectedSource = selectedFile ?? selectedUrl;
    const selectedSourceLabel = useMemo(() => {
        if (selectedFile) {
            return selectedFile.name;
        }
        if (!selectedUrl) {
            return null;
        }
        try {
            const url = new URL(selectedUrl);
            const pathname = url.pathname.replace(/\/+$/, '');
            const lastSegment = pathname.split('/').pop();
            return lastSegment || url.host;
        } catch {
            return selectedUrl;
        }
    }, [selectedFile, selectedUrl]);
    const hasPdf = Boolean(selectedSource) && numPages > 0;
    const zoomLabel = `${Math.round((zoom / DEFAULT_ZOOM) * 100)}%`;
    const canZoomIn = hasPdf && zoom < ZOOM_MAX;
    const canZoomOut = hasPdf && zoom > ZOOM_MIN;
    const canResetZoom = hasPdf && zoom !== DEFAULT_ZOOM;
    const canPrint = Boolean(selectedSource);

    const updateWidth = useCallback(() => {
        const element = scrollContainerRef.current;
        if (element) {
            setContainerWidth(element.clientWidth);
        }
    }, []);

    const resetViewerState = useCallback(() => {
        setNumPages(0);
        setPdfDocument(null);
        setCurrentPage(1);
        setScrollProgress(0);
        setHasRenderedPage(false);
        setHasLoadError(false);
        setZoom(DEFAULT_ZOOM);
        setPageSizes({});
        dragDepthRef.current = 0;
        setIsDragActive(false);
    }, []);

    const closeSourceDialog = useCallback(() => {
        setIsSourceDialogOpen(false);
        dragDepthRef.current = 0;
        setIsDragActive(false);
    }, []);

    const openSourceDialog = useCallback(() => {
        setIsSourceDialogOpen(true);
    }, []);
    const handleSourceDialogOpenChange = useCallback(
        (isOpen: boolean) => {
            if (isOpen) {
                setIsSourceDialogOpen(true);
            } else {
                closeSourceDialog();
            }
        },
        [closeSourceDialog],
    );

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

    const selectFile = useCallback(
        (files: FileList | File[] | null) => {
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
            setSelectedUrl(null);
            setUrlInput('');
            resetViewerState();
            closeSourceDialog();
        },
        [closeSourceDialog, resetViewerState],
    );

    const selectUrl = useCallback(
        (value: string) => {
            const trimmed = value.trim();
            if (!trimmed) {
                return;
            }
            setSelectedUrl(trimmed);
            setSelectedFile(null);
            setUrlInput(trimmed);
            resetViewerState();
            closeSourceDialog();
        },
        [closeSourceDialog, resetViewerState],
    );

    const handleSelectFile = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            selectFile(event.target.files);
            event.target.value = '';
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
        setHasLoadError(false);
    }, []);

    const handleLoadError = useCallback(() => {
        setHasLoadError(true);
    }, []);

    const handlePageRenderSuccess = useCallback(
        (page: { pageNumber: number; width: number; height: number }) => {
            setHasRenderedPage((prev) => prev || true);
            setPageSizes((prev) => {
                const current = prev[page.pageNumber];
                if (
                    current &&
                    current.width === page.width &&
                    current.height === page.height
                ) {
                    return prev;
                }
                return {
                    ...prev,
                    [page.pageNumber]: {
                        width: page.width,
                        height: page.height,
                    },
                };
            });
        },
        [],
    );

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
                    `[data-page-wrapper="${targetPageIndex + 1}"]`,
                ) as HTMLElement | null;

                if (pageElement) {
                    // Get the page viewport to calculate the Y position
                    const page = await pdfDocument.getPage(targetPageIndex + 1);
                    const viewport = page.getViewport({ scale: 1 });

                    // destination[3] contains the Y coordinate
                    const destY =
                        typeof destination[3] === 'number' ? destination[3] : 0;

                    // Calculate scroll position (PDF Y coordinates are from bottom)
                    const scrollContainer = scrollContainerRef.current;
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

    const handleOutlineEntryClick = useCallback(
        (item: OutlineEntry) => {
            if (!item.dest || !item.pageNumber) {
                return;
            }
            void handleOutlineItemClick({
                dest: item.dest,
                pageIndex: item.pageNumber - 1,
                pageNumber: item.pageNumber,
            });
        },
        [handleOutlineItemClick],
    );

    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) {
            return;
        }

        const maxScroll = container.scrollHeight - container.clientHeight;
        const progress =
            maxScroll > 0 ? (container.scrollTop / maxScroll) * 100 : 0;
        setScrollProgress(progress);

        const pageElements = Array.from(
            container.querySelectorAll('[data-page-wrapper]'),
        ) as HTMLElement[];
        if (pageElements.length === 0) {
            return;
        }

        const anchor = container.scrollTop + container.clientHeight * 0.2;
        let pageNumber = currentPage;
        for (const pageElement of pageElements) {
            if (pageElement.offsetTop + pageElement.offsetHeight >= anchor) {
                const parsed = Number(
                    pageElement.getAttribute('data-page-wrapper'),
                );
                pageNumber = Number.isNaN(parsed) ? pageNumber : parsed;
                break;
            }
        }

        if (pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
        }
    }, [currentPage]);

    const handleSelectionMenu = useCallback(() => {
        if (!selectedSource || numPages === 0) {
            setSelectionMenu(null);
            return;
        }

        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
            setSelectionMenu(null);
            return;
        }

        const selectedText = selection.toString().trim();
        if (!selectedText) {
            setSelectionMenu(null);
            return;
        }

        const range = selection.getRangeAt(0);
        const rects = range.getClientRects();
        const rect = rects[0] ?? range.getBoundingClientRect();
        if (!rect || rect.width === 0) {
            setSelectionMenu(null);
            return;
        }

        const anchorNode = selection.anchorNode;
        const anchorElement =
            anchorNode instanceof HTMLElement
                ? anchorNode
                : anchorNode?.parentElement;
        const pageElement = anchorElement?.closest(
            '[data-page-wrapper]',
        ) as HTMLElement | null;

        if (!pageElement) {
            setSelectionMenu(null);
            return;
        }

        const pageNumberValue = Number(
            pageElement.getAttribute('data-page-wrapper'),
        );
        if (!pageNumberValue || Number.isNaN(pageNumberValue)) {
            setSelectionMenu(null);
            return;
        }

        const container = scrollContainerRef.current;
        if (
            !container ||
            !anchorElement ||
            !container.contains(anchorElement)
        ) {
            setSelectionMenu(null);
            return;
        }

        const containerRect = container.getBoundingClientRect();
        const menuLeft =
            rect.left -
            containerRect.left +
            container.scrollLeft +
            rect.width / 2;
        const menuTop = rect.top - containerRect.top + container.scrollTop - 12;

        setSelectionMenu({
            text: selectedText,
            left: menuLeft,
            top: Math.max(menuTop, 8),
        });
    }, [selectedSource, numPages]);

    const handleSelectionTranslate = useCallback(() => {
        if (!selectionMenu) {
            return;
        }
        window.getSelection()?.removeAllRanges();
        setSelectionMenu(null);
    }, [selectionMenu]);

    const handleZoomIn = useCallback(() => {
        setZoom((prev) => clampZoom(roundZoom(prev + ZOOM_STEP)));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom((prev) => clampZoom(roundZoom(prev - ZOOM_STEP)));
    }, []);

    const handleZoomReset = useCallback(() => {
        setZoom(DEFAULT_ZOOM);
    }, []);

    const handlePrint = useCallback(() => {
        if (!selectedFile && !selectedUrl) {
            return;
        }
        const objectUrl = selectedFile
            ? URL.createObjectURL(selectedFile)
            : selectedUrl;
        const printWindow = window.open(objectUrl);
        if (!printWindow) {
            if (selectedFile) {
                URL.revokeObjectURL(objectUrl);
            }
            return;
        }

        const cleanup = () => {
            if (selectedFile) {
                URL.revokeObjectURL(objectUrl);
            }
        };

        printWindow.addEventListener(
            'load',
            () => {
                printWindow.focus();
                printWindow.print();
            },
            { once: true },
        );
        printWindow.addEventListener(
            'afterprint',
            () => {
                cleanup();
                printWindow.close();
            },
            { once: true },
        );
        if (selectedFile) {
            setTimeout(cleanup, 60_000);
        }
    }, [selectedFile, selectedUrl]);

    const handleUrlSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const trimmed = urlInput.trim();
            if (!trimmed) {
                return;
            }
            selectUrl(trimmed);
        },
        [selectUrl, urlInput],
    );

    useEffect(() => {
        if (selectedSource) {
            handleScroll();
        }
    }, [handleScroll, selectedSource]);

    useEffect(() => {
        const handleSelectionChange = () => {
            handleSelectionMenu();
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener(
                'selectionchange',
                handleSelectionChange,
            );
        };
    }, [handleSelectionMenu]);

    const pages = useMemo(() => {
        return Array.from({ length: numPages }, (_, index) => {
            const pageNumber = index + 1;
            const innerPadding = 48;
            const availableWidth =
                containerWidth && containerWidth > innerPadding
                    ? containerWidth - innerPadding
                    : (containerWidth ?? undefined);
            const baseWidth = availableWidth
                ? Math.min(availableWidth, 1200)
                : undefined;
            const pageSize = pageSizes[pageNumber];
            const pageRatio = pageSize
                ? pageSize.height / pageSize.width
                : undefined;
            const baseHeight =
                pageRatio && baseWidth
                    ? Math.round(baseWidth * pageRatio)
                    : undefined;
            const scaledWidth =
                baseWidth && zoom !== 1
                    ? Math.round(baseWidth * zoom)
                    : baseWidth;
            const scaledHeight =
                baseHeight && zoom !== 1
                    ? Math.round(baseHeight * zoom)
                    : baseHeight;

            return (
                <div
                    key={`page_${pageNumber}`}
                    data-page-wrapper={pageNumber}
                    className={cn(['mx-auto flex justify-center'])}
                    style={{
                        width: scaledWidth,
                        height: scaledHeight,
                    }}
                >
                    <div
                        className={cn(['inline-block'])}
                        style={{
                            transform:
                                zoom === 1 ? undefined : `scale(${zoom})`,
                            transformOrigin: 'top center',
                        }}
                    >
                        <Page
                            pageNumber={pageNumber}
                            renderAnnotationLayer
                            renderTextLayer
                            width={baseWidth}
                            className={cn([
                                'mx-auto overflow-hidden',
                                'rounded-large shadow-sm',
                            ])}
                            onRenderSuccess={handlePageRenderSuccess}
                        />
                    </div>
                </div>
            );
        });
    }, [containerWidth, handlePageRenderSuccess, numPages, pageSizes, zoom]);

    const isPdfLoading =
        Boolean(selectedSource) && !hasRenderedPage && !hasLoadError;

    return (
        <div
            className={cn(
                [
                    'flex h-screen flex-col',
                    'font-sans text-sm leading-relaxed',
                    'text-[#1a1a1a]',
                ],
                className,
            )}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleSelectFile}
                className={cn(['hidden'])}
            />

            <PdfViewerHeader
                selectedFileName={selectedSourceLabel}
                onSelectClick={openSourceDialog}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onZoomReset={handleZoomReset}
                zoomLabel={zoomLabel}
                canZoomIn={canZoomIn}
                canZoomOut={canZoomOut}
                canResetZoom={canResetZoom}
                onPrint={handlePrint}
                canPrint={canPrint}
            />
            <div className={cn(['h-0.5 w-full', 'bg-[#e5e5e5]'])}>
                <div
                    className={cn([
                        'h-full bg-[#1a1a1a]',
                        'transition-[width] duration-300',
                    ])}
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>
            <PdfSourceDialog
                isOpen={isSourceDialogOpen}
                onOpenChange={handleSourceDialogOpenChange}
                isDragActive={isDragActive}
                urlInput={urlInput}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onSelectFileClick={() => fileInputRef.current?.click()}
                onUrlChange={setUrlInput}
                onUrlSubmit={handleUrlSubmit}
            />

            <div
                ref={dropZoneRef}
                className={cn([
                    'relative flex-1 overflow-hidden',
                    'bg-[#f5f5f5] transition',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#1a1a1a]',
                ])}
                role="presentation"
            >
                {selectedSource ? (
                    <Document
                        file={selectedSource}
                        onLoadSuccess={handleLoadSuccess}
                        onLoadError={handleLoadError}
                        error={<Message>PDFの読み込みに失敗しました。</Message>}
                        options={options}
                        className={cn(['flex h-full w-full'])}
                    >
                        <PdfOutlinePanel
                            numPages={numPages}
                            outlineItems={outlineWithPages}
                            activeOutlineId={activeOutlineId}
                            activeOutlineIds={activeOutlineIds}
                            hoveredOutlineId={hoveredOutlineId}
                            isCollapsed={isOutlineCollapsed}
                            onHoverChange={setHoveredOutlineId}
                            onItemClick={handleOutlineEntryClick}
                            onToggle={() =>
                                setIsOutlineCollapsed((prev) => !prev)
                            }
                        />

                        <main className={cn(['flex min-w-0 flex-1 flex-col'])}>
                            <div
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                                className={cn([
                                    'relative flex-1 overflow-auto',
                                    'px-6 pb-10',
                                ])}
                            >
                                <div
                                    ref={pageAreaRef}
                                    className={cn([
                                        'mx-auto w-full',
                                        zoom > 1 ? 'max-w-none' : 'max-w-5xl',
                                    ])}
                                    style={{
                                        minWidth:
                                            zoom > 1 &&
                                            containerWidth &&
                                            containerWidth > 48
                                                ? `${Math.round(
                                                      Math.min(
                                                          containerWidth - 48,
                                                          1200,
                                                      ) * zoom,
                                                  )}px`
                                                : undefined,
                                    }}
                                >
                                    {selectionMenu ? (
                                        <div
                                            className={cn([
                                                'pointer-events-none absolute left-0 top-0',
                                                'z-30',
                                            ])}
                                            aria-hidden
                                        >
                                            <div
                                                className={cn([
                                                    'pointer-events-auto flex items-center',
                                                    'gap-2 rounded-md border border-[#e5e5e5]',
                                                    'bg-white px-3 py-2',
                                                    'text-xs shadow-md',
                                                ])}
                                                style={{
                                                    left: `${selectionMenu.left}px`,
                                                    top: `${selectionMenu.top}px`,
                                                    position: 'absolute',
                                                    transform:
                                                        'translateX(-50%)',
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleSelectionTranslate
                                                    }
                                                    className={cn([
                                                        'rounded-md px-2 py-1',
                                                        'text-[#6b7280]',
                                                        'transition hover:bg-[#f5f5f5]',
                                                    ])}
                                                >
                                                    日本語訳
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                    {numPages === 0 ? (
                                        hasLoadError ? null : (
                                            <LoadingSkeleton />
                                        )
                                    ) : (
                                        <div className={cn(['relative'])}>
                                            {isPdfLoading ? (
                                                <div
                                                    className={cn([
                                                        'absolute inset-0 z-10',
                                                    ])}
                                                >
                                                    <LoadingSkeleton />
                                                </div>
                                            ) : null}
                                            <div
                                                className={cn(
                                                    [
                                                        'flex w-full flex-col items-center',
                                                        'gap-6 transition-opacity duration-200',
                                                    ],
                                                    isPdfLoading
                                                        ? [
                                                              'pointer-events-none',
                                                              'opacity-0',
                                                          ]
                                                        : 'opacity-100',
                                                )}
                                            >
                                                {pages}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </main>
                    </Document>
                ) : (
                    <div className={cn(['flex h-full'])}>
                        <PdfOutlinePanel
                            numPages={numPages}
                            outlineItems={outlineWithPages}
                            activeOutlineId={activeOutlineId}
                            activeOutlineIds={activeOutlineIds}
                            hoveredOutlineId={hoveredOutlineId}
                            isCollapsed={isOutlineCollapsed}
                            emptyMessage="目次はPDF読み込み後に表示されます。"
                            onHoverChange={setHoveredOutlineId}
                            onItemClick={handleOutlineEntryClick}
                            onToggle={() =>
                                setIsOutlineCollapsed((prev) => !prev)
                            }
                        />

                        <main className={cn(['flex min-w-0 flex-1 flex-col'])}>
                            <div
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                                className={cn([
                                    'flex-1 overflow-auto',
                                    'px-6 pb-10',
                                ])}
                            >
                                <div
                                    ref={pageAreaRef}
                                    className={cn([
                                        'mx-auto w-full',
                                        'max-w-5xl',
                                    ])}
                                >
                                    <PdfEmptyState
                                        isDragActive={isDragActive}
                                        urlInput={urlInput}
                                        onDragEnter={handleDragEnter}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onSelectFileClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        onUrlChange={setUrlInput}
                                        onUrlSubmit={handleUrlSubmit}
                                    />
                                </div>
                            </div>
                        </main>
                    </div>
                )}
            </div>
        </div>
    );
};
