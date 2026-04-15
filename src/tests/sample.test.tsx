import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { cn } from '../lib/utils';

describe('Sample RTL test', () => {
    it('renders accessible content', () => {
        render(
            <section className={cn('paper-lens-shell')}>
                <h1>PaperLens</h1>
                <button type="button">Open PDF</button>
            </section>,
        );

        expect(
            screen.getByRole('heading', { name: 'PaperLens' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Open PDF' }),
        ).toBeInTheDocument();
        expect(
            screen
                .getByRole('heading', { name: 'PaperLens' })
                .closest('section'),
        ).toHaveClass('paper-lens-shell');
    });
});
