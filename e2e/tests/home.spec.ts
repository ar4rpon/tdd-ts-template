import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'TDD TS Template' })).toBeVisible();
  });

  test('should display welcome message', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Welcome to your TDD-ready TypeScript monorepo')).toBeVisible();
  });
});
