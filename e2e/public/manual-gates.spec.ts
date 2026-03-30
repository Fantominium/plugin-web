import { expect, test } from '@playwright/test';

function hasNoHorizontalScroll() {
  return {
    fitsViewport:
      document.documentElement.scrollWidth <= window.innerWidth &&
      document.body.scrollWidth <= window.innerWidth,
  };
}

test.describe('manual gate regression coverage', () => {
  test('homepage and contact-us landmarks/headings remain valid', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(
      page.getByRole('heading', { level: 1, name: /discover events in barbados/i }),
    ).toBeVisible();

    const navLabels = await page
      .locator('nav')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('aria-label') ?? '').filter(Boolean),
      );

    expect(navLabels.length).toBeGreaterThan(0);
    expect(new Set(navLabels).size).toBe(navLabels.length);

    await page.goto('/contact-us');

    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1, name: /contact us/i })).toHaveCount(1);

    const headingLevels = await page
      .locator('h1, h2, h3')
      .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName.slice(1))));

    expect(headingLevels[0]).toBe(1);
    for (let index = 1; index < headingLevels.length; index += 1) {
      expect(headingLevels[index] - headingLevels[index - 1]).toBeLessThanOrEqual(1);
    }
  });

  test('skip link visibility and mobile menu keyboard behavior remain accessible', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    const menuButton = page.locator('button[aria-controls="mobile-menu-dialog"]');
    await menuButton.focus();
    await page.keyboard.press('Enter');

    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-menu-dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(menuButton).toBeFocused();

    await menuButton.focus();
    await page.keyboard.press(' ');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    const firstMobileLink = page
      .locator('#mobile-menu-dialog')
      .getByRole('link', { name: /^home$/i })
      .first();
    await expect(firstMobileLink).toBeFocused();
  });

  test('homepage and contact-us render without horizontal scrolling at 360px and 1280px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    expect(await page.evaluate(hasNoHorizontalScroll)).toEqual({ fitsViewport: true });

    await page.goto('/contact-us');
    expect(await page.evaluate(hasNoHorizontalScroll)).toEqual({ fitsViewport: true });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    expect(await page.evaluate(hasNoHorizontalScroll)).toEqual({ fitsViewport: true });

    await page.goto('/contact-us');
    expect(await page.evaluate(hasNoHorizontalScroll)).toEqual({ fitsViewport: true });

    await page.goto('/');
    const menuButton = page.locator('button[aria-controls="mobile-menu-dialog"]');
    await expect(menuButton).toBeVisible();
  });
});
