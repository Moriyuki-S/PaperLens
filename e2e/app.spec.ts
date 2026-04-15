import { expect, test } from '@playwright/test';

test('shows the PDF empty state', async ({ page }) => {
    await page.goto('/');

    await expect(
        page.getByRole('heading', { name: 'Start by selecting a PDF' }),
    ).toBeVisible();
    await expect(page.getByText('PaperLens')).toBeVisible();
    await expect(
        page.getByRole('button', { name: 'Choose file' }),
    ).toBeVisible();
});
