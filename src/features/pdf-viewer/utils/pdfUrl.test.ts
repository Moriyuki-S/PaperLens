import { describe, expect, it } from 'vitest';

import { buildPdfUrl, normalizePdfUrlInput } from './pdfUrl';

describe('pdfUrl', () => {
    it('normalizes protocol and trailing slashes', () => {
        expect(normalizePdfUrlInput(' https://example.com/sample/ ')).toBe(
            'example.com/sample',
        );
        expect(normalizePdfUrlInput('http://example.com/sample.pdf')).toBe(
            'example.com/sample.pdf',
        );
    });

    it('preserves query strings and hashes', () => {
        expect(
            normalizePdfUrlInput(
                'https://example.com/sample.pdf?download=1#page=2',
            ),
        ).toBe('example.com/sample.pdf?download=1#page=2');
    });

    it('builds a full https URL', () => {
        expect(buildPdfUrl('example.com/sample.pdf')).toBe(
            'https://example.com/sample.pdf',
        );
    });
});
