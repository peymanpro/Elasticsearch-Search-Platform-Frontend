import { expect, test } from '@playwright/test';

import { mockApiDefaults, searchResponseWithOneHit } from './helpers';

test.describe('journey: filter and sort the result set', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiDefaults(page);
    await page.route('**/api/search/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(searchResponseWithOneHit()),
      });
    });
  });

  test('clicking a category filter updates the URL and shows a chip', async ({ page }) => {
    await page.goto('/search?q=wireless');

    // Wait for results to render so the filter panel has facet data.
    await expect(
      page.getByRole('list', { name: 'Search results' }).getByRole('heading', { level: 3 }),
    ).toBeVisible();

    // The category filter button in the left panel.
    const filterPanel = page.getByRole('complementary').first();
    await filterPanel.getByRole('button', { name: /Electronics/ }).click();

    await expect(page).toHaveURL(/category=Electronics/);

    // The chip appears in the active filter list.
    const chips = page.getByRole('list', { name: 'Active filters' });
    await expect(chips.getByText(/Category: Electronics/)).toBeVisible();
  });

  test('changing sort updates the URL', async ({ page }) => {
    await page.goto('/search?q=wireless');

    await page.getByLabel('Sort by').selectOption('price.asc');
    await expect(page).toHaveURL(/sort=price\.asc/);
  });
});
