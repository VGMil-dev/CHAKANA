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
import PageNav from '../../components/core/PageNav';
import PageHeader from '../../components/core/PageHeader';

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

      <PageNav label="02 · CHECKOUT" onBack={() => router.back()} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <PageHeader eyebrow="· TAMBU SAN SEBASTIÁN ·" title="Tu pedido" accent="de hoy." />
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
            onPress={() => router.replace('/pagare' as any)}
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
  scrollContent: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 24, gap: 14 },
  header: { marginBottom: 4 },
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
