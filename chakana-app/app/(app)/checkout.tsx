import React, { useEffect, useState } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AurioDiscountStep from '../../components/checkout/AurioDiscountStep';
import CashPaymentCard from '../../components/checkout/CashPaymentCard';
import OrderCard from '../../components/checkout/OrderCard';
import PaymentMethodStep from '../../components/checkout/PaymentMethodStep';
import StripePaymentCard from '../../components/checkout/StripePaymentCard';
import PageHeader from '../../components/core/PageHeader';
import PageNav from '../../components/core/PageNav';
import ReviewForm from '../../components/reviews/ReviewForm';
import { useCartItems, useCartTotal } from '../../store/cart';
import { useAuth } from '../../src/hooks/useAuth';
import { useCashCheckout } from '../../src/hooks/useCashCheckout';
import { type CheckoutDestination, useCheckout } from '../../src/hooks/useCheckout';
import { useHybridCheckout } from '../../src/hooks/useHybridCheckout';
import { useWallet } from '../../src/hooks/useWallet';
import { useWalletSigner } from '../../src/hooks/useWalletSigner';
import { getBusinessById } from '../../src/services/supabase';
import type { Tables } from '../../src/types/database';

type CheckoutStep = 'discount' | 'payment' | 'postPurchaseReview';
type PaymentMethod = 'stripe' | 'cash';
type Business = Tables<'businesses'>;

function openCheckoutUrl(url: string): void {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.location.href = url;
    return;
  }

  void Linking.openURL(url);
}

