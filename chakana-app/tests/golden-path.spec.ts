import { test, expect, Page } from '@playwright/test';

const EMBAJADOR = {
  name: 'Valentina Torres',
  email: 'embajador@chakana.ec',
  role: 'embajador' as const,
  walletAddress: '',
};

// Fast auth: inject directly into localStorage (avoids re-testing the login UI in every test)
async function authenticate(page: Page) {
  await page.goto('/');
  await page.evaluate((user) => {
    localStorage.setItem('chakana-auth', JSON.stringify({
      state: { isAuthenticated: true, user },
      version: 0,
    }));
  }, EMBAJADOR);
  await page.goto('/home');
  await page.waitForURL(/home/, { timeout: 15_000 });
}

// Clear auth (for the login-UI test)
async function clearAuth(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('chakana-auth'));
}

test.describe('Golden Path — Embajador', () => {
  test('01 · Login UI — form funciona', async ({ page }) => {
    await clearAuth(page);
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // TextInput renders as <input> in react-native-web
    await page.locator('input[placeholder="tu@correo.com"]').fill(EMBAJADOR.email);
    await page.locator('input[placeholder="••••••••"]').fill('chakana123');
    await page.getByText('Iniciar sesión').click();

    await page.waitForURL(/home/, { timeout: 15_000 });
    await expect(page).toHaveURL(/home/);
    await page.screenshot({ path: 'tests/screenshots/01-home.png', fullPage: true });
  });

  test('02 · Home — TambuCards y Dial visibles', async ({ page }) => {
    await authenticate(page);

    await expect(page.getByText(/CARRITO|PERFIL/i).first()).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/aurios|Aurios/i).first()).toBeVisible({ timeout: 8_000 });

    await page.screenshot({ path: 'tests/screenshots/02-home.png', fullPage: true });
  });

  test('03 · Home → Inventario — navegación y productos', async ({ page }) => {
    await authenticate(page);

    const inventarioLink = page.locator('a[href*="inventario"]').first();
    await inventarioLink.waitFor({ timeout: 8_000 });
    await inventarioLink.click();

    await page.waitForURL(/inventario/, { timeout: 10_000 });
    await expect(page.getByText(/INVENTARIO/i).first()).toBeVisible({ timeout: 8_000 });

    await page.screenshot({ path: 'tests/screenshots/03-inventario.png', fullPage: true });
  });

  test('04 · Carrito — pantalla renderiza', async ({ page }) => {
    await authenticate(page);
    await page.goto('/carrito');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/CARRITO/i).first()).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: 'tests/screenshots/04-carrito.png', fullPage: true });
  });

  test('05 · Checkout — slider y desglose visibles', async ({ page }) => {
    await authenticate(page);
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/CHECKOUT/i).first()).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/descuento/i).first()).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: 'tests/screenshots/05-checkout.png', fullPage: true });
  });

  test('06 · Pago — formulario Stripe mock', async ({ page }) => {
    await authenticate(page);
    await page.goto('/pagare');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/PAGO/i).first()).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/SANDBOX/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/4242/)).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: 'tests/screenshots/06-pagare.png', fullPage: true });
  });

  test('07 · Reseña — estrellas y tags', async ({ page }) => {
    await authenticate(page);
    await page.goto('/resena');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/RESEÑA/i).first()).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/Aurios/i).first()).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/Frescura|Atención|recomendaría/i).first()).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: 'tests/screenshots/07-resena.png', fullPage: true });
  });
});

test.describe('Visual Regression — Layout', () => {
  test.beforeEach(async ({ page }) => authenticate(page));

  test('home no tiene overflow horizontal', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    const cw = await page.evaluate(() => document.documentElement.clientWidth);
    expect(sw).toBeLessThanOrEqual(cw + 4);
  });

  test('checkout no tiene overflow horizontal', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    const cw = await page.evaluate(() => document.documentElement.clientWidth);
    expect(sw).toBeLessThanOrEqual(cw + 4);
  });
});
