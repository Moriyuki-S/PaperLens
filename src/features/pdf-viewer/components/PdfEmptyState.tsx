import type { DragEvent, FormEvent } from 'react';
import { cn } from '../../../lib/utils';
import { PdfSourceInput } from './PdfSourceInput';

interface PdfEmptyStateProps {
    isDragActive: boolean;
    urlInput: string;
    onDragEnter: (event: DragEvent<HTMLDivElement>) => void;
    onDragOver: (event: DragEvent<HTMLDivElement>) => void;
    onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
    onDrop: (event: DragEvent<HTMLDivElement>) => void;
    onSelectFileClick: () => void;
    onUrlChange: (value: string) => void;
    onUrlSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const PdfEmptyState = ({
    isDragActive,
    urlInput,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onSelectFileClick,
    onUrlChange,
    onUrlSubmit,
}: PdfEmptyStateProps) => {
    return (
        <div className={cn(['relative w-full max-w-3xl'])}>
            <div
                className={cn([
                    'pointer-events-none absolute left-1/2 top-0',
                    'h-40 w-40 -translate-x-1/2 rounded-full',
                    'bg-[#1a1a1a]/5',
                    'blur-3xl transition-opacity',
                    isDragActive ? 'opacity-100' : 'opacity-70',
                ])}
            />
            <div
                className={cn([
                    'relative z-10 overflow-hidden rounded-[32px] border border-white/70',
                    'bg-white/90 px-6 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur',
                    'sm:px-10 sm:py-10',
                ])}
            >
                <div
                    className={cn([
                        'mx-auto flex max-w-xl flex-col items-center text-center',
                        'gap-3',
                    ])}
                >
                    <span
                        className={cn([
                            'text-[11px] font-semibold uppercase tracking-[0.24em]',
                            'text-[#6b7280]',
                        ])}
                    >
                        PaperLens
                    </span>
                    <h2
                        className={cn([
                            'text-2xl font-semibold text-[#1a1a1a]',
                        ])}
                    >
                        Start by selecting a PDF
                    </h2>
                    <p className={cn(['text-sm leading-6 text-[#6b7280]'])}>
                        Upload a local file or paste a PDF URL to open it.
                    </p>
                </div>
                <PdfSourceInput
                    variant="empty"
                    className={cn(['mx-auto mt-8 w-full max-w-xl'])}
                    isDragActive={isDragActive}
                    urlInput={urlInput}
                    onDragEnter={onDragEnter}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onSelectFileClick={onSelectFileClick}
                    onUrlChange={onUrlChange}
                    onUrlSubmit={onUrlSubmit}
                />
            </div>
        </div>
    );
};
