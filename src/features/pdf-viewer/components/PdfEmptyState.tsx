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
        <div
            className={cn([
                'relative w-full',
                'rounded-2xl px-6 py-10',
                'bg-white/40',
            ])}
        >
            <div
                className={cn([
                    'pointer-events-none absolute inset-0 rounded-2xl',
                    'border-2 border-dashed',
                    'border-[#1a1a1a]/30',
                ])}
            />
            <div
                className={cn([
                    'pointer-events-none absolute inset-2 rounded-xl',
                    'bg-[#1a1a1a]/5',
                    'transition-opacity',
                    isDragActive ? 'opacity-100' : 'opacity-0',
                ])}
            />
            <div
                className={cn([
                    'relative z-10',
                    'flex min-h-[60vh] flex-col items-center justify-center',
                    'gap-6',
                ])}
            >
                <PdfSourceInput
                    variant="empty"
                    className={cn(['w-full max-w-xl'])}
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
