import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '../../../../tests/test-utils';
import { PdfViewerHeader } from './PdfViewerHeader';

const createProps = () => ({
    selectedFileName: 'sample.pdf',
    onSelectClick: vi.fn(),
    onToggleVisibility: vi.fn(),
    onZoomIn: vi.fn(),
    onZoomOut: vi.fn(),
    onZoomReset: vi.fn(),
    zoomLabel: '100%',
    canZoomIn: true,
    canZoomOut: true,
    canResetZoom: true,
    onPrint: vi.fn(),
    canPrint: true,
});

describe('PdfViewerHeader', () => {
    it('renders the selected file name and calls the primary actions', async () => {
        const user = userEvent.setup();
        const props = createProps();

        render(<PdfViewerHeader {...props} />);

        expect(screen.getByText('sample.pdf')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Change PDF' }));
        await user.click(screen.getByRole('button', { name: 'Zoom out' }));
        await user.click(screen.getByRole('button', { name: 'Reset zoom' }));
        await user.click(screen.getByRole('button', { name: 'Zoom in' }));
        await user.click(screen.getByRole('button', { name: 'Print' }));
        await user.click(screen.getByRole('button', { name: 'Hide header' }));

        expect(props.onSelectClick).toHaveBeenCalledTimes(1);
        expect(props.onZoomOut).toHaveBeenCalledTimes(1);
        expect(props.onZoomReset).toHaveBeenCalledTimes(1);
        expect(props.onZoomIn).toHaveBeenCalledTimes(1);
        expect(props.onPrint).toHaveBeenCalledTimes(1);
        expect(props.onToggleVisibility).toHaveBeenCalledTimes(1);
    });

    it('shows a fallback title and disables unavailable controls', () => {
        render(
            <PdfViewerHeader
                {...createProps()}
                selectedFileName={null}
                canZoomIn={false}
                canZoomOut={false}
                canResetZoom={false}
                canPrint={false}
            />,
        );

        expect(screen.getByText('No PDF selected')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Zoom out' })).toBeDisabled();
        expect(
            screen.getByRole('button', { name: 'Reset zoom' }),
        ).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Print' })).toBeDisabled();
    });
});
