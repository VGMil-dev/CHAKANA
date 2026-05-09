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
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import AuriosSlider from '../../components/checkout/AuriosSlider';
import OrderCard from '../../components/checkout/OrderCard';
import ReviewForm from '../../components/reviews/ReviewForm';
import { useCartItems, useCartTotal } from '../../store/cart';
import { useAuth } from '../../../src/hooks/useAuth';
import { type CheckoutDestination, useCheckout } from '../../../src/hooks/useCheckout';
import { useHybridCheckout } from '../../../src/hooks/useHybridCheckout';
import { useWallet } from '../../../src/hooks/useWallet';
import { useWalletSigner } from '../../../src/hooks/useWalletSigner';
import { formatUSD } from '../../../src/utils/sliderConfig';

const qaTambuMint = process.env.EXPO_PUBLIC_QA_TAMBU_MINT;
const qaPayoutWallet = process.env.EXPO_PUBLIC_QA_PAYOUT_WALLET;
const qaBusinessId = process.env.EXPO_PUBLIC_QA_BUSINESS_ID ?? 'raiz-cafe';
// TODO: reemplazar env QA por destino real del negocio seleccionado cuando Businesses este conectado.
const destination: CheckoutDestination | null =
  typeof qaTambuMint === 'string' && qaTambuMint.length > 0
    ? {
        mode: 'tambu',
        tambuMint: qaTambuMint,
      }
    : typeof qaPayoutWallet === 'string' && qaPayoutWallet.length > 0
      ? {
          mode: 'wallet',
          payoutWallet: qaPayoutWallet,
        }
      : null;

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
  } = useCheckout();
  const { isHybridProcessing, hybridError, confirmHybridCheckout } = useHybridCheckout();

  const subtotal = visualSubtotal > 0 ? visualSubtotal : checkoutTotal;
  const cartPayload = cartItems.map((item) => ({ productId: item.id, quantity: item.qty }));
  const hasCart = cartPayload.length > 0 && subtotal > 0;
  const hasAurioDiscount = auriosToSpend > 0;
  const hasAppliedAurioDiscount = redeemedAurios > 0 && Boolean(checkoutSignature);
  const displayedAurios = hasAppliedAurioDiscount ? redeemedAurios : auriosToSpend;
  const isAurioDisabled =
    !walletPubKey ||
    !hasAurioDiscount ||
    !signTransaction ||
    !destination ||
    isProcessing ||
    hasAppliedAurioDiscount;
  const isCardDisabled =
    !qaBusinessId ||
    !hasCart ||
    !isSupabaseConnected ||
    isProcessing ||
    isHybridProcessing ||
    (hasAurioDiscount && !hasAppliedAurioDiscount);

  useEffect(() => {
    if (subtotal !== checkoutTotal) {
      setTotal(subtotal);
    }
  }, [checkoutTotal, setTotal, subtotal]);

  const handleAuriosChange = (value: number): void => {
    onSliderChange(Math.min(value, sliderMax));
  };

  const handleClearDiscount = (): void => {
    onSliderChange(0);
  };

  const handleApplyAurioDiscount = (): void => {
    if (!destination || !signTransaction || isAurioDisabled) return;

    void confirmCheckout({
      destination,
      signTransaction,
    });
  };

  const handleCardPayment = (): void => {
    if (isCardDisabled) return;

    void confirmHybridCheckout({
      destination,
      signTransaction,
      businessId: qaBusinessId,
      cartItems: cartPayload,
    }).then((result) => {
      if (result?.stripeSessionId) {
        setStripeSessionId(result.stripeSessionId);
      }
      if (result?.stripeCheckoutUrl) {
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
          <Text style={styles.eyebrow}>· TAMBU SAN SEBASTIAN ·</Text>
          <Text style={styles.displayTitle}>
            Tu pedido{'\n'}<Text style={styles.displayAccent}>de hoy.</Text>
          </Text>
          <Text style={styles.headerCopy}>
            Aurio reduce el precio como cupon opcional. Stripe cobra el total final con tarjeta.
          </Text>
        </View>

        <OrderCard
          subtotal={subtotal}
          aurios={displayedAurios}
          discount={discountResult.discountUSD}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descuento Aurio</Text>
          <Text style={styles.sectionCopy}>
            Puedes elegir 0 Aurios y pagar todo con tarjeta, o redimir Aurios antes del cobro.
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
            <Text style={styles.statusValue}>{Math.floor(aurioBalance)} Aurios</Text>
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
                Falta tambuMint o payout wallet para probar redencion.
              </Text>
            </View>
          ) : destination.mode === 'tambu' ? (
            <View style={styles.notice}>
              <Text style={styles.noticeConnectedText}>
                Tambu conectado para prueba devnet.
              </Text>
              <Text style={styles.noticeMuted}>{shortenAddress(destination.tambuMint)}</Text>
            </View>
          ) : (
            <View style={styles.notice}>
              <Text style={styles.noticeConnectedText}>
                Modo QA: redencion directa de Aurios.
              </Text>
              <Text style={styles.noticeMuted}>{shortenAddress(destination.payoutWallet)}</Text>
            </View>
          )}

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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pago con tarjeta</Text>
          <Text style={styles.sectionCopy}>
            Stripe cobra el total a pagar con tarjeta despues de aplicar el descuento Aurio.
          </Text>
          {!isSupabaseConnected ? (
            <>
              <Text style={styles.warning}>Inicia sesión para pagar con tarjeta.</Text>
              <Pressable
                accessibilityRole="button"
                testID="checkout-login-button"
                style={styles.loginButton}
                onPress={() => router.push('/login')}>
                <Text style={styles.loginButtonText}>Ir a iniciar sesión</Text>
              </Pressable>
            </>
          ) : null}
          {hasAurioDiscount && !hasAppliedAurioDiscount ? (
            <Text style={styles.warning}>Primero aplica el descuento Aurio.</Text>
          ) : null}
          {!hasCart ? (
            <Text style={styles.warning}>Agrega productos al carrito para crear el pago.</Text>
          ) : null}
        </View>

        {stripeSessionId ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuéntanos tu experiencia</Text>
            <Text style={styles.sectionCopy}>
              Publica un comentario de al menos 50 palabras y gana 1 Aurio.
            </Text>
            {/* TODO: mostrar esta sección solo después de confirmación real de Stripe webhook / success page. */}
            <ReviewForm businessId={qaBusinessId} />
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.totalBar, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <View style={styles.totalCard}>
          <View>
            <Text style={styles.totalLabel}>Total a pagar con tarjeta</Text>
            <Text style={styles.totalValue}>{formatUSD(discountResult.finalTotal)}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            testID="checkout-pay-button"
            onPress={handleCardPayment}
            disabled={isCardDisabled}
            style={({ pressed }) => [pressed && !isCardDisabled ? styles.payPressed : null]}>
            <LinearGradient
              colors={isCardDisabled ? ['#6B645C', '#7B746C'] : ['#86231A', '#A63A2F']}
              style={[styles.payBtn, isCardDisabled ? styles.payBtnDisabled : null]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}>
              <Ionicons name="card-outline" size={18} color="#FDFAF7" />
              <Text style={styles.payBtnText}>
                {isHybridProcessing ? 'Creando pago...' : 'Pagar con tarjeta'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
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
