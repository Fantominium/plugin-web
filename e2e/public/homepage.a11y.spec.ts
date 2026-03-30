import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('homepage has no critical accessibility violations', async ({ page }) => {
  await page.goto('/');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  const criticalViolations = accessibilityScanResults.violations.filter(
    (violation) => violation.impact === 'critical',
  );

  expect(criticalViolations).toHaveLength(0);
});
