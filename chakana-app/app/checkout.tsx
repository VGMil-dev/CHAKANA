import React, { useRef, useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable,
  Animated, PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CHECKOUT_CONFIG, AURIOS_BALANCE } from '../data/checkout';
import { cartStore, useCart } from '../store/cart';

const { maxDiscountPct: MAX_PCT, railRange: RAIL_RANGE, initialDiscountPct: INITIAL_PCT } = CHECKOUT_CONFIG;
const DISC_SIZE = 28;

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────

function CheckoutNav({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.nav}>
      <Pressable
        onPress={onBack}
        style={({ pressed }) => [styles.navBack, pressed && styles.pressed]}
      >
        <Ionicons name="arrow-back" size={20} color="#3D3D3D" />
      </Pressable>
      <Text style={styles.navLabel}>02 · CHECKOUT</Text>
      <View style={{ width: 44 }} />
    </View>
  );
}

function TambuHeader() {
  return (
    <View style={styles.tambuHeader}>
      <Text style={styles.eyebrow}>· TAMBU SAN SEBASTIÁN ·</Text>
      <Text style={styles.displayTitle}>
        Tu pedido{'\n'}<Text style={styles.displayAccent}>de hoy.</Text>
      </Text>
    </View>
  );
}

function LineItem({ title, detail, price }: { title: string; detail: string; price: string }) {
  return (
    <View style={styles.lineItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.lineTitle}>{title}</Text>
        <Text style={styles.lineDetail}>{detail}</Text>
      </View>
      <Text style={styles.linePrice}>$ {price}</Text>
    </View>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, accent && styles.summaryAccent]}>{label}</Text>
      <Text style={[styles.summaryValue, accent && styles.summaryAccent]}>{value}</Text>
    </View>
  );
}

function OrderCard({
  subtotal,
  aurios,
  discount,
}: {
  subtotal: number;
  aurios: number;
  discount: number;
}) {
  const items = cartStore.getItems();
  return (
    <View style={styles.card}>
      {items.map(item => (
        <LineItem
          key={item.id}
          title={item.title}
          detail={`${item.type}${item.qty > 1 ? ` · ×${item.qty}` : ''}`}
          price={(item.price * item.qty).toFixed(2)}
        />
      ))}
      <View style={styles.cardDivider} />
      <SummaryRow label="Subtotal"               value={`$ ${subtotal.toFixed(2)}`} />
      <SummaryRow
        label={`Aurios aplicados · −${aurios}`}
        value={`− $ ${discount.toFixed(2)}`}
        accent
      />
    </View>
  );
}

