import { expect, test } from '@playwright/test';

test('visitor can navigate to contact page and view contact details', async ({ page }) => {
  await page.goto('/contact-us');

  await expect(page.getByRole('heading', { level: 1, name: /contact us/i })).toBeVisible();
  await expect(
    page.getByRole('main').getByRole('link', { name: /info@pluginbim.com/i }),
  ).toBeVisible();
  await expect(page.getByRole('main').getByText('Barbados', { exact: true })).toBeVisible();
});
