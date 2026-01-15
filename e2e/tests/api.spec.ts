import { test, expect } from '@playwright/test';

test.describe('API', () => {
  test('health endpoint should return ok', async ({ request }) => {
    const response = await request.get('http://localhost:3001/health');
    expect(response.ok()).toBeTruthy();
    expect(await response.json()).toEqual({ status: 'ok' });
  });

  test('root endpoint should return hello message', async ({ request }) => {
    const response = await request.get('http://localhost:3001');
    expect(response.ok()).toBeTruthy();
    expect(await response.text()).toBe('Hello World!');
  });
});
