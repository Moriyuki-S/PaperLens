import { describe, expect, it } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
    it('joins plain class values', () => {
        expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
    });

    it('merges conflicting tailwind classes', () => {
        expect(cn('px-2', false && 'py-2', 'px-4', 'font-semibold')).toBe(
            'px-4 font-semibold',
        );
    });
});
