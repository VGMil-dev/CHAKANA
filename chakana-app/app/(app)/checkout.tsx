import React, { useEffect, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import AuriosSlider from '../../components/checkout/AuriosSlider';
import OrderCard from '../../components/checkout/OrderCard';
import StripePaymentCard from '../../components/checkout/StripePaymentCard';
import ReviewForm from '../../components/reviews/ReviewForm';
import { useCartItems, useCartTotal } from '../../store/cart';
import { useAuth } from '../../src/hooks/useAuth';
import { type CheckoutDestination, useCheckout } from '../../src/hooks/useCheckout';
import { useHybridCheckout } from '../../src/hooks/useHybridCheckout';
import { useWallet } from '../../src/hooks/useWallet';
import { useWalletSigner } from '../../src/hooks/useWalletSigner';
import { getBusinessById } from '../../src/services/supabase';
import type { Tables } from '../../src/types/database';
import { formatUSD } from '../../src/utils/sliderConfig';

type CheckoutStep = 'discount' | 'payment' | 'postPurchaseReview';
type Business = Tables<'businesses'>;

function shortenAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

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
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('discount');
  const [didSkipDiscount, setDidSkipDiscount] = useState(false);
  const [demoPaymentMessage, setDemoPaymentMessage] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const cartItems = useCartItems();
  const visualSubtotal = useCartTotal();
  const { isConnected: isSupabaseConnected, isDemoMode } = useAuth();
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
    !hasAurioDiscount ||
    (!isDemoMode && (!walletPubKey || !signTransaction || !destination)) ||
    isProcessing ||
    hasAppliedAurioDiscount;
  const isCardDisabled =
    !businessId ||
    !business ||
    hasMixedBusinesses ||
    !hasCart ||
    !isSupabaseConnected ||
    isProcessing ||
    isHybridProcessing ||
    (hasAurioDiscount && !hasAppliedAurioDiscount && !isDemoMode);

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
      checkoutStep === 'payment'
    ) {
      setCheckoutStep('discount');
    }
  }, [checkoutStep, didSkipDiscount, hasAppliedAurioDiscount, hasAvailableAurios, stripeSessionId]);

  const handleAuriosChange = (value: number): void => {
    onSliderChange(Math.min(value, sliderMax));
  };

  const handleClearDiscount = (): void => {
    onSliderChange(0);
  };

  const handleSkipDiscount = (): void => {
    resetCheckout();
    setTotal(subtotal);
    setDidSkipDiscount(true);
    setCheckoutStep('payment');
  };

  const handleApplyAurioDiscount = (): void => {
    if (isDemoMode) {
      setDidSkipDiscount(false);
      setCheckoutStep('payment');
      return;
    }

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
        if (isDemoMode) {
          setDemoPaymentMessage('Pago simulado aprobado. No se movieron fondos reales.');
        }
        setCheckoutStep('postPurchaseReview');
      }
      if (result?.stripeCheckoutUrl && !isDemoMode) {
        openCheckoutUrl(result.stripeCheckoutUrl);
      }
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.nav}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.navBack, pressed && styles.pressed]}>
          <Ionicons name="arrow-back" size={20} color="#3D3D3D" />
        </Pressable>
        <Text style={styles.navLabel}>02 · CHECKOUT</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {isDemoMode ? (
            <View style={styles.demoPill}>
              <Text style={styles.demoPillText}>Modo demo</Text>
            </View>
          ) : null}
          <Text style={styles.eyebrow}>· {business?.name ?? 'TAMBU'} ·</Text>
          <Text style={styles.displayTitle}>
            Tu pedido{'\n'}<Text style={styles.displayAccent}>de hoy.</Text>
          </Text>
          <Text style={styles.headerCopy}>
            {isDemoMode
              ? 'Demo segura: no se firman transacciones ni se mueven fondos reales.'
              : 'Aurio registra tu descuento en Chakana. El cobro final se abre con Stripe Connect.'}
          </Text>
        </View>

        <OrderCard
          subtotal={subtotal}
          aurios={displayedAurios}
          discount={discountResult.discountUSD}
        />

        {hasAvailableAurios && checkoutStep === 'discount' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descuento Aurio</Text>
            <Text style={styles.sectionCopy}>
              ¿Quieres aplicar tus Aurios como descuento? Tambien puedes omitirlo y pagar el total con tarjeta.
            </Text>
            <AuriosSlider
              checkoutTotal={subtotal}
              auriosToSpend={auriosToSpend}
              aurioBalance={aurioBalance}
              sliderMax={sliderMax}
              isWalletConnected={Boolean(walletPubKey)}
              isLocked={hasAppliedAurioDiscount}
              onAuriosChange={handleAuriosChange}
              onClear={handleClearDiscount}
            />
            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>Balance disponible</Text>
              <Text style={styles.statusValue}>{Math.max(0, Math.floor(aurioBalance))} Aurios</Text>
              <Text style={styles.statusLine}>
                {hasAppliedAurioDiscount ? 'Aurios aplicados' : 'Aurios a aplicar'}: {displayedAurios} Aurios
              </Text>
              <Text style={styles.statusLine}>
                Descuento aplicado: {formatUSD(discountResult.discountUSD)}
              </Text>
              <Text style={styles.statusLine}>Maximo permitido: {sliderMax} Aurios</Text>
              {!hasAurioDiscount ? (
                <Text style={styles.neutral}>No aplicaras descuento Aurio.</Text>
              ) : null}
              {checkoutError ? <Text style={styles.error}>{checkoutError}</Text> : null}
              {hybridError ? <Text style={styles.error}>{hybridError}</Text> : null}
              {checkoutSignature ? (
                <Text style={styles.success}>Firma de redencion Aurio: {checkoutSignature}</Text>
              ) : null}
            </View>

            {!destination ? (
              <View style={styles.notice}>
                <Text style={styles.noticeText}>
                  Este Tambú todavía no tiene wallet de redención configurada.
                </Text>
              </View>
            ) : (
              <View style={styles.notice}>
                <Text style={styles.noticeConnectedText}>
                  Wallet del Tambú
                </Text>
                <Text style={styles.noticeMuted}>{shortenAddress(destination.payoutWallet)}</Text>
              </View>
            )}

            <View style={styles.discountActions}>
              <Pressable
                accessibilityRole="button"
                testID="checkout-aurio-discount-button"
                onPress={handleApplyAurioDiscount}
                disabled={isAurioDisabled}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  isAurioDisabled ? styles.secondaryButtonDisabled : null,
                  pressed && !isAurioDisabled ? styles.payPressed : null,
                ]}>
                <Ionicons name="ticket-outline" size={17} color="#A63A2F" />
                <Text style={styles.secondaryButtonText}>
                  {isProcessing ? 'Redimiendo...' : 'Aplicar descuento Aurio'}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                testID="checkout-skip-discount-button"
                onPress={handleSkipDiscount}
                style={styles.skipButton}>
                <Text style={styles.skipButtonText}>Omitir descuento</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {checkoutStep === 'payment' ? (
          <>
            <StripePaymentCard
              subtotal={subtotal}
              auriosApplied={displayedAurios}
              aurioDiscount={discountResult.discountUSD}
              total={discountResult.finalTotal}
              isProcessing={isHybridProcessing}
              isDisabled={isCardDisabled}
              requiresLogin={!isSupabaseConnected}
              isDemoMode={isDemoMode}
              onPay={handleCardPayment}
              onLogin={() => router.push('/login')}
            />
            {businessError ? <Text style={styles.error}>{businessError}</Text> : null}
            {hasMixedBusinesses ? <Text style={styles.error}>El carrito solo puede incluir un Tambú por checkout.</Text> : null}
            {hybridError ? <Text style={styles.error}>{hybridError}</Text> : null}
          </>
        ) : null}

        {checkoutStep === 'postPurchaseReview' && stripeSessionId ? (
          <View style={styles.section}>
            {demoPaymentMessage ? (
              <View style={styles.demoApproved}>
                <Text style={styles.demoApprovedTitle}>Pago simulado aprobado</Text>
                <Text style={styles.demoApprovedText}>{demoPaymentMessage}</Text>
              </View>
            ) : null}
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
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 4,
  },
  navBack: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontWeight: '600',
    fontSize: 11,
    color: '#6B645C',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  navSpacer: { width: 44 },
  pressed: { opacity: 0.75, transform: [{ translateY: 1 }] },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 24, gap: 14 },
  header: { marginBottom: 4 },
  demoPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F7E7E3',
    borderRadius: 999,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  demoPillText: {
    color: '#A63A2F',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  eyebrow: {
    fontWeight: '600',
    fontSize: 10,
    color: '#A63A2F',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  displayTitle: {
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 36,
    color: '#2E2A26',
    letterSpacing: 0,
    marginTop: 10,
  },
  displayAccent: { color: '#A63A2F' },
  headerCopy: {
    color: '#6B645C',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: '#2E2A26',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionCopy: {
    color: '#6B645C',
    fontSize: 12.5,
    lineHeight: 18,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    gap: 4,
    padding: 16,
  },
  statusTitle: {
    color: '#6B645C',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  statusValue: {
    color: '#3AAFA9',
    fontSize: 24,
    fontWeight: '700',
  },
  statusLine: {
    color: '#3D3D3D',
    fontSize: 12.5,
  },
  notice: {
    backgroundColor: '#F8F3EE',
    borderRadius: 10,
    gap: 6,
    padding: 14,
  },
  noticeText: {
    color: '#86231A',
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 18,
  },
  noticeConnectedText: {
    color: '#1F7A73',
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 18,
  },
  noticeMuted: {
    color: '#6B645C',
    fontSize: 12,
    fontWeight: '600',
  },
  error: {
    color: '#86231A',
    fontSize: 12.5,
    fontWeight: '600',
  },
  warning: {
    color: '#86231A',
    fontSize: 12.5,
    fontWeight: '600',
  },
  neutral: {
    color: '#6B645C',
    fontSize: 12.5,
    fontWeight: '600',
  },
  success: {
    color: '#1F7A73',
    fontSize: 12.5,
    fontWeight: '600',
  },
  demoApproved: {
    backgroundColor: '#DDEEEB',
    borderRadius: 10,
    gap: 4,
    padding: 14,
  },
  demoApprovedTitle: {
    color: '#1F7A73',
    fontSize: 14,
    fontWeight: '800',
  },
  demoApprovedText: {
    color: '#3D3D3D',
    fontSize: 12.5,
    lineHeight: 18,
  },
  secondaryButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF8F1',
    borderColor: 'rgba(166,58,47,0.22)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryButtonDisabled: {
    opacity: 0.55,
  },
  secondaryButtonText: {
    color: '#A63A2F',
    fontSize: 13,
    fontWeight: '700',
  },
  discountActions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skipButton: {
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  skipButtonText: {
    color: '#6B645C',
    fontSize: 13,
    fontWeight: '700',
  },
  loginButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F8F3EE',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  loginButtonText: {
    color: '#86231A',
    fontSize: 13,
    fontWeight: '700',
  },
  totalBar: { paddingHorizontal: 22, paddingTop: 12 },
  totalCard: {
    backgroundColor: '#1E1A17',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  totalLabel: {
    fontWeight: '600',
    fontSize: 9.5,
    letterSpacing: 2,
    color: '#9A938A',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  totalValue: { fontWeight: '700', fontSize: 30, color: '#3AAFA9', letterSpacing: 0 },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  payBtnDisabled: {
    opacity: 0.75,
  },
  payPressed: { opacity: 0.9 },
  payBtnText: { color: '#FDFAF7', fontWeight: '600', fontSize: 14, letterSpacing: 0.2 },
});
