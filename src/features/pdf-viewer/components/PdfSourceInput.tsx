import { Button, Input } from '@heroui/react';
import { type DragEvent, type FormEvent, useId } from 'react';
import { LuCloudUpload, LuFileUp } from 'react-icons/lu';

import { cn } from '../../../lib/utils';

type PdfSourceInputVariant = 'dialog' | 'empty';

interface PdfSourceInputProps {
    variant: PdfSourceInputVariant;
    isDragActive: boolean;
    urlInput: string;
    onDragEnter: (event: DragEvent<HTMLDivElement>) => void;
    onDragOver: (event: DragEvent<HTMLDivElement>) => void;
    onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
    onDrop: (event: DragEvent<HTMLDivElement>) => void;
    onSelectFileClick: () => void;
    onUrlChange: (value: string) => void;
    onUrlSubmit: (event: FormEvent<HTMLFormElement>) => void;
    autoFocus?: boolean;
    className?: string;
}

export const PdfSourceInput = ({
    variant,
    isDragActive,
    urlInput,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onSelectFileClick,
    onUrlChange,
    onUrlSubmit,
    className,
}: PdfSourceInputProps) => {
    const id = useId();
    const isDialog = variant === 'dialog';
    const isEmpty = variant === 'empty';

    return (
        <div
            className={cn(
                ['flex flex-col', isDialog ? 'gap-4' : 'gap-6'],
                className,
            )}
        >
            {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
            <div
                className={cn(
                    ['w-full px-6 text-center transition'],
                    isEmpty
                        ? [
                              'rounded-3xl border border-dashed py-10',
                              isDragActive
                                  ? 'border-[#1a1a1a]/50 bg-[#1a1a1a]/5'
                                  : 'border-[#1a1a1a]/20 bg-[#f8f8f8]',
                          ]
                        : [
                              'rounded-2xl border-2 border-dashed py-8',
                              isDragActive
                                  ? 'border-[#1a1a1a] bg-[#1a1a1a]/5'
                                  : 'border-[#1a1a1a]/30 bg-[#f8f8f8]',
                          ],
                )}
                onDragEnter={onDragEnter}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div
                    className={cn([
                        'flex flex-col items-center',
                        isEmpty ? 'gap-4' : 'gap-3',
                    ])}
                >
                    <div
                        className={cn([
                            'flex items-center justify-center rounded-full',
                            isEmpty ? 'h-14 w-14' : 'h-12 w-12',
                            'bg-[#1a1a1a]/10',
                        ])}
                    >
                        <LuCloudUpload
                            className={cn([
                                'text-[#1a1a1a]',
                                isEmpty ? 'h-7 w-7' : 'h-6 w-6',
                            ])}
                        />
                    </div>
                    <p
                        className={cn([
                            'font-semibold text-[#1a1a1a]',
                            isEmpty ? 'text-base' : 'text-sm',
                        ])}
                    >
                        Drop your PDF here
                    </p>
                    <p className={cn(['text-xs text-[#6b7280]'])}>or</p>
                    <Button
                        type="button"
                        onPress={onSelectFileClick}
                        className={cn([
                            'inline-flex items-center gap-2',
                            'rounded-md bg-[#1a1a1a] px-4 py-2',
                            'text-xs font-semibold text-white',
                            'transition hover:opacity-80',
                        ])}
                    >
                        <LuFileUp className={cn(['h-4 w-4'])} />
                        Choose file
                    </Button>
                    {isEmpty ? (
                        <p className={cn(['text-xs text-[#6b7280]'])}>
                            Supported format: PDF (.pdf)
                        </p>
                    ) : null}
                </div>
            </div>
            <form
                onSubmit={onUrlSubmit}
                className={cn(['flex flex-col gap-2'])}
            >
                <div
                    className={cn([
                        'flex flex-col gap-2 sm:flex-row sm:items-center',
                    ])}
                >
                    <Input
                        id={id}
                        type="text"
                        label="PDF URL"
                        startContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">
                                    https://
                                </span>
                            </div>
                        }
                        inputMode="url"
                        variant="bordered"
                        value={urlInput}
                        onChange={(event) => onUrlChange(event.target.value)}
                        placeholder="example.com/sample"
                    />
                    <Button
                        type="submit"
                        radius="lg"
                        isDisabled={!urlInput.trim()}
                        className={cn(['bg-black', 'text-white'])}
                        disabled={!urlInput.trim()}
                    >
                        Open
                    </Button>
                </div>
            </form>
        </div>
    );
};
