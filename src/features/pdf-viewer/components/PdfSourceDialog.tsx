import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal';
import { Button } from '@heroui/react';
import { type DragEvent, type FormEvent, useId } from 'react';

import { cn } from '../../../lib/utils';
import { PdfSourceInput } from './PdfSourceInput';

interface PdfSourceDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
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

export const PdfSourceDialog = ({
    isOpen,
    onOpenChange,
    isDragActive,
    urlInput,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onSelectFileClick,
    onUrlChange,
    onUrlSubmit,
}: PdfSourceDialogProps) => {
    const headerId = useId();

    return (
        <Modal
            backdrop="blur"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            classNames={{
                backdrop: 'bg-black/40',
            }}
        >
            <ModalContent
                aria-labelledby="pdf-source-dialog-title"
                className={cn([
                    'w-full max-w-xl rounded-2xl bg-white',
                    'p-6 shadow-xl',
                ])}
            >
                {(close) => (
                    <>
                        <ModalHeader
                            className={cn([
                                'flex items-center justify-between',
                                'gap-4 p-0',
                            ])}
                        >
                            <h2
                                id={headerId}
                                className={cn(['text-base font-semibold'])}
                            >
                                PDFを変更
                            </h2>
                            <Button
                                onPress={close}
                                type="button"
                                className={cn([
                                    'min-w-0 rounded-md border border-[#e5e5e5]',
                                    'px-3 py-1.5 text-xs font-semibold',
                                    'text-[#6b7280] transition hover:bg-[#f5f5f5]',
                                ])}
                                variant="bordered"
                            >
                                閉じる
                            </Button>
                        </ModalHeader>
                        <ModalBody className={cn(['mt-4 p-0'])}>
                            <PdfSourceInput
                                variant="dialog"
                                isDragActive={isDragActive}
                                urlInput={urlInput}
                                onDragEnter={onDragEnter}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                onSelectFileClick={onSelectFileClick}
                                onUrlChange={onUrlChange}
                                onUrlSubmit={onUrlSubmit}
                                autoFocus
                            />
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
