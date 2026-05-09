import { test, expect, Page } from '@playwright/test';

// Authenticate by filling the login form on web
async function loginAsEmbajador(page: Page) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // TextInput renders as <input> in react-native-web
  await page.locator('input[placeholder="tu@correo.com"]').fill('embajador@chakana.ec');
  await page.locator('input[placeholder="••••••••"]').fill('chakana123');

  // TouchableOpacity renders as a div; target by visible text
  await page.getByText('Iniciar sesión').click();
  await page.waitForURL(/home/, { timeout: 10_000 });
}

test.describe('Golden Path — Embajador', () => {
  test('01 · Login flow', async ({ page }) => {
    await loginAsEmbajador(page);
    await expect(page).toHaveURL(/home/);
    await page.screenshot({ path: 'tests/screenshots/01-home.png', fullPage: true });
  });

  test('02 · Home — TambuCards visibles', async ({ page }) => {
    await loginAsEmbajador(page);

    // Category chips bar
    await expect(page.getByText(/CARRITO|PERFIL/i).first()).toBeVisible({ timeout: 6_000 });

    // At least one card with "aurios" text
    await expect(page.getByText(/aurios/i).first()).toBeVisible({ timeout: 6_000 });

    await page.screenshot({ path: 'tests/screenshots/02-home-cards.png', fullPage: true });
  });

  test('03 · Home → Inventario', async ({ page }) => {
    await loginAsEmbajador(page);

    // Click first link to inventario
    const inventarioLink = page.locator('a[href*="inventario"]').first();
    await inventarioLink.waitFor({ timeout: 8_000 });
    await inventarioLink.click();

    await page.waitForURL(/inventario/, { timeout: 8_000 });
    // "INVENTARIO DISPONIBLE" is the section header — always at the top, not clipped
    await expect(page.getByText(/INVENTARIO/i).first()).toBeVisible({ timeout: 6_000 });

    await page.screenshot({ path: 'tests/screenshots/03-inventario.png', fullPage: true });
  });

  test('04 · Carrito — labels visibles', async ({ page }) => {
    await loginAsEmbajador(page);
    await page.goto('/carrito');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/CARRITO/i).first()).toBeVisible({ timeout: 6_000 });
    await page.screenshot({ path: 'tests/screenshots/04-carrito.png', fullPage: true });
  });

  test('05 · Checkout — slider y desglose', async ({ page }) => {
    await loginAsEmbajador(page);
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/CHECKOUT/i).first()).toBeVisible({ timeout: 6_000 });
    await expect(page.getByText(/descuento/i).first()).toBeVisible({ timeout: 6_000 });
    await page.screenshot({ path: 'tests/screenshots/05-checkout.png', fullPage: true });
  });

  test('06 · Pago — formulario Stripe mock', async ({ page }) => {
    await loginAsEmbajador(page);
    await page.goto('/pagare');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/PAGO/i).first()).toBeVisible({ timeout: 6_000 });
    await expect(page.getByText(/SANDBOX/i)).toBeVisible({ timeout: 6_000 });
    await expect(page.getByText(/4242/)).toBeVisible({ timeout: 6_000 });
    await page.screenshot({ path: 'tests/screenshots/06-pagare.png', fullPage: true });
  });

  test('07 · Reseña — estrellas y tags', async ({ page }) => {
    await loginAsEmbajador(page);
    await page.goto('/resena');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/RESEÑA/i).first()).toBeVisible({ timeout: 6_000 });
    await expect(page.getByText(/Aurios/i).first()).toBeVisible({ timeout: 6_000 });
    await expect(page.getByText(/Frescura|Atención|recomendaría/i).first()).toBeVisible({ timeout: 6_000 });
    await page.screenshot({ path: 'tests/screenshots/07-resena.png', fullPage: true });
  });
});

test.describe('Visual Regression — Layout', () => {
  test.beforeEach(async ({ page }) => { await loginAsEmbajador(page); });

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
