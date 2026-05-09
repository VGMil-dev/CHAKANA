import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import AuriosSlider from '../../components/checkout/AuriosSlider';
import OrderCard from '../../components/checkout/OrderCard';
import { useCartTotal } from '../../store/cart';
import { useCheckout } from '../../../src/hooks/useCheckout';
import { useWallet } from '../../../src/hooks/useWallet';
import { useWalletSigner } from '../../../src/hooks/useWalletSigner';
import { formatUSD } from '../../../src/utils/sliderConfig';

const qaTambuMint = process.env.EXPO_PUBLIC_QA_TAMBU_MINT;
// TODO: reemplazar EXPO_PUBLIC_QA_TAMBU_MINT por tambuMint real del negocio seleccionado cuando Businesses este conectado.
const tambuMint =
  typeof qaTambuMint === 'string' && qaTambuMint.length > 0 ? qaTambuMint : null;

function shortenMint(mint: string): string {
  return `${mint.slice(0, 4)}...${mint.slice(-4)}`;
}

export default function Checkout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const visualSubtotal = useCartTotal();
  const { aurioBalance, walletPubKey } = useWallet();
  const { signTransaction } = useWalletSigner();
  const {
    checkoutTotal,
    auriosToSpend,
    discountResult,
    sliderMax,
    checkoutError,
    checkoutSignature,
    isProcessing,
    setTotal,
    onSliderChange,
    confirmCheckout,
  } = useCheckout();

  const subtotal = visualSubtotal > 0 ? visualSubtotal : checkoutTotal;
  const isMissingTambuMint = !tambuMint;
  const isPayDisabled =
    !walletPubKey || auriosToSpend <= 0 || !signTransaction || isMissingTambuMint || isProcessing;

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

  const handlePay = (): void => {
    if (!tambuMint || !signTransaction || isPayDisabled) return;

    void confirmCheckout({
      tambuMint,
      signTransaction,
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
        </View>

        <OrderCard
          subtotal={subtotal}
          aurios={auriosToSpend}
          discount={discountResult.discountUSD}
        />
        <AuriosSlider
          checkoutTotal={subtotal}
          auriosToSpend={auriosToSpend}
          aurioBalance={aurioBalance}
          sliderMax={sliderMax}
          isWalletConnected={Boolean(walletPubKey)}
          onAuriosChange={handleAuriosChange}
          onClear={handleClearDiscount}
        />

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Balance Aurios</Text>
          <Text style={styles.statusValue}>{Math.floor(aurioBalance)} Aurios</Text>
          <Text style={styles.statusLine}>Aurios a usar: {auriosToSpend}</Text>
          <Text style={styles.statusLine}>Descuento: {formatUSD(discountResult.discountUSD)}</Text>
          <Text style={styles.statusLine}>Maximo permitido: {sliderMax} Aurios</Text>
          {checkoutError ? <Text style={styles.error}>{checkoutError}</Text> : null}
          {checkoutSignature ? (
            <Text style={styles.success}>Firma: {checkoutSignature}</Text>
          ) : null}
        </View>

        {isMissingTambuMint ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              Falta el tambuMint real de raiz-cafe para probar transferencia.
            </Text>
            <Text style={styles.noticeText}>
              El AURIO_MINT identifica el token, pero no es el destino del pago.
            </Text>
          </View>
        ) : (
          <View style={styles.notice}>
            <Text style={styles.noticeConnectedText}>
              Tambu conectado para prueba devnet.
            </Text>
            <Text style={styles.noticeMuted}>{shortenMint(tambuMint)}</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.totalBar, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <View style={styles.totalCard}>
          <View>
            <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
            <Text style={styles.totalValue}>{formatUSD(discountResult.finalTotal)}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            testID="checkout-pay-button"
            onPress={handlePay}
            disabled={isPayDisabled}
            style={({ pressed }) => [pressed && !isPayDisabled ? styles.payPressed : null]}>
            <LinearGradient
              colors={isPayDisabled ? ['#6B645C', '#7B746C'] : ['#86231A', '#A63A2F']}
              style={[styles.payBtn, isPayDisabled ? styles.payBtnDisabled : null]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}>
              <Ionicons name="scan-outline" size={18} color="#FDFAF7" />
              <Text style={styles.payBtnText}>
                {isProcessing ? 'Procesando...' : 'Pagar con Aurios'}
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
  success: {
    color: '#1F7A73',
    fontSize: 12.5,
    fontWeight: '600',
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
