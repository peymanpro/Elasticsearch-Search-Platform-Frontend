import { expect, test } from '@playwright/test';

import { mockApiDefaults, searchResponseWithOneHit } from './helpers';

test.describe('search page', () => {
  test('renders the shell', async ({ page }) => {
    await mockApiDefaults(page);
    await page.goto('/search?q=wireless');

    await expect(page.getByRole('link', { name: 'Search Lens' })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: 'Search products' })).toHaveValue('wireless');
  });

  test('shows a result card from a mocked response', async ({ page }) => {
    await mockApiDefaults(page);
    await page.route('**/api/search/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(searchResponseWithOneHit()),
      });
    });

    await page.goto('/search?q=wireless');

    const results = page.getByRole('list', { name: 'Search results' });
    await expect(
      results.getByRole('heading', {
        name: /Wireless.*Headphones/i,
        level: 3,
      }),
    ).toBeVisible();
    // Sony appears in the result card, not just the filter panel.
    await expect(results.getByText('Sony')).toBeVisible();
  });
});
