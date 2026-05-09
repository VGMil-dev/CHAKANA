import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useCartTotal } from '../../store/cart';
import { CHECKOUT_CONFIG } from '../../data/checkout';

export default function Pagare() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const subtotal = useCartTotal();
  const [loading, setLoading] = useState(false);

  const discount = subtotal * (CHECKOUT_CONFIG.initialDiscountPct / 100);
  const total = (subtotal - discount).toFixed(2);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      router.replace('/resena' as any);
    }, 1800);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.nav}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.navBack, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-back" size={20} color="#3D3D3D" />
        </Pressable>
        <Text style={styles.navLabel}>03 · PAGO</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>· PAGO SEGURO ·</Text>
          <Text style={styles.displayTitle}>
            Confirma{'\n'}<Text style={styles.displayAccent}>tu pago.</Text>
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>TOTAL A COBRAR</Text>
          <Text style={styles.summaryAmount}>$ {total}</Text>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#3AAFA9" />
            <Text style={styles.summaryNote}>Pago cifrado · Stripe</Text>
          </View>
        </View>

        <View style={styles.stripeBox}>
          <View style={styles.stripeHeader}>
            <View style={styles.stripeLogo}>
              <Text style={styles.stripeLogoText}>stripe</Text>
            </View>
            <Text style={styles.stripeTag}>SANDBOX</Text>
          </View>

          <View style={styles.cardField}>
            <Text style={styles.cardFieldLabel}>NÚMERO DE TARJETA</Text>
            <View style={styles.cardFieldValue}>
              <Ionicons name="card-outline" size={16} color="#9A938A" />
              <Text style={styles.cardFieldMock}>4242  4242  4242  4242</Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <View style={[styles.cardField, { flex: 1 }]}>
              <Text style={styles.cardFieldLabel}>VENCE</Text>
              <View style={styles.cardFieldValue}>
                <Text style={styles.cardFieldMock}>12 / 28</Text>
              </View>
            </View>
            <View style={[styles.cardField, { flex: 1 }]}>
              <Text style={styles.cardFieldLabel}>CVC</Text>
              <View style={styles.cardFieldValue}>
                <Text style={styles.cardFieldMock}>• • •</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sandboxNote}>
            Entorno de prueba — no se realizará ningún cargo real
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <Pressable
          onPress={handlePay}
          disabled={loading}
          style={({ pressed }) => [pressed && { opacity: 0.9 }]}
        >
          <LinearGradient
            colors={loading ? ['#9A938A', '#6B645C'] : ['#86231A', '#A63A2F']}
            style={styles.payBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#FDFAF7" />
                <Text style={styles.payBtnText}>Procesando...</Text>
              </>
            ) : (
              <>
                <Ionicons name="lock-closed-outline" size={18} color="#FDFAF7" />
                <Text style={styles.payBtnText}>Pagar $ {total}</Text>
              </>
            )}
          </LinearGradient>
        </Pressable>
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
    backgroundColor: '#F0EAE3', alignItems: 'center', justifyContent: 'center',
  },
  navLabel: { fontWeight: '600', fontSize: 11, color: '#6B645C', letterSpacing: 2, textTransform: 'uppercase' },
  pressed: { opacity: 0.75, transform: [{ translateY: 1 }] },
  body: { flex: 1, paddingHorizontal: 22, paddingTop: 20, gap: 20 },
  header: { marginBottom: 4 },
  eyebrow: { fontWeight: '600', fontSize: 10, color: '#A63A2F', letterSpacing: 2.2, textTransform: 'uppercase' },
  displayTitle: { fontWeight: '700', fontSize: 32, lineHeight: 36, color: '#2E2A26', letterSpacing: -0.8, marginTop: 10 },
  displayAccent: { color: '#A63A2F' },
  summaryCard: {
    backgroundColor: '#1E1A17', borderRadius: 12,
    paddingVertical: 18, paddingHorizontal: 20,
  },
  summaryLabel: { fontWeight: '600', fontSize: 9.5, letterSpacing: 2, color: '#9A938A', textTransform: 'uppercase', marginBottom: 6 },
  summaryAmount: { fontWeight: '700', fontSize: 34, color: '#3AAFA9', letterSpacing: -0.8 },
  summaryDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 14 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryNote: { fontSize: 12, color: '#9A938A', fontWeight: '500' },
  stripeBox: {
    backgroundColor: '#FDFAF7', borderRadius: 12,
    padding: 18, gap: 14,
    borderWidth: 1, borderColor: 'rgba(140,133,123,0.15)',
  },
  stripeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stripeLogo: {
    backgroundColor: '#635BFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4,
  },
  stripeLogoText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14, letterSpacing: -0.3 },
  stripeTag: {
    fontSize: 9, fontWeight: '700', letterSpacing: 2, color: '#9A938A',
    backgroundColor: '#F0EAE3', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4,
  },
  cardRow: { flexDirection: 'row', gap: 12 },
  cardField: { gap: 6 },
  cardFieldLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.8, color: '#9A938A', textTransform: 'uppercase' },
  cardFieldValue: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F5F0EB', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 11,
  },
  cardFieldMock: { fontSize: 14, color: '#3D3D3D', fontWeight: '500', letterSpacing: 1 },
  sandboxNote: { fontSize: 11, color: '#9A938A', textAlign: 'center', fontStyle: 'italic' },
  footer: { paddingHorizontal: 22, paddingTop: 12 },
  payBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 17, borderRadius: 999,
  },
  payBtnText: { color: '#FDFAF7', fontWeight: '700', fontSize: 15, letterSpacing: 0.2 },
});
