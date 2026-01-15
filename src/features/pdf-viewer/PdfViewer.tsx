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
import { Document, Page, pdfjs } from 'react-pdf';

import { cn } from '../../lib/utils';
import { PdfEmptyState } from './components/PdfEmptyState';
import { PdfOutlinePanel } from './components/PdfOutlinePanel';
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

interface Bookmark {
    id: string;
    pageNumber: number;
    label: string;
}

const options = {
    cMapUrl: '/cmaps/',
};

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
    const [bookmark, setBookmark] = useState<Bookmark | null>(null);
    const [selectionMenu, setSelectionMenu] = useState<{
        text: string;
        pageNumber: number;
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
    const canAddBookmark = Boolean(selectedFile) && numPages > 0;

    const updateWidth = useCallback(() => {
        const element = pageAreaRef.current;
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
        setNumPages(0);
        setPdfDocument(null);
        setBookmark(null);
        setCurrentPage(1);
        setScrollProgress(0);
        setHasRenderedPage(false);
        setHasLoadError(false);
        dragDepthRef.current = 0;
        setIsDragActive(false);
    }, []);

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

    const handlePageRenderSuccess = useCallback(() => {
        setHasRenderedPage((prev) => prev || true);
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
            container.querySelectorAll('[data-page-number]'),
        ) as HTMLElement[];
        if (pageElements.length === 0) {
            return;
        }

        const anchor = container.scrollTop + container.clientHeight * 0.2;
        let pageNumber = currentPage;
        for (const pageElement of pageElements) {
            if (pageElement.offsetTop + pageElement.offsetHeight >= anchor) {
                const parsed = Number(
                    pageElement.getAttribute('data-page-number'),
                );
                pageNumber = Number.isNaN(parsed) ? pageNumber : parsed;
                break;
            }
        }

        if (pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
        }
    }, [currentPage]);

    const handleAddBookmark = useCallback(() => {
        if (!selectedFile || numPages === 0) {
            return;
        }
        const nextId = `${Date.now()}`;
        setBookmark({
            id: nextId,
            pageNumber: currentPage,
            label: `Page ${currentPage}`,
        });
    }, [currentPage, numPages, selectedFile]);

    const handleRemoveBookmark = useCallback((id: string) => {
        setBookmark((prev) => (prev && prev.id === id ? null : prev));
    }, []);

    const handleSelectionMenu = useCallback(() => {
        if (!selectedFile || numPages === 0) {
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
            '[data-page-number]',
        ) as HTMLElement | null;

        if (!pageElement) {
            setSelectionMenu(null);
            return;
        }

        const pageNumber = Number(
            pageElement.getAttribute('data-page-number'),
        );
        if (!pageNumber || Number.isNaN(pageNumber)) {
            setSelectionMenu(null);
            return;
        }

        const container = scrollContainerRef.current;
        if (!container || !anchorElement || !container.contains(anchorElement)) {
            setSelectionMenu(null);
            return;
        }

        const containerRect = container.getBoundingClientRect();
        const menuLeft =
            rect.left -
            containerRect.left +
            container.scrollLeft +
            rect.width / 2;
        const menuTop =
            rect.top - containerRect.top + container.scrollTop - 12;

        setSelectionMenu({
            text: selectedText,
            pageNumber,
            left: menuLeft,
            top: Math.max(menuTop, 8),
        });
    }, [numPages, selectedFile]);

    const handleSelectionBookmark = useCallback(() => {
        if (!selectionMenu) {
            return;
        }

        const label =
            selectionMenu.text.length > 80
                ? `${selectionMenu.text.slice(0, 77)}...`
                : selectionMenu.text;

        const nextId = `${Date.now()}`;
        setBookmark({
            id: nextId,
            pageNumber: selectionMenu.pageNumber,
            label,
        });

        window.getSelection()?.removeAllRanges();
        setSelectionMenu(null);
    }, [selectionMenu]);

    const handleSelectionTranslate = useCallback(() => {
        if (!selectionMenu) {
            return;
        }
        window.getSelection()?.removeAllRanges();
        setSelectionMenu(null);
    }, [selectionMenu]);

    const handleBookmarkClick = useCallback(
        (pageNumber: number) => {
            const container = scrollContainerRef.current;
            if (!container) {
                return;
            }

            const pageElement = container.querySelector(
                `[data-page-number="${pageNumber}"]`,
            ) as HTMLElement | null;

            if (!pageElement) {
                return;
            }

            container.scrollTo({
                top: Math.max(0, pageElement.offsetTop - 24),
                behavior: 'smooth',
            });
        },
        [],
    );

    useEffect(() => {
        if (selectedFile) {
            handleScroll();
        }
    }, [handleScroll, numPages, selectedFile]);

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
                    className={cn([
                        'mx-auto overflow-hidden',
                        'rounded-large shadow-sm',
                    ])}
                    onRenderSuccess={handlePageRenderSuccess}
                />
            );
        });
    }, [containerWidth, handlePageRenderSuccess, numPages]);

    const dropZoneActive = isDragActive
        ? 'outline outline-2 outline-offset-0 outline-[#1a1a1a] ring-0'
        : 'outline outline-transparent';
    const isPdfLoading =
        Boolean(selectedFile) && !hasRenderedPage && !hasLoadError;

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
                selectedFileName={selectedFile?.name ?? null}
                onSelectClick={() => fileInputRef.current?.click()}
                onAddBookmark={handleAddBookmark}
                canAddBookmark={canAddBookmark}
                bookmark={bookmark}
                onBookmarkClick={handleBookmarkClick}
                onRemoveBookmark={handleRemoveBookmark}
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

            {/** biome-ignore lint/a11y/noStaticElementInteractions: PDFドラッグに必要なコンポーネントのため */}
            <div
                ref={dropZoneRef}
                className={cn(
                    [
                        'relative flex-1 overflow-hidden',
                        'bg-[#f5f5f5] transition',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#1a1a1a]',
                    ],
                    dropZoneActive,
                )}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="presentation"
            >
                {selectedFile ? (
                    <Document
                        file={selectedFile}
                        onLoadSuccess={handleLoadSuccess}
                        onLoadError={handleLoadError}
                        error={
                            <Message>PDFの読み込みに失敗しました。</Message>
                        }
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

                        <main
                            className={cn(['flex min-w-0 flex-1 flex-col'])}
                        >
                            <div
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                                className={cn(
                                    [
                                        'relative flex-1 overflow-auto',
                                        'px-6 pb-10',
                                    ],
                                    isDragActive && 'bg-white/60',
                                )}
                            >
                                <div
                                    ref={pageAreaRef}
                                    className={cn([
                                        'mx-auto w-full',
                                        'max-w-5xl',
                                    ])}
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
                                                    transform: 'translateX(-50%)',
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleSelectionBookmark
                                                    }
                                                    className={cn([
                                                        'rounded-md px-2 py-1',
                                                        'text-[#1a1a1a]',
                                                        'transition hover:bg-[#f5f5f5]',
                                                    ])}
                                                >
                                                    栞に追加
                                                </button>
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

                        <main
                            className={cn(['flex min-w-0 flex-1 flex-col'])}
                        >
                            <div
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                                className={cn(
                                    ['flex-1 overflow-auto', 'px-6 pb-10'],
                                    isDragActive && 'bg-white/60',
                                )}
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
                                        onSelectClick={() =>
                                            fileInputRef.current?.click()
                                        }
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
