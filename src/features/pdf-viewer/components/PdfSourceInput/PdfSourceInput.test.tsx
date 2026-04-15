import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '../../../../tests/test-utils';
import { PdfSourceInput } from './PdfSourceInput';

const createProps = () => ({
    variant: 'empty' as const,
    isDragActive: false,
    urlInput: '',
    onDragEnter: vi.fn(),
    onDragOver: vi.fn(),
    onDragLeave: vi.fn(),
    onDrop: vi.fn(),
    onSelectFileClick: vi.fn(),
    onUrlChange: vi.fn(),
    onUrlSubmit: vi.fn((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }),
});

describe('PdfSourceInput', () => {
    it('shows the empty-state helper text and lets users choose a file', async () => {
        const user = userEvent.setup();
        const props = createProps();

        render(<PdfSourceInput {...props} />);

        expect(
            screen.getByText('Supported format: PDF (.pdf)'),
        ).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Choose file' }));

        expect(props.onSelectFileClick).toHaveBeenCalledTimes(1);
    });

    it('forwards URL edits and submits when the input has a value', async () => {
        const user = userEvent.setup();
        const props = createProps();

        const { rerender } = render(<PdfSourceInput {...props} />);

        await user.type(screen.getByLabelText('PDF URL'), 'example.com/file');

        expect(props.onUrlChange).toHaveBeenCalled();

        rerender(<PdfSourceInput {...props} urlInput="example.com/file" />);

        await user.click(screen.getByRole('button', { name: 'Open' }));

        expect(props.onUrlSubmit).toHaveBeenCalledTimes(1);
    });

    it('keeps the submit button disabled when the URL is empty', () => {
        render(<PdfSourceInput {...createProps()} />);

        expect(screen.getByRole('button', { name: 'Open' })).toBeDisabled();
    });
});
