import { Button, ButtonGroup, Tooltip } from '@heroui/react';
import { FaRegFilePdf } from 'react-icons/fa';
import { LuPrinter, LuRotateCcw, LuZoomIn, LuZoomOut } from 'react-icons/lu';

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
        'flex h-10 w-10 items-center justify-center',
        'min-w-0',
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
        'bg-[#1a1a1a] text-white',
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
            <div className={cn(['flex min-w-0 items-center', 'gap-3'])}>
                <Button
                    type="button"
                    onPress={onSelectClick}
                    className={selectButtonClasses}
                    aria-label="PDFを変更"
                >
                    <FaRegFilePdf />
                    <span>PDFを変更</span>
                </Button>
                <span
                    className={cn([
                        'max-w-[240px] truncate',
                        'text-sm text-[#6b7280]',
                    ])}
                >
                    {selectedFileName ?? 'PDF未選択'}
                </span>
            </div>
            <h1 className={cn(['text-base', 'font-semibold'])}>
                PaperLens PDF
            </h1>
            <div className={cn(['flex items-center', 'gap-2'])}>
                <ButtonGroup
                    className={cn([
                        'flex items-center gap-1 rounded-md',
                        'border border-[#e5e5e5] bg-white px-1 py-1',
                    ])}
                    radius="md"
                    variant="light"
                >
                    <Tooltip content="縮小">
                        <Button
                            type="button"
                            onPress={onZoomOut}
                            isDisabled={!canZoomOut}
                            className={toolbarButtonClasses}
                            aria-label="縮小"
                            isIconOnly
                        >
                            <LuZoomOut className={cn(['h-4 w-4'])} />
                        </Button>
                    </Tooltip>
                    <Tooltip content="拡大率をリセット">
                        <Button
                            type="button"
                            onPress={onZoomReset}
                            isDisabled={!canResetZoom}
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
                        </Button>
                    </Tooltip>
                    <Tooltip content="拡大">
                        <Button
                            type="button"
                            onPress={onZoomIn}
                            isDisabled={!canZoomIn}
                            className={toolbarButtonClasses}
                            aria-label="拡大"
                            isIconOnly
                        >
                            <LuZoomIn className={cn(['h-4 w-4'])} />
                        </Button>
                    </Tooltip>
                </ButtonGroup>
                <Tooltip content="印刷">
                    <Button
                        type="button"
                        onPress={onPrint}
                        isDisabled={!canPrint}
                        className={iconButtonClasses}
                        aria-label="印刷"
                        isIconOnly
                        variant="light"
                    >
                        <LuPrinter className={cn(['h-4 w-4'])} />
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};
