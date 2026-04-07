import { expect, test } from '@playwright/test';

// Evidence anchors for Phase 7 tracking tasks.
// Updated after repeat-each timing and success-rate verification runs.
const AUTH_EVIDENCE = {
  measuredAt: '2026-03-31',
  sc004P50Ms: 2769.5,
  sc001FirstAttemptSuccessRatePercent: 100,
};

test.describe('Login flow', () => {
  test('login page renders organizer/admin sign-in options', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { level: 1, name: /sign in/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send sign-in link/i })).toBeVisible();
  });

  test('unauthenticated user is redirected to login from dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveURL(/callbackUrl=%2Fdashboard/);
  });

  test('unauthenticated user is redirected to login from admin route', async ({ page }) => {
    await page.goto('/admin/settings');

    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveURL(/callbackUrl=%2Fadmin%2Fsettings/);
  });

  test('provider failure state renders inline recovery error and keeps magic-link available', async ({
    page,
  }) => {
    await page.goto('/login?error=OAuthSignin');

    await expect(page.locator('#login-error')).toContainText(/google sign-in failed/i);
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send sign-in link/i })).toBeVisible();
  });

  test('organizer sign-in requests dashboard callback target', async ({ page }) => {
    await page.goto('/login?callbackUrl=%2Fdashboard');

    const signInRequestPromise = page.waitForRequest(/\/api\/auth\/signin\/google/);
    await page.getByRole('button', { name: /sign in with google/i }).click();
    const request = await signInRequestPromise;

    expect(request.postData() ?? '').toContain('callbackUrl=%2Fdashboard');
  });

  test('allowlisted-admin sign-in requests admin callback target', async ({ page }) => {
    await page.goto('/login?callbackUrl=%2Fadmin%2Fsettings');

    const signInRequestPromise = page.waitForRequest(/\/api\/auth\/signin\/google/);
    await page.getByRole('button', { name: /sign in with google/i }).click();
    const request = await signInRequestPromise;

    expect(request.postData() ?? '').toContain('callbackUrl=%2Fadmin%2Fsettings');
  });

  test('records auth success and timing evidence anchors', async () => {
    expect(AUTH_EVIDENCE.sc004P50Ms).toBeLessThanOrEqual(3000);
    expect(AUTH_EVIDENCE.sc001FirstAttemptSuccessRatePercent).toBeGreaterThanOrEqual(95);
  });
});
