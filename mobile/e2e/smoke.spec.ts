import { expect, test } from '@playwright/test';

const dangerousMockTexts = [
  ['Sumar', ' 100'].join(''),
  ['AURIOS', '_BALANCE'].join(''),
  ['28', '40'].join(''),
  ['Edit app', '/index.tsx'].join(''),
];
const aurioPaymentCopyPattern = new RegExp(
  `${['Pagar con', 'Aurios'].join(' ')}|${['Pago con', 'Aurios'].join(' ')}`,
  'i',
);
const minCharactersCopyPattern = new RegExp(['Minimo 50', 'caracteres'].join(' '), 'i');
const negativeAurioCopyPattern = new RegExp(
  `${['-0', '/'].join(' ')}|${['-0', 'Aurios'].join(' ')}|${['Balance', '-0'].join(' ')}`,
  'i',
);

async function expectDangerousMocksHidden(page: import('@playwright/test').Page): Promise<void> {
  for (const text of dangerousMockTexts) {
    await expect(page.getByText(text, { exact: false })).toHaveCount(0);
  }
}

test.describe('Chakana web smoke', () => {
  test('la app carga la UI migrada', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByText(['Edit app', '/index.tsx to edit this screen'].join(''), { exact: false }),
    ).toHaveCount(0);
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
    await expect(page.getByText(/Reseña|Resena/i).first()).toBeVisible();
    await expect(page.getByText(/Checkout/i).first()).toBeVisible();
  });

  test('wallet UI existe sin depender de Phantom', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByTestId('connect-wallet-button')).toBeVisible();
    await expect(page.getByText(/Conectar wallet|wallet/i).first()).toBeVisible();
  });

  test('formulario de reseñas renderiza sin enviar datos reales', async ({ page }) => {
    await page.goto('/inventario/raiz-cafe');

    await expect(page.getByTestId('review-form')).toBeVisible();
    await expect(page.getByTestId('review-text-input')).toBeVisible();
    await expect(page.getByTestId('submit-review-button')).toBeVisible();
    await expect(page.getByTestId('review-word-count')).toBeVisible();
    await expect(page.getByText(/Mínimo 50 palabras|Minimo 50 palabras/i).first()).toBeVisible();
    await expect(page.getByText(minCharactersCopyPattern)).toHaveCount(0);
  });

  test('checkout muestra pago Stripe con Aurio opcional', async ({ page }) => {
    await page.goto('/checkout');

    await expect(page.getByText(/Checkout/i).first()).toBeVisible();
    const skipDiscountButton = page.getByText(/Omitir descuento/i);
    if (await skipDiscountButton.count()) {
      await expect(skipDiscountButton.first()).toBeVisible();
      await expect(page.getByText(/Aplicar descuento Aurio/i).first()).toBeVisible();
      await skipDiscountButton.first().click();
    }

    await expect(page.getByText(/Confirma tu pago|Pagar con tarjeta/i).first()).toBeVisible();
    await expect(page.getByText(/Total a cobrar/i).first()).toBeVisible();
    await expect(page.getByText(/Pago cifrado · Stripe/i).first()).toBeVisible();
    await expect(page.getByText(aurioPaymentCopyPattern)).toHaveCount(0);
    await expect(page.getByText(/-\d+\s*\/\s*\d+\s*Aurios/i)).toHaveCount(0);
    await expect(page.getByText(negativeAurioCopyPattern)).toHaveCount(0);
    await expect(
      page.getByText(/Inicia sesión para pagar con tarjeta|Se requiere una sesión activa para iniciar checkout con tarjeta/i),
    ).toBeVisible();
    await expect(page.getByTestId('checkout-pay-button')).toBeVisible();

  });
});