export default function Checkout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stripeSessionId, setStripeSessionId] = useState<string | null>(null);
  const [cashOrderId, setCashOrderId] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('discount');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('stripe');
  const [didSkipDiscount, setDidSkipDiscount] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const cartItems = useCartItems();
  const visualSubtotal = useCartTotal();
  const { isConnected: isSupabaseConnected } = useAuth();
  const { aurioBalance, walletPubKey } = useWallet();
  const { signTransaction } = useWalletSigner();
  const {
    checkoutTotal,
    auriosToSpend,
    discountResult,
    sliderMax,
    checkoutError,
    checkoutSignature,
    redeemedAurios,
    isProcessing,
    setTotal,
    onSliderChange,
    confirmCheckout,
    resetCheckout,
  } = useCheckout();
  const { isHybridProcessing, hybridError, confirmHybridCheckout } = useHybridCheckout();
  const { isCashProcessing, cashError, confirmCashOrder } = useCashCheckout();

  const subtotal = visualSubtotal > 0 ? visualSubtotal : checkoutTotal;
  const businessId = cartItems[0]?.businessId ?? null;
  const hasMixedBusinesses = cartItems.some((item) => item.businessId !== businessId);
  const destination: CheckoutDestination | null = business?.wallet_adress
    ? { mode: 'wallet', payoutWallet: business.wallet_adress }
    : null;
  const cartPayload = cartItems.map((item) => ({ productId: item.id, quantity: item.qty }));
  const hasCart = cartPayload.length > 0 && subtotal > 0;
  const hasAurioDiscount = auriosToSpend > 0;
  const hasAppliedAurioDiscount = redeemedAurios > 0 && Boolean(checkoutSignature);
  const hasAvailableAurios = aurioBalance > 0 || hasAppliedAurioDiscount;
  const displayedAurios = hasAppliedAurioDiscount ? redeemedAurios : auriosToSpend;

  const isAurioDisabled =
    !walletPubKey ||
    !hasAurioDiscount ||
    !signTransaction ||
    !destination ||
    isProcessing ||
    hasAppliedAurioDiscount;

  const isCardDisabled =
    !businessId ||
    !business ||
    hasMixedBusinesses ||
    !hasCart ||
    !isSupabaseConnected ||
    !business.stripe_account_id ||
    isProcessing ||
    isHybridProcessing ||
    (hasAurioDiscount && !hasAppliedAurioDiscount);

  const isCashDisabled =
    !businessId ||
    !business ||
    hasMixedBusinesses ||
    !hasCart ||
    !isSupabaseConnected ||
    isProcessing ||
    isCashProcessing ||
    (hasAurioDiscount && !hasAppliedAurioDiscount);

  useEffect(() => {
    if (!businessId) {
      setBusiness(null);
      return;
    }

    void getBusinessById(businessId)
      .then((nextBusiness) => {
        setBusiness(nextBusiness);
        setBusinessError(null);
      })
      .catch((error: unknown) => {
        setBusiness(null);
        setBusinessError(error instanceof Error ? error.message : 'No se pudo cargar el Tambú.');
      });
  }, [businessId]);

  useEffect(() => {
    if (subtotal !== checkoutTotal) {
      setTotal(subtotal);
    }
  }, [checkoutTotal, setTotal, subtotal]);

  useEffect(() => {
    if (!hasAvailableAurios && checkoutStep === 'discount') {
      setCheckoutStep('payment');
    }
    if (
      hasAvailableAurios &&
      !didSkipDiscount &&
      !hasAppliedAurioDiscount &&
      !stripeSessionId &&
      !cashOrderId &&
      checkoutStep === 'payment'
    ) {
      setCheckoutStep('discount');
    }
  }, [
    checkoutStep,
    didSkipDiscount,
    hasAppliedAurioDiscount,
    hasAvailableAurios,
    stripeSessionId,
    cashOrderId,
  ]);

  const handleAuriosChange = (value: number): void => {
    onSliderChange(Math.min(value, sliderMax));
  };

  const handleSkipDiscount = (): void => {
    resetCheckout();
    setTotal(subtotal);
    setDidSkipDiscount(true);
    setCheckoutStep('payment');
  };

  const handleApplyAurioDiscount = (): void => {
    if (!destination || !signTransaction || isAurioDisabled) return;

    void confirmCheckout({
      destination,
      signTransaction,
    }).then((result) => {
      if (result) {
        setDidSkipDiscount(false);
        setCheckoutStep('payment');
      }
    });
  };

  const handleCardPayment = (): void => {
    if (isCardDisabled) return;

    void confirmHybridCheckout({
      destination,
      signTransaction,
      businessId: businessId ?? '',
      cartItems: cartPayload,
    }).then((result) => {
      if (result?.stripeSessionId) {
        setStripeSessionId(result.stripeSessionId);
        setCheckoutStep('postPurchaseReview');
      }
      if (result?.stripeCheckoutUrl) {
        openCheckoutUrl(result.stripeCheckoutUrl);
      }
    });
  };

  const handleCashPayment = (): void => {
    if (isCashDisabled) return;

    const cashCartItems = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.qty,
      unitAmountCents: Math.round(item.price * 100),
    }));

    void confirmCashOrder({
      businessId: businessId ?? '',
      cartItems: cashCartItems,
      subtotalCents: Math.round(subtotal * 100),
      auriosSpent: displayedAurios,
      aurioDiscountCents: Math.round(discountResult.discountUSD * 100),
      finalTotalCents: Math.round(discountResult.finalTotal * 100),
      aurioSignature: checkoutSignature ?? undefined,
      walletPubKey: walletPubKey ?? undefined,
    }).then((result) => {
      if (result?.orderId) {
        setCashOrderId(result.orderId);
        setCheckoutStep('postPurchaseReview');
      }
    });
  };

  const isPostPurchase = checkoutStep === 'postPurchaseReview';
  const showReview = isPostPurchase && (Boolean(stripeSessionId) || Boolean(cashOrderId));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageNav label="02 · CHECKOUT" onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <PageHeader
          eyebrow={`· ${business?.name ?? 'TAMBU'} ·`}
          title={isPostPurchase ? '¡Gracias!' : 'Tu pedido'}
          accent={isPostPurchase ? 'Confirmado.' : 'de hoy.'}
          subtitle={
            isPostPurchase
              ? 'Tu orden ha sido registrada. Puedes ver los detalles en tu perfil.'
              : 'Aurio registra tu descuento en Chakana. El cobro final se abre con Stripe Connect.'
          }
        />

        {!isPostPurchase && (
          <OrderCard
            subtotal={subtotal}
            aurios={displayedAurios}
            discount={discountResult.discountUSD}
          />
        )}

        {hasAvailableAurios && checkoutStep === 'discount' ? (
          <AurioDiscountStep
            subtotal={subtotal}
            auriosToSpend={auriosToSpend}
            aurioBalance={aurioBalance}
            sliderMax={sliderMax}
            isWalletConnected={Boolean(walletPubKey)}
            hasAppliedAurioDiscount={hasAppliedAurioDiscount}
            isProcessing={isProcessing}
            isAurioDisabled={isAurioDisabled}
            checkoutError={checkoutError}
            hybridError={hybridError}
            onAuriosChange={handleAuriosChange}
            onApply={handleApplyAurioDiscount}
            onSkip={handleSkipDiscount}
          />
        ) : null}

        {checkoutStep === 'payment' ? (
          <>
            <PaymentMethodStep
              selectedMethod={selectedMethod}
              onSelectMethod={setSelectedMethod}
            />

            {selectedMethod === 'stripe' ? (
              <StripePaymentCard
                subtotal={subtotal}
                auriosApplied={displayedAurios}
                aurioDiscount={discountResult.discountUSD}
                total={discountResult.finalTotal}
                isProcessing={isHybridProcessing}
                isDisabled={isCardDisabled}
                requiresLogin={!isSupabaseConnected}
                onPay={handleCardPayment}
                onLogin={() => router.push('/login')}
              />
            ) : (
              <CashPaymentCard
                subtotal={subtotal}
                auriosApplied={displayedAurios}
                aurioDiscount={discountResult.discountUSD}
                total={discountResult.finalTotal}
                isProcessing={isCashProcessing}
                isDisabled={isCashDisabled}
                cashError={cashError}
                onConfirm={handleCashPayment}
              />
            )}

            {businessError ? <Text style={styles.error}>{businessError}</Text> : null}
            {selectedMethod === 'stripe' && business && !business.stripe_account_id ? (
              <Text style={styles.error}>
                Este Tambú todavía no conectó Stripe. El dueño debe entrar al panel Tambú y tocar
                "Conectar Stripe".
              </Text>
            ) : null}
            {hasMixedBusinesses ? (
              <Text style={styles.error}>El carrito solo puede incluir un Tambú por checkout.</Text>
            ) : null}
            {hybridError ? <Text style={styles.error}>{hybridError}</Text> : null}
          </>
        ) : null}

        {showReview ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuéntanos tu experiencia</Text>
            <Text style={styles.sectionCopy}>
              Publica un comentario de al menos 50 palabras y gana 1 Aurio.
            </Text>
            {businessId ? <ReviewForm businessId={businessId} /> : null}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 24, gap: 14 },
  section: { gap: 10 },
  sectionTitle: { color: '#2E2A26', fontSize: 18, fontWeight: '700' },
  sectionCopy: { color: '#6B645C', fontSize: 12.5, lineHeight: 18 },
  error: { color: '#86231A', fontSize: 12.5, fontWeight: '600' },
});
