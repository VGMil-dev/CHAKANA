import { expect, test } from '@playwright/test';

const dangerousMockTexts = [
  ['Sumar', ' 100'].join(''),
  ['AURIOS', '_BALANCE'].join(''),
  ['28', '40'].join(''),
  ['Edit app', '/index.tsx'].join(''),
];

async function expectDangerousMocksHidden(page: import('@playwright/test').Page): Promise<void> {
  for (const text of dangerousMockTexts) {
    await expect(page.getByText(text, { exact: false })).toHaveCount(0);
  }
}

test.describe('Chakana web smoke', () => {
  test('la app carga la UI migrada', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText(['Edit app', '/index.tsx to edit this screen'].join(''), { exact: false })).toHaveCount(0);
    await expect(page.getByText(/Tu ciudad|Tu retorno|Chakana|Conectar wallet|Tambu/i).first()).toBeVisible();
  });

  test('no aparecen mocks peligrosos', async ({ page }) => {
    await page.goto('/');

    await expectDangerousMocksHidden(page);
  });

  test('dev-test sigue accesible', async ({ page }) => {
    await page.goto('/dev-test');

    await expect(page.getByTestId('dev-test-screen')).toBeVisible();
    await expect(page.getByText(/Aurio/i).first()).toBeVisible();
    await expect(page.getByText(/Reseña/i).first()).toBeVisible();
    await expect(page.getByText(/Checkout/i).first()).toBeVisible();
  });

  test('wallet UI existe sin depender de Phantom', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByTestId('connect-wallet-button')).toBeVisible();
    await expect(page.getByText(/Conectar wallet|wallet/i).first()).toBeVisible();
  });
});
