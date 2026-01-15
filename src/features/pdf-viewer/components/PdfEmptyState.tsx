import { cn } from '../../../lib/utils';
import { LuCloudUpload, LuFileUp } from 'react-icons/lu';

interface PdfEmptyStateProps {
    isDragActive: boolean;
    onSelectClick: () => void;
}

export const PdfEmptyState = ({
    isDragActive,
    onSelectClick,
}: PdfEmptyStateProps) => {
    return (
        <div
            className={cn([
                'relative w-full',
                'rounded-2xl px-6 py-10',
                'transition',
                isDragActive ? 'bg-white/80 shadow-lg' : 'bg-white/40',
            ])}
        >
            <div
                className={cn([
                    'pointer-events-none absolute inset-0 rounded-2xl',
                    'border-2 border-dashed',
                    isDragActive
                        ? 'border-[#1a1a1a]'
                        : 'border-[#1a1a1a]/30',
                ])}
            />
            <div
                className={cn([
                    'pointer-events-none absolute inset-2 rounded-xl',
                    'bg-[#1a1a1a]/5',
                    isDragActive
                        ? 'opacity-100 motion-safe:animate-pulse'
                        : 'opacity-0',
                ])}
            />
            <div
                className={cn([
                    'relative z-10',
                    'flex min-h-[60vh] flex-col items-center justify-center',
                    'gap-4 text-center',
                ])}
            >
                <div
                    className={cn([
                        'flex items-center justify-center',
                        'rounded-full bg-[#1a1a1a]/10 p-4',
                        'transition-transform',
                        isDragActive && 'scale-105 bg-[#1a1a1a]/15',
                    ])}
                >
                    <LuCloudUpload
                        className={cn([
                            'h-8 w-8 text-[#1a1a1a]',
                            isDragActive && 'motion-safe:animate-bounce',
                        ])}
                    />
                </div>
                <button
                    type="button"
                    onClick={onSelectClick}
                    className={cn([
                        'inline-flex items-center gap-2',
                        'rounded-md px-6 py-3',
                        'text-sm font-semibold text-white',
                        'bg-[#1a1a1a] transition hover:opacity-80',
                        'focus-visible:outline focus-visible:outline-2',
                        'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
                    ])}
                >
                    <LuFileUp className={cn(['h-4 w-4'])} />
                    PDFを選択
                </button>
                <p className={cn(['text-sm', 'text-[#6b7280]'])}>
                    {isDragActive
                        ? 'ここにドロップしてください'
                        : 'またはPDFファイルをここにドラッグ＆ドロップ'}
                </p>
                <p className={cn(['text-xs', 'text-[#6b7280]'])}>
                    対応形式: PDFファイル (.pdf)
                </p>
            </div>
        </div>
    );
};
