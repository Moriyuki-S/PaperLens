import { Button, ButtonGroup, Tooltip } from '@heroui/react';
import { FaRegFilePdf } from 'react-icons/fa';
import {
    LuChevronUp,
    LuPrinter,
    LuRotateCcw,
    LuZoomIn,
    LuZoomOut,
} from 'react-icons/lu';

import { cn } from '../../../lib/utils';

interface PdfViewerHeaderProps {
    selectedFileName?: string | null;
    onSelectClick: () => void;
    onToggleVisibility: () => void;
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
    onToggleVisibility,
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
    const documentTitle = selectedFileName ?? 'No PDF selected';
    const iconButtonClasses = cn([
        'flex h-10 w-10 items-center justify-center',
        'min-w-0',
        'rounded-xl border border-[#dcdcdc] bg-white',
        'text-[#4b5563]',
        'shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition',
        'hover:border-[#cfcfcf] hover:bg-[#fafafa]',
        'focus-visible:outline focus-visible:outline-2',
        'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
        'disabled:cursor-not-allowed disabled:opacity-40',
    ]);
    const selectButtonClasses = cn([
        'inline-flex h-10 items-center gap-2',
        'rounded-xl border border-[#dcdcdc] bg-white',
        'px-4 text-sm font-semibold text-[#1a1a1a]',
        'shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition',
        'hover:border-[#cfcfcf] hover:bg-[#fafafa]',
        'focus-visible:outline focus-visible:outline-2',
        'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
        'disabled:cursor-not-allowed disabled:opacity-40',
    ]);
    const toolbarButtonClasses = cn([
        'flex h-9 w-9 items-center justify-center',
        'rounded-lg text-[#4b5563]',
        'transition hover:bg-[#f3f4f6]',
        'focus-visible:outline focus-visible:outline-2',
        'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
        'disabled:cursor-not-allowed disabled:opacity-40',
    ]);

    return (
        <div
            className={cn([
                'flex min-h-[76px] items-center justify-between gap-4',
                'border-b border-[#e7e5e4] bg-[linear-gradient(180deg,#ffffff_0%,#fcfcfb_100%)]',
                'px-4 py-3 sm:px-6',
            ])}
        >
            <div className={cn(['flex min-w-0 items-center gap-3'])}>
                <div
                    className={cn([
                        'flex h-11 w-11 shrink-0 items-center justify-center',
                        'rounded-2xl border border-[#f1d1d1] bg-[#fff4f4] text-[#b42318]',
                    ])}
                >
                    <FaRegFilePdf className={cn(['h-5 w-5'])} />
                </div>
                <div className={cn(['min-w-0'])}>
                    <p
                        className={cn([
                            'text-[11px] font-semibold uppercase tracking-[0.18em]',
                            'text-[#9ca3af]',
                        ])}
                    >
                        Open Document
                    </p>
                    <h1
                        className={cn([
                            'truncate text-base font-semibold text-[#111827] sm:text-lg',
                        ])}
                        title={documentTitle}
                    >
                        {documentTitle}
                    </h1>
                </div>
            </div>
            <div className={cn(['flex shrink-0 items-center gap-2'])}>
                <Button
                    type="button"
                    onPress={onSelectClick}
                    className={selectButtonClasses}
                    aria-label="Change PDF"
                >
                    <FaRegFilePdf className={cn(['h-4 w-4'])} />
                    <span className={cn(['hidden sm:inline'])}>Change PDF</span>
                    <span className={cn(['sm:hidden'])}>Change</span>
                </Button>
                <ButtonGroup
                    className={cn([
                        'flex items-center gap-1 rounded-xl',
                        'border border-[#dcdcdc] bg-white px-1 py-1',
                        'shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
                    ])}
                    radius="md"
                    variant="light"
                >
                    <Tooltip content="Zoom out">
                        <Button
                            type="button"
                            onPress={onZoomOut}
                            isDisabled={!canZoomOut}
                            className={toolbarButtonClasses}
                            aria-label="Zoom out"
                            isIconOnly
                        >
                            <LuZoomOut className={cn(['h-4 w-4'])} />
                        </Button>
                    </Tooltip>
                    <Tooltip content="Reset zoom">
                        <Button
                            type="button"
                            onPress={onZoomReset}
                            isDisabled={!canResetZoom}
                            className={cn([
                                'flex h-9 items-center justify-center',
                                'rounded-lg px-2 text-xs font-medium',
                                'text-[#4b5563]',
                                'transition hover:bg-[#f3f4f6]',
                                'focus-visible:outline focus-visible:outline-2',
                                'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
                                'disabled:cursor-not-allowed disabled:opacity-40',
                            ])}
                            aria-label="Reset zoom"
                        >
                            <span className={cn(['min-w-[44px] text-center'])}>
                                {zoomLabel}
                            </span>
                            <LuRotateCcw className={cn(['ml-1 h-3.5 w-3.5'])} />
                        </Button>
                    </Tooltip>
                    <Tooltip content="Zoom in">
                        <Button
                            type="button"
                            onPress={onZoomIn}
                            isDisabled={!canZoomIn}
                            className={toolbarButtonClasses}
                            aria-label="Zoom in"
                            isIconOnly
                        >
                            <LuZoomIn className={cn(['h-4 w-4'])} />
                        </Button>
                    </Tooltip>
                </ButtonGroup>
                <Tooltip content="Print">
                    <Button
                        type="button"
                        onPress={onPrint}
                        isDisabled={!canPrint}
                        className={iconButtonClasses}
                        aria-label="Print"
                        isIconOnly
                        variant="light"
                    >
                        <LuPrinter className={cn(['h-4 w-4'])} />
                    </Button>
                </Tooltip>
                <Tooltip content="Hide header">
                    <Button
                        type="button"
                        onPress={onToggleVisibility}
                        className={iconButtonClasses}
                        aria-label="Hide header"
                        isIconOnly
                        variant="light"
                    >
                        <LuChevronUp className={cn(['h-4 w-4'])} />
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};