function AuriosSlider({
  initialPct = 18,
  subtotal,
  onPctChange,
}: {
  initialPct?: number;
  subtotal: number;
  onPctChange: (pct: number) => void;
}) {
  const [pct, setPct]     = useState(initialPct);
  const onChangeRef       = useRef(onPctChange);
  onChangeRef.current     = onPctChange;

  const railWidth         = useRef(0);
  const dragStartX        = useRef(0);
  const overshootAnim     = useRef(new Animated.Value(0)).current;
  const scaleAnim         = useRef(new Animated.Value(1)).current;

  const aurios = Math.round(subtotal * 100 * (pct / 100));

  const applyX = useRef((x: number) => {
    const w = railWidth.current;
    if (!w) return;
    // allow slight past-end drag for rubber-band feel (factor 1.22)
    const ratio     = Math.max(0, Math.min(1.22, x / w));
    const requested = ratio * RAIL_RANGE;
    if (requested > MAX_PCT) {
      setPct(MAX_PCT);
      onChangeRef.current(MAX_PCT);
      overshootAnim.setValue(Math.min(14, (requested - MAX_PCT) * 3.5));
    } else {
      const newPct = Math.max(0, requested);
      setPct(newPct);
      onChangeRef.current(newPct);
      overshootAnim.setValue(0);
    }
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,

      onPanResponderGrant: (evt) => {
        Animated.spring(scaleAnim, {
          toValue: 1.06, useNativeDriver: true, speed: 24, bounciness: 4,
        }).start();
        dragStartX.current = evt.nativeEvent.locationX;
        applyX.current(dragStartX.current);
      },

      onPanResponderMove: (_evt, gs) => {
        applyX.current(dragStartX.current + gs.dx);
      },

      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(overshootAnim, {
            toValue: 0, useNativeDriver: true,
            damping: 12, stiffness: 220, mass: 0.8,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1, useNativeDriver: true, speed: 24, bounciness: 4,
          }),
        ]).start();
      },

      onPanResponderTerminate: () => {
        overshootAnim.setValue(0);
        scaleAnim.setValue(1);
      },
    })
  ).current;

  const fillPct  = `${(pct / RAIL_RANGE) * 100}%` as `${number}%`;
  const discLeft = `${(pct / RAIL_RANGE) * 100}%` as `${number}%`;

  return (
    <View style={styles.sliderCard}>

      <View style={styles.sliderHeader}>
        <View>
          <Text style={styles.sliderEyebrow}>DESCUENTO CON AURIOS</Text>
          <Text style={styles.sliderPct}>{Math.round(pct)}%</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.sliderEyebrow}>AURIOS</Text>
          <View style={styles.sliderAuriosRow}>
            <Text style={styles.sliderAuriosValue}>−{aurios}</Text>
            <Text style={styles.sliderAuriosMax}> / {AURIOS_BALANCE}</Text>
          </View>
        </View>
      </View>

      <View
        style={styles.rail}
        onLayout={e => { railWidth.current = e.nativeEvent.layout.width; }}
        {...panResponder.panHandlers}
      >
        <View style={styles.track} />
        <LinearGradient
          colors={['#C5836F', '#A63A2F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: fillPct }]}
        />
        <View style={[styles.maxMarker, { left: `${(MAX_PCT / RAIL_RANGE) * 100}%` as any }]} />
        <Text style={[styles.maxLabel, { left: `${(MAX_PCT / RAIL_RANGE) * 100}%` as any }]}>
          MAX 25%
        </Text>
        <Animated.View
          style={[
            styles.disc,
            {
              left: discLeft,
              marginLeft: -(DISC_SIZE / 2),
              transform: [
                { translateX: overshootAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <View style={styles.discDot} />
        </Animated.View>
      </View>

      <Text style={styles.sliderHint}>
        {pct >= MAX_PCT
          ? <Text style={styles.sliderHintMax}>Llegaste al límite del ciclo. Más allá, lo guarda la tierra.</Text>
          : '1 Auro = 1¢. Arrastrá el disco para aplicar más. Tope del 25%.'}
      </Text>

    </View>
  );
}

function TotalBar({
  total,
  onPay,
  bottomInset,
}: {
  total: string;
  onPay: () => void;
  bottomInset: number;
}) {
  return (
    <View style={[styles.totalBar, { paddingBottom: Math.max(bottomInset, 16) + 8 }]}>
      <View style={styles.totalCard}>
        <View>
          <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
          <Text style={styles.totalValue}>$ {total}</Text>
        </View>
        <Pressable
          onPress={onPay}
          style={({ pressed }) => [pressed && { opacity: 0.9 }]}
        >
          <LinearGradient
            colors={['#86231A', '#A63A2F']}
            style={styles.payBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <Ionicons name="scan-outline" size={18} color="#FDFAF7" />
            <Text style={styles.payBtnText}>Pagar</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────

export default function Checkout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useCart();
  const subtotal = cartStore.getTotal();

  const [pct, setPct] = useState(INITIAL_PCT);

  const aurios   = Math.round(subtotal * 100 * (pct / 100));
  const discount = aurios / 100;
  const total    = (subtotal - discount).toFixed(2);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <CheckoutNav onBack={() => router.back()} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TambuHeader />
        <OrderCard subtotal={subtotal} aurios={aurios} discount={discount} />
        <AuriosSlider initialPct={INITIAL_PCT} subtotal={subtotal} onPctChange={setPct} />
      </ScrollView>

      <TotalBar
        total={total}
        onPay={() => router.replace('/pagare' as any)}
        bottomInset={insets.bottom}
      />

    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },

  // Nav
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
  pressed: {
    opacity: 0.75,
    transform: [{ translateY: 1 }],
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 14,
  },

  // Tambu header
  tambuHeader: {
    marginBottom: 4,
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
    letterSpacing: -0.8,
    marginTop: 10,
  },
  displayAccent: {
    color: '#A63A2F',
  },

  // Order summary card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 7,
    gap: 12,
  },
  lineTitle: {
    fontWeight: '500',
    fontSize: 13,
    color: '#2E2A26',
  },
  lineDetail: {
    fontSize: 11.5,
    color: '#9A938A',
    marginTop: 2,
  },
  linePrice: {
    fontWeight: '500',
    fontSize: 13,
    color: '#3D3D3D',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(140,133,123,0.15)',
    marginVertical: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 12.5,
    color: '#6B645C',
  },
  summaryValue: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#3D3D3D',
  },
  summaryAccent: {
    color: '#A63A2F',
    fontWeight: '600',
  },

  // Slider card
  sliderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 18,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sliderEyebrow: {
    fontWeight: '600',
    fontSize: 9.5,
    letterSpacing: 2,
    color: '#6B645C',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sliderPct: {
    fontWeight: '700',
    fontSize: 42,
    color: '#A63A2F',
    letterSpacing: -1,
    lineHeight: 46,
  },
  sliderAuriosRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  sliderAuriosValue: {
    fontWeight: '600',
    fontSize: 17,
    color: '#2E2A26',
    letterSpacing: -0.3,
  },
  sliderAuriosMax: {
    fontSize: 12,
    color: '#9A938A',
  },

  // Rail
  rail: {
    height: 48,
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 4,
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E6E2DD',
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 8,
    borderRadius: 999,
  },
  maxMarker: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: 2,
    backgroundColor: '#86231A',
    opacity: 0.5,
    borderRadius: 2,
  },
  maxLabel: {
    position: 'absolute',
    top: -4,
    fontWeight: '700',
    fontSize: 8,
    letterSpacing: 1.5,
    color: '#86231A',
    textTransform: 'uppercase',
    transform: [{ translateX: -14 }],
  },
  disc: {
    position: 'absolute',
    width: DISC_SIZE,
    height: DISC_SIZE,
    borderRadius: DISC_SIZE / 2,
    backgroundColor: '#FDFAF7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
    // Center vertically on track (track is centered, disc is 28px, track 8px)
    top: (48 - DISC_SIZE) / 2,
  },
  discDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A63A2F',
  },

  // Hint
  sliderHint: {
    marginTop: 12,
    fontSize: 11,
    color: '#6B645C',
    lineHeight: 16,
  },
  sliderHintMax: {
    color: '#86231A',
    fontWeight: '500',
  },

  // Total bar
  totalBar: {
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  totalCard: {
    backgroundColor: '#1E1A17',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontWeight: '600',
    fontSize: 9.5,
    letterSpacing: 2,
    color: '#9A938A',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  totalValue: {
    fontWeight: '700',
    fontSize: 30,
    color: '#3AAFA9',
    letterSpacing: -0.6,
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  payBtnText: {
    color: '#FDFAF7',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.2,
  },
});
