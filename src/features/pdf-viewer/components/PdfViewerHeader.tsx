import {
    LuPrinter,
    LuRotateCcw,
    LuZoomIn,
    LuZoomOut,
} from 'react-icons/lu';

import { cn } from '../../../lib/utils';

interface PdfViewerHeaderProps {
    selectedFileName?: string | null;
    onSelectClick: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
    zoomLabel: string;
    canZoomIn: boolean;
    canZoomOut: boolean;
    canResetZoom: boolean;
    onPrint: () => void;
    canPrint: boolean;
}

export const PdfViewerHeader = ({
    selectedFileName,
    onSelectClick,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    zoomLabel,
    canZoomIn,
    canZoomOut,
    canResetZoom,
    onPrint,
    canPrint,
}: PdfViewerHeaderProps) => {
    const iconButtonClasses = cn([
        'flex h-9 w-9 items-center justify-center',
        'rounded-md border border-[#e5e5e5]',
        'text-[#6b7280]',
        'transition hover:bg-[#f5f5f5]',
        'focus-visible:outline focus-visible:outline-2',
        'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
        'disabled:cursor-not-allowed disabled:opacity-40',
    ]);
    const selectButtonClasses = cn([
        'inline-flex items-center gap-2 cursor-pointer',
        'rounded-full border border-[#1a1a1a]',
        'px-4 py-2 text-sm font-semibold',
        'transition hover:shadow-sm',
        'focus-visible:outline focus-visible:outline-2',
        'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
        selectedFileName ? 'bg-[#1a1a1a] text-white' : 'bg-white text-[#1a1a1a]',
    ]);
    const toolbarButtonClasses = cn([
        'flex h-9 w-9 items-center justify-center',
        'rounded-md text-[#6b7280]',
        'transition hover:bg-[#f5f5f5]',
        'focus-visible:outline focus-visible:outline-2',
        'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
        'disabled:cursor-not-allowed disabled:opacity-40',
    ]);

    return (
        <div
            className={cn([
                'flex h-16 items-center justify-between',
                'border-b border-[#e5e5e5] bg-white',
                'px-6',
            ])}
        >
            <div className={cn(['flex items-center', 'gap-3'])}>
                <button
                    type="button"
                    onClick={onSelectClick}
                    className={selectButtonClasses}
                    aria-label={selectedFileName ? 'PDFを変更' : 'PDFを選択'}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={cn(['h-4', 'w-4'])}
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
                    <span>{selectedFileName ? 'PDFを変更' : 'PDFを選択'}</span>
                </button>
                <span
                    className={cn([
                        'max-w-[240px] truncate',
                        'text-sm text-[#6b7280]',
                    ])}
                >
                    {selectedFileName ?? 'PDF Viewer'}
                </span>
            </div>
            <h1 className={cn(['text-base', 'font-semibold'])}>
                PaperLens PDF
            </h1>
            <div className={cn(['flex items-center', 'gap-2'])}>
                <div
                    className={cn([
                        'flex items-center gap-1 rounded-md',
                        'border border-[#e5e5e5] bg-white px-1 py-1',
                    ])}
                >
                    <button
                        type="button"
                        onClick={onZoomOut}
                        disabled={!canZoomOut}
                        className={toolbarButtonClasses}
                        aria-label="縮小"
                    >
                        <LuZoomOut className={cn(['h-4 w-4'])} />
                    </button>
                    <button
                        type="button"
                        onClick={onZoomReset}
                        disabled={!canResetZoom}
                        className={cn([
                            'flex h-9 items-center justify-center',
                            'rounded-md px-2 text-xs font-medium',
                            'text-[#6b7280]',
                            'transition hover:bg-[#f5f5f5]',
                            'focus-visible:outline focus-visible:outline-2',
                            'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
                            'disabled:cursor-not-allowed disabled:opacity-40',
                        ])}
                        aria-label="拡大率をリセット"
                    >
                        <span className={cn(['min-w-[44px] text-center'])}>
                            {zoomLabel}
                        </span>
                        <LuRotateCcw className={cn(['ml-1 h-3.5 w-3.5'])} />
                    </button>
                    <button
                        type="button"
                        onClick={onZoomIn}
                        disabled={!canZoomIn}
                        className={toolbarButtonClasses}
                        aria-label="拡大"
                    >
                        <LuZoomIn className={cn(['h-4 w-4'])} />
                    </button>
                </div>
                <button
                    type="button"
                    onClick={onPrint}
                    disabled={!canPrint}
                    className={iconButtonClasses}
                    aria-label="印刷"
                >
                    <LuPrinter className={cn(['h-4 w-4'])} />
                </button>
            </div>
        </div>
    );
};
