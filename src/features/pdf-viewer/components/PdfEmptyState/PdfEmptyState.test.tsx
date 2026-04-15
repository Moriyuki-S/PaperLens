import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '../../../../tests/test-utils';
import { PdfEmptyState } from './PdfEmptyState';

const createProps = () => ({
    isDragActive: false,
    urlInput: 'example.com/sample.pdf',
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

describe('PdfEmptyState', () => {
    it('renders the empty-state messaging and delegates the choose-file action', async () => {
        const user = userEvent.setup();
        const props = createProps();

        render(<PdfEmptyState {...props} />);

        expect(
            screen.getByRole('heading', { name: 'Start by selecting a PDF' }),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Upload a local file or paste a PDF URL to open it.',
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByDisplayValue('example.com/sample.pdf'),
        ).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Choose file' }));

        expect(props.onSelectFileClick).toHaveBeenCalledTimes(1);
    });
});
