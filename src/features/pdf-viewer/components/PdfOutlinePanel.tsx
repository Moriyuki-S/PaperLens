import { useCallback } from 'react';

import { cn } from '../../../lib/utils';
import type { OutlineEntry } from '../hooks/usePdfOutline';

interface PdfOutlinePanelProps {
    numPages: number;
    outlineItems: OutlineEntry[];
    activeOutlineId?: string;
    activeOutlineIds: Set<string>;
    hoveredOutlineId: string | null;
    onHoverChange: (id: string | null) => void;
    onItemClick: (item: OutlineEntry) => void;
}

export const PdfOutlinePanel = ({
    numPages,
    outlineItems,
    activeOutlineId,
    activeOutlineIds,
    hoveredOutlineId,
    onHoverChange,
    onItemClick,
}: PdfOutlinePanelProps) => {
    const renderOutlineItems = useCallback(
        (items: OutlineEntry[], depth = 0) => {
            if (items.length === 0) {
                return null;
            }

            return (
                <ul className={cn(['space-y-2'])}>
                    {items.map((item) => {
                        const isActive = hoveredOutlineId
                            ? item.id === hoveredOutlineId
                            : activeOutlineIds.has(item.id);
                        const isCurrent = activeOutlineId === item.id;
                        const isDisabled = !item.dest || !item.pageNumber;
                        return (
                            <li key={item.id} className={cn(['ml-1'])}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isDisabled) {
                                            return;
                                        }
                                        onItemClick(item);
                                    }}
                                    onMouseEnter={() => onHoverChange(item.id)}
                                    onMouseLeave={() => onHoverChange(null)}
                                    onFocus={() => onHoverChange(item.id)}
                                    onBlur={() => onHoverChange(null)}
                                    disabled={isDisabled}
                                    aria-current={
                                        isCurrent ? 'location' : undefined
                                    }
                                    className={cn(
                                        [
                                            'block w-full rounded-md px-3 py-2',
                                            'text-left text-sm',
                                            'transition-all duration-200',
                                        ],
                                        isActive
                                            ? [
                                                  'bg-white',
                                                  'text-[#1a1a1a]',
                                                  'shadow-sm',
                                              ]
                                            : 'text-[#6b7280]',
                                        isCurrent && 'font-semibold',
                                        isDisabled
                                            ? ['cursor-default', 'opacity-60']
                                            : [
                                                  'hover:bg-white',
                                                  'hover:text-[#1a1a1a]',
                                                  'hover:translate-x-1',
                                              ],
                                    )}
                                    style={{
                                        paddingLeft: `${depth * 12 + 12}px`,
                                    }}
                                >
                                    {item.title}
                                </button>
                                {renderOutlineItems(item.items, depth + 1)}
                            </li>
                        );
                    })}
                </ul>
            );
        },
        [
            activeOutlineId,
            activeOutlineIds,
            hoveredOutlineId,
            onHoverChange,
            onItemClick,
        ],
    );

    return (
        <aside
            className={cn([
                'flex w-64 flex-col',
                'border-r border-[#e5e5e5] bg-[#f5f5f5]',
            ])}
        >
            <div
                className={cn([
                    'flex items-center justify-between',
                    'border-b border-[#e5e5e5]',
                    'px-4 py-3',
                ])}
            >
                <h2 className={cn(['text-sm', 'font-semibold'])}>目次</h2>
                <span className={cn(['text-xs', 'text-[#6b7280]'])}>
                    {numPages ? `${numPages}ページ` : ''}
                </span>
            </div>
            <div className={cn(['flex-1 overflow-auto', 'px-4 py-3'])}>
                {outlineItems.length === 0 ? (
                    <p className={cn(['text-xs', 'text-[#6b7280]'])}>
                        目次はありません。
                    </p>
                ) : (
                    <div className={cn(['text-sm', 'text-[#6b7280]'])}>
                        {renderOutlineItems(outlineItems)}
                    </div>
                )}
            </div>
        </aside>
    );
};
