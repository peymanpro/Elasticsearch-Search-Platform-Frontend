import { expect, test } from '@playwright/test';

import { mockApiDefaults, searchResponseWithOneHit } from './helpers';

test.describe('journey: explain a result', () => {
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

  test('opening the explain drawer shows the explanation tree', async ({ page }) => {
    await page.route('**/api/explain/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          matched: true,
          explanation: {
            value: 17.95,
            description: 'sum of:',
            details: [
              { value: 12.5, description: 'weight(name:wireless)', details: [] },
              { value: 5.45, description: 'weight(tags:wireless)', details: [] },
            ],
          },
        }),
      });
    });

    await page.goto('/search?q=wireless');
    await page.getByRole('button', { name: 'Why this result?' }).click();

    const drawer = page.getByRole('dialog', { name: 'Why this result?' });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText('sum of:')).toBeVisible();
    await expect(drawer.getByText('weight(name:wireless)')).toBeVisible();
  });

  test('shows a no-match message when the document does not match', async ({ page }) => {
    await page.goto('/search?q=wireless');
    await page.getByRole('button', { name: 'Why this result?' }).click();

    const drawer = page.getByRole('dialog', { name: 'Why this result?' });
    await expect(drawer.getByText('No match')).toBeVisible();
  });
});
