import { LuBookmark } from 'react-icons/lu';

import { cn } from '../../../lib/utils';

interface Bookmark {
    id: string;
    pageNumber: number;
    label: string;
}

interface PdfViewerHeaderProps {
    selectedFileName?: string | null;
    onSelectClick: () => void;
    onAddBookmark: () => void;
    canAddBookmark: boolean;
    bookmark: Bookmark | null;
    onBookmarkClick: (pageNumber: number) => void;
    onRemoveBookmark: (id: string) => void;
}

export const PdfViewerHeader = ({
    selectedFileName,
    onSelectClick,
    onAddBookmark,
    canAddBookmark,
    bookmark,
    onBookmarkClick,
    onRemoveBookmark,
}: PdfViewerHeaderProps) => {
    const hasBookmark = Boolean(bookmark);
    const addLabel = hasBookmark ? '栞を更新' : '栞を追加';

    return (
        <div
            className={cn([
                'flex h-16 items-center justify-between',
                'border-b border-[#e5e5e5] bg-white',
                'px-6',
            ])}
        >
            <div className={cn(['flex items-center', 'gap-2'])}>
                <button
                    type="button"
                    onClick={onSelectClick}
                    className={cn([
                        'flex h-9 w-9 items-center justify-center',
                        'rounded-md border border-[#e5e5e5]',
                        'text-[#6b7280]',
                        'transition hover:bg-[#f5f5f5]',
                        'focus-visible:outline focus-visible:outline-2',
                        'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
                    ])}
                    aria-label="PDFを選択"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={cn(['h-5', 'w-5'])}
                    >
                        <title>PDFを選択</title>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16.5V6.75A2.25 2.25 0 0 1 6.25 4.5h5.19a2.25 2.25 0 0 1 1.59.66l3.31 3.31a2.25 2.25 0 0 1 .66 1.59v6.44A2.25 2.25 0 0 1 14.75 19H6.25A2.25 2.25 0 0 1 4 16.5Z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9.5v6m0 0-2.5-2.5M12 15.5l2.5-2.5"
                        />
                    </svg>
                </button>
                <span className={cn(['text-sm', 'text-[#6b7280]'])}>
                    {selectedFileName ?? 'PDF Viewer'}
                </span>
            </div>
            <h1 className={cn(['text-base', 'font-semibold'])}>
                PaperLens PDF
            </h1>
            <div className={cn(['flex items-center', 'gap-2'])}>
                {bookmark ? (
                    <div
                        className={cn([
                            'flex items-center rounded-full',
                            'border border-[#e5e5e5] bg-white',
                            'px-1 py-1 shadow-sm',
                            'transition hover:border-[#d4d4d4]',
                        ])}
                    >
                        <button
                            type="button"
                            onClick={() => onBookmarkClick(bookmark.pageNumber)}
                            className={cn([
                                'group inline-flex items-center gap-2',
                                'rounded-full px-3 py-1',
                                'text-xs font-medium text-[#1a1a1a]',
                                'transition hover:bg-[#f5f5f5]',
                            ])}
                            title={bookmark.label}
                            aria-label={`栞: ${bookmark.label}`}
                        >
                            <LuBookmark className={cn(['h-4 w-4'])} />
                            <span className={cn(['max-w-[140px] truncate'])}>
                                {bookmark.label}
                            </span>
                            <span
                                className={cn([
                                    'rounded-full bg-white px-2 py-0.5',
                                    'text-[10px] text-[#6b7280]',
                                ])}
                            >
                                {`p.${bookmark.pageNumber}`}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onRemoveBookmark(bookmark.id)}
                            className={cn([
                                'mr-1 flex h-6 w-6 items-center justify-center',
                                'rounded-full text-[#6b7280]',
                                'transition hover:bg-[#f5f5f5] hover:text-[#1a1a1a]',
                            ])}
                            aria-label="栞を削除"
                        >
                            ×
                        </button>
                    </div>
                ) : null}
                <button
                    type="button"
                    onClick={onAddBookmark}
                    disabled={!canAddBookmark}
                    className={cn([
                        'flex h-9 w-9 items-center justify-center',
                        'rounded-md border border-[#e5e5e5]',
                        'text-[#6b7280]',
                        'transition hover:bg-[#f5f5f5]',
                        'focus-visible:outline focus-visible:outline-2',
                        'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
                        'disabled:cursor-not-allowed disabled:opacity-40',
                    ])}
                    aria-label={addLabel}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={cn(['h-5', 'w-5'])}
                    >
                        <title>{addLabel}</title>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 4.5h9A1.5 1.5 0 0 1 18 6v14.25a.75.75 0 0 1-1.13.65L12 18.25l-4.87 2.65A.75.75 0 0 1 6 20.25V6a1.5 1.5 0 0 1 1.5-1.5Z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8.25v5.5m0 0-2-2m2 2 2-2"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};
