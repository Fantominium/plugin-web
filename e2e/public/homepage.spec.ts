import { expect, test } from '@playwright/test';

test('visitor can browse core homepage sections', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /browse events/i })).toHaveAttribute(
    'href',
    '/events',
  );
  await expect(page.getByRole('link', { name: /contact us/i }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /featured events/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /browse by category/i })).toBeVisible();
});
