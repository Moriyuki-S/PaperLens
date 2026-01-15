import { cn } from '../../../lib/utils';

interface Bookmark {
    id: string;
    pageNumber: number;
    label: string;
}

interface PdfBookmarkPanelProps {
    bookmarks: Bookmark[];
    selectedFileName?: string | null;
    onAddBookmark: () => void;
    onBookmarkClick: (pageNumber: number) => void;
    onRemoveBookmark: (id: string) => void;
}

export const PdfBookmarkPanel = ({
    bookmarks,
    selectedFileName,
    onAddBookmark,
    onBookmarkClick,
    onRemoveBookmark,
}: PdfBookmarkPanelProps) => {
    return (
        <aside
            className={cn([
                'flex w-64 flex-col',
                'border-l border-[#e5e5e5] bg-[#f5f5f5]',
            ])}
        >
            <div
                className={cn([
                    'flex items-center justify-between',
                    'border-b border-[#e5e5e5]',
                    'px-4 py-3',
                ])}
            >
                <h2 className={cn(['text-sm', 'font-semibold'])}>栞</h2>
                <button
                    type="button"
                    onClick={onAddBookmark}
                    className={cn([
                        'rounded-md px-3 py-1',
                        'text-xs font-medium text-[#6b7280]',
                        'transition hover:bg-white/70',
                    ])}
                >
                    追加
                </button>
            </div>
            <div className={cn(['flex-1 overflow-auto', 'px-4 py-3'])}>
                {bookmarks.length === 0 ? (
                    <p className={cn(['text-xs', 'text-[#6b7280]'])}>
                        栞はまだありません。
                    </p>
                ) : (
                    <div className={cn(['flex flex-col', 'gap-3'])}>
                        {bookmarks.map((bookmark) => (
                            <div
                                key={bookmark.id}
                                className={cn([
                                    'relative rounded-md bg-white',
                                    'text-sm shadow-sm',
                                ])}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        onBookmarkClick(bookmark.pageNumber)
                                    }
                                    className={cn([
                                        'flex w-full flex-col rounded-md',
                                        'px-3 py-2 text-left',
                                        'transition hover:bg-[#f5f5f5]',
                                        'focus-visible:outline focus-visible:outline-2',
                                        'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
                                    ])}
                                >
                                    <p className={cn(['font-medium'])}>
                                        {bookmark.label}
                                    </p>
                                    <p className={cn(['text-xs', 'text-[#6b7280]'])}>
                                        {selectedFileName ?? ''}
                                    </p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        onRemoveBookmark(bookmark.id)
                                    }
                                    onMouseDown={(event) =>
                                        event.stopPropagation()
                                    }
                                    onClickCapture={(event) =>
                                        event.stopPropagation()
                                    }
                                    className={cn([
                                        'absolute right-2 top-2',
                                        'text-xs text-[#6b7280]',
                                        'transition hover:text-[#1a1a1a]',
                                    ])}
                                    aria-label="栞を削除"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
};
