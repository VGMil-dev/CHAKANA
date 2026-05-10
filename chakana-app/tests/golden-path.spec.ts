import { test, expect } from '@playwright/test';

const E2E_EMAIL = process.env.E2E_EMAIL;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

async function login(page: import('@playwright/test').Page) {
  if (!E2E_EMAIL || !E2E_PASSWORD) {
    test.skip(true, 'Set E2E_EMAIL and E2E_PASSWORD for the real Supabase Golden Path.');
  }

  await page.goto('/login');
  await page.locator('input[placeholder="tu@correo.com"]').fill(E2E_EMAIL);
  await page.locator('input[placeholder="••••••••"]').fill(E2E_PASSWORD);
  await page.getByText('Iniciar sesión').click();
  await page.waitForURL(/home/, { timeout: 20_000 });
}

test.describe('Chakana real app smoke', () => {
  test('login UI no usa auth fake', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByTestId('connect-wallet-button')).toBeVisible();
    await expect(page.locator('input[placeholder="tu@correo.com"]')).toBeVisible();
    await expect(page.getByText(/embajador@chakana|chakana123|SANDBOX|Payment Link/i)).toHaveCount(0);
  });

  test('no aparecen dummies peligrosos', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByText(/AURIOS_BALANCE|PEDIDOS_MOCK|DASHBOARD_MOCK|TAMBUSES|2,840|2772/i)).toHaveCount(0);
  });
});

test.describe('Golden Path real con Supabase', () => {
  test('login, home, inventario, carrito y checkout real renderizan', async ({ page }) => {
    await login(page);

    await expect(page.getByText(/Tambús que/i)).toBeVisible({ timeout: 20_000 });
    const firstTambu = page.locator('a[href*="inventario"]').first();
    await firstTambu.click();
    await page.waitForURL(/inventario/, { timeout: 20_000 });

    await expect(page.getByText(/INVENTARIO DISPONIBLE/i)).toBeVisible();
    const addButton = page.locator('[role="button"]').filter({ hasText: /^$/ }).first();
    if (await addButton.count()) await addButton.click();

    await page.goto('/carrito');
    await expect(page.getByText(/CARRITO|Tu selección/i).first()).toBeVisible();

    await page.goto('/checkout');
    await expect(page.getByText(/CHECKOUT/i).first()).toBeVisible();
    await expect(page.getByText(/Stripe Connect/i).first()).toBeVisible();
    await expect(page.getByText(/Payment Link|SANDBOX/i)).toHaveCount(0);
  });
});
