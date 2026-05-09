import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { CHECKOUT_CONFIG } from '../../data/checkout';
import { useCartTotal } from '../../store/cart';
import AuriosSlider from '../../components/checkout/AuriosSlider';
import OrderCard from '../../components/checkout/OrderCard';

const { initialDiscountPct: INITIAL_PCT } = CHECKOUT_CONFIG;

export default function Checkout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const subtotal = useCartTotal();
  const [pct, setPct] = useState(INITIAL_PCT);

  const aurios   = Math.round(subtotal * 100 * (pct / 100));
  const discount = aurios / 100;
  const total    = (subtotal - discount).toFixed(2);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <View style={styles.nav}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.navBack, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-back" size={20} color="#3D3D3D" />
        </Pressable>
        <Text style={styles.navLabel}>02 · CHECKOUT</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>· TAMBU SAN SEBASTIÁN ·</Text>
          <Text style={styles.displayTitle}>
            Tu pedido{'\n'}<Text style={styles.displayAccent}>de hoy.</Text>
          </Text>
        </View>

        <OrderCard subtotal={subtotal} aurios={aurios} discount={discount} />
        <AuriosSlider initialPct={INITIAL_PCT} subtotal={subtotal} onPctChange={setPct} />
      </ScrollView>

      <View style={[styles.totalBar, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <View style={styles.totalCard}>
          <View>
            <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
            <Text style={styles.totalValue}>$ {total}</Text>
          </View>
          <Pressable
            onPress={() => router.replace('/dev-test')}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB' },
  nav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingTop: 6, paddingBottom: 4,
  },
  navBack: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F8F3EE', alignItems: 'center', justifyContent: 'center',
  },
  navLabel: { fontWeight: '600', fontSize: 11, color: '#6B645C', letterSpacing: 2, textTransform: 'uppercase' },
  pressed: { opacity: 0.75, transform: [{ translateY: 1 }] },
  scrollContent: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 24, gap: 14 },
  header: { marginBottom: 4 },
  eyebrow: { fontWeight: '600', fontSize: 10, color: '#A63A2F', letterSpacing: 2.2, textTransform: 'uppercase' },
  displayTitle: { fontWeight: '700', fontSize: 32, lineHeight: 36, color: '#2E2A26', letterSpacing: -0.8, marginTop: 10 },
  displayAccent: { color: '#A63A2F' },
  totalBar: { paddingHorizontal: 22, paddingTop: 12 },
  totalCard: {
    backgroundColor: '#1E1A17', borderRadius: 10,
    paddingVertical: 14, paddingHorizontal: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  totalLabel: { fontWeight: '600', fontSize: 9.5, letterSpacing: 2, color: '#9A938A', textTransform: 'uppercase', marginBottom: 4 },
  totalValue: { fontWeight: '700', fontSize: 30, color: '#3AAFA9', letterSpacing: -0.6 },
  payBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 14, paddingHorizontal: 20, borderRadius: 999,
  },
  payBtnText: { color: '#FDFAF7', fontWeight: '600', fontSize: 14, letterSpacing: 0.2 },
});
