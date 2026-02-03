import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type OutlineItem = {
    title?: string;
    dest?: unknown;
    items?: OutlineItem[];
};

export type OutlineEntry = {
    id: string;
    title: string;
    dest?: unknown;
    pageNumber?: number;
    items: OutlineEntry[];
};

const buildOutlineEntries = async (
    items: OutlineItem[],
    resolvePageNumber: (dest?: unknown) => Promise<number | undefined>,
    path: number[] = [],
): Promise<OutlineEntry[]> => {
    return Promise.all(
        items.map(async (item, index) => {
            const id = [...path, index].join('-');
            const title = item.title ?? 'Untitled';
            const pageNumber = await resolvePageNumber(item.dest);
            const children = await buildOutlineEntries(
                item.items ?? [],
                resolvePageNumber,
                [...path, index],
            );
            return {
                id,
                title,
                dest: item.dest,
                pageNumber,
                items: children,
            };
        }),
    );
};

export const usePdfOutline = (
    pdfDocument: PDFDocumentProxy | null,
    currentPage: number,
) => {
    const [outlineItems, setOutlineItems] = useState<OutlineItem[]>([]);
    const [outlineWithPages, setOutlineWithPages] = useState<OutlineEntry[]>(
        [],
    );
    const [hoveredOutlineId, setHoveredOutlineId] = useState<string | null>(
        null,
    );

    useEffect(() => {
        if (!pdfDocument) {
            setOutlineItems([]);
            return;
        }

        let isActive = true;

         pdfDocument
            .getOutline()
            .then((outline) => {
                if (isActive) {
                    setOutlineItems(outline ?? []);
                }
            })
            .catch(() => {
                if (isActive) {
                    setOutlineItems([]);
                }
            });

        return () => {
            isActive = false;
        };
    }, [pdfDocument]);

    const resolveOutlinePageNumber = useCallback(
        async (dest?: unknown) => {
            if (!pdfDocument || !dest) {
                return undefined;
            }

            try {
                const destination =
                    typeof dest === 'string'
                        ? await pdfDocument.getDestination(dest)
                        : dest;

                if (!Array.isArray(destination)) {
                    return undefined;
                }

                const [ref] = destination;
                const targetPageIndex =
                    typeof ref === 'object' && ref !== null
                        ? await pdfDocument.getPageIndex(ref)
                        : 0;

                return targetPageIndex + 1;
            } catch (error) {
                console.error('Failed to resolve outline destination:', error);
                return undefined;
            }
        },
        [pdfDocument],
    );

    useEffect(() => {
        let isActive = true;

        if (!pdfDocument || outlineItems.length === 0) {
            setOutlineWithPages([]);
            return () => {
                isActive = false;
            };
        }

        void (async () => {
            const outline = await buildOutlineEntries(
                outlineItems,
                resolveOutlinePageNumber,
            );
            if (isActive) {
                setOutlineWithPages(outline);
            }
        })();

        return () => {
            isActive = false;
        };
    }, [outlineItems, pdfDocument, resolveOutlinePageNumber]);

    const { flatOutlineItems, outlineParents } = useMemo(() => {
        const flatItems: OutlineEntry[] = [];
        const parents = new Map<string, string>();
        const walk = (items: OutlineEntry[], parentId?: string) => {
            for (const item of items) {
                flatItems.push(item);
                if (parentId) {
                    parents.set(item.id, parentId);
                }
                if (item.items.length > 0) {
                    walk(item.items, item.id);
                }
            }
        };

        walk(outlineWithPages);
        return { flatOutlineItems: flatItems, outlineParents: parents };
    }, [outlineWithPages]);

    const activeOutlineId = useMemo(() => {
        let activeId: string | undefined;
        for (const item of flatOutlineItems) {
            if (!item.pageNumber) {
                continue;
            }
            if (item.pageNumber <= currentPage) {
                activeId = item.id;
            } else {
                break;
            }
        }
        return activeId;
    }, [currentPage, flatOutlineItems]);

    const activeOutlineIds = useMemo(() => {
        const ids = new Set<string>();
        let cursor = activeOutlineId;
        while (cursor) {
            ids.add(cursor);
            cursor = outlineParents.get(cursor);
        }
        return ids;
    }, [activeOutlineId, outlineParents]);

    return {
        outlineWithPages,
        activeOutlineId,
        activeOutlineIds,
        hoveredOutlineId,
        setHoveredOutlineId,
    };
};
