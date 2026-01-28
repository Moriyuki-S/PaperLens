import { useCallback } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { ScrollArea } from '@/components/ui/scroll-area';

import { cn } from '../../../lib/utils';
import type { OutlineEntry } from '../hooks/usePdfOutline';

interface PdfOutlinePanelProps {
    numPages: number;
    outlineItems: OutlineEntry[];
    activeOutlineId?: string;
    activeOutlineIds: Set<string>;
    hoveredOutlineId: string | null;
    isCollapsed: boolean;
    emptyMessage?: string;
    onHoverChange: (id: string | null) => void;
    onItemClick: (item: OutlineEntry) => void;
    onToggle: () => void;
}

export const PdfOutlinePanel = ({
    numPages,
    outlineItems,
    activeOutlineId,
    activeOutlineIds,
    hoveredOutlineId,
    isCollapsed,
    emptyMessage = '目次はありません。',
    onHoverChange,
    onItemClick,
    onToggle,
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
                'relative flex shrink-0 flex-col',
                'transition-[width] duration-300 ease-out',
                isCollapsed ? 'w-12' : 'w-64',
                'border-r border-[#e5e5e5] bg-[#f5f5f5]',
            ])}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-label={isCollapsed ? '目次を開く' : '目次を閉じる'}
                aria-expanded={!isCollapsed}
                className={cn([
                    'absolute right-2 top-2 z-10',
                    'flex h-8 w-8 items-center justify-center',
                    'rounded-md text-[#1a1a1a]',
                    'transition hover:bg-white/80',
                    'focus-visible:outline focus-visible:outline-2',
                    'focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
                ])}
            >
                {isCollapsed ? (
                    <LuChevronRight className={cn(['h-4 w-4'])} />
                ) : (
                    <LuChevronLeft className={cn(['h-4 w-4'])} />
                )}
            </button>
            <div
                className={cn([
                    'flex items-center justify-between',
                    'border-b border-[#e5e5e5]',
                    'px-4 py-3 pr-12 transition-all duration-200',
                    isCollapsed
                        ? 'pointer-events-none -translate-x-2 opacity-0'
                        : 'translate-x-0 opacity-100',
                ])}
                aria-hidden={isCollapsed}
            >
                <h2 className={cn(['text-sm', 'font-semibold'])}>目次</h2>
                <span className={cn(['text-xs', 'text-[#6b7280]'])}>
                    {numPages ? `${numPages}ページ` : ''}
                </span>
            </div>
            <ScrollArea
                className={cn(
                    ['flex-1 transition-all duration-200'],
                    isCollapsed
                        ? 'pointer-events-none -translate-x-2 opacity-0'
                        : 'translate-x-0 opacity-100',
                )}
                aria-hidden={isCollapsed}
            >
                <div className={cn(['px-4 py-3'])}>
                    {outlineItems.length === 0 ? (
                        <p className={cn(['text-xs', 'text-[#6b7280]'])}>
                            {emptyMessage}
                        </p>
                    ) : (
                        <div className={cn(['text-sm', 'text-[#6b7280]'])}>
                            {renderOutlineItems(outlineItems)}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </aside>
    );
};
