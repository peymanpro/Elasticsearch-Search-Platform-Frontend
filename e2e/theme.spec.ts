import { expect, test } from '@playwright/test';

import { mockApiDefaults } from './helpers';

test.describe('journey: theme toggle', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiDefaults(page);
  });

  test('toggles the dark class on the html element', async ({ page }) => {
    await page.goto('/search?q=wireless');

    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole('button', { name: /Switch to dark mode/i }).click();
    await expect(html).toHaveClass(/dark/);
  });

  test('the theme survives a page reload', async ({ page }) => {
    await page.goto('/search?q=wireless');

    await page.getByRole('button', { name: /Switch to dark mode/i }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});
