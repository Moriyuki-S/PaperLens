import { cn } from '../../../lib/utils';

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
                'flex min-h-[60vh] flex-col items-center justify-center',
                'gap-4 text-center',
            ])}
        >
            <button
                type="button"
                onClick={onSelectClick}
                className={cn([
                    'rounded-md px-6 py-3',
                    'text-sm font-semibold text-white',
                    'bg-[#1a1a1a] transition hover:opacity-80',
                    'focus-visible:outline focus-visible:outline-2',
                    'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
                ])}
            >
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
    );
};
