import { expect, test } from '@playwright/test';

import { mockApiDefaults, searchResponseWithOneHit } from './helpers';

function pageOne() {
  const base = searchResponseWithOneHit();
  return { ...base, total: 45, has_more: true, returned: 20 };
}

test.describe('journey: offset pagination', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiDefaults(page);
    await page.route('**/api/search/', async (route) => {
      const body = JSON.parse(route.request().postData() ?? '{}');
      const isPageTwo = body.page === 2;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(isPageTwo ? { ...pageOne(), page: 2 } : pageOne()),
      });
    });
  });

  test('clicking Next advances to page 2 and updates the URL', async ({ page }) => {
    await page.goto('/search?q=wireless');

    // Wait for the pagination control to show page 1.
    await expect(page.getByText('Page 1')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByText('Page 2')).toBeVisible();
  });

  test('Previous is disabled on page 1', async ({ page }) => {
    await page.goto('/search?q=wireless');
    await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });
});
