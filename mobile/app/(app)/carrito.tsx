import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useCartStore, useCartItems, useCartCount, useCartTotal } from '../../store/cart';
import CartItemCard from '../../components/cart/CartItemCard';
import CartSummaryCard from '../../components/cart/CartSummaryCard';
import { useAurioBalance } from '../../../src/store/selectors';

export default function Carrito() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { add, remove } = useCartStore();
  const items = useCartItems();
  const count = useCartCount();
  const total = useCartTotal();
  const aurioBalance = useAurioBalance();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.nav}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.navBack, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-back" size={20} color="#3D3D3D" />
        </Pressable>
        <Text style={styles.navLabel}>01 · CARRITO</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>· INVENTARIO CIRCULAR ·</Text>
        <Text style={styles.displayTitle}>
          Tu{'\n'}<Text style={styles.displayAccent}>selección.</Text>
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map(item => (
          <CartItemCard
            key={item.id}
            item={item}
            onAdd={() => add({ id: item.id, title: item.title, type: item.type, price: item.price, image: item.image })}
            onRemove={() => remove(item.id)}
          />
        ))}

        {items.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>El carrito espera.</Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.emptyLink}>Volver al inventario</Text>
            </Pressable>
          </View>
        )}

        {items.length > 0 && (
          <CartSummaryCard count={count} total={total} auriosBalance={aurioBalance} />
        )}
      </ScrollView>

      {items.length > 0 && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
          <Pressable
            onPress={() => router.push('/checkout')}
            style={({ pressed }) => [pressed && { opacity: 0.9 }]}
          >
            <LinearGradient
              colors={['#86231A', '#A63A2F']}
              style={styles.ctaBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.ctaLabel}>Ir al checkout</Text>
              <View style={styles.ctaDivider} />
              <Text style={styles.ctaTotal}>$ {total.toFixed(2)}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FDFAF7" style={{ marginLeft: 4 }} />
            </LinearGradient>
          </Pressable>
        </View>
      )}
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
  header: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 10 },
  eyebrow: { fontWeight: '600', fontSize: 10, color: '#A63A2F', letterSpacing: 2.2, textTransform: 'uppercase' },
  displayTitle: { fontWeight: '700', fontSize: 34, lineHeight: 38, color: '#2E2A26', letterSpacing: -0.8, marginTop: 10 },
  displayAccent: { color: '#A63A2F' },
  scrollContent: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 24, gap: 10 },
  emptyState: { alignItems: 'center', paddingVertical: 64, gap: 18 },
  emptyTitle: { fontWeight: '700', fontSize: 26, color: '#C4BDB6', letterSpacing: -0.5 },
  emptyLink: { fontSize: 14, color: '#A63A2F', textDecorationLine: 'underline', fontWeight: '500' },
  bottomBar: { paddingHorizontal: 22, paddingTop: 12 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 17, paddingHorizontal: 24, borderRadius: 10, gap: 4,
  },
  ctaLabel: { color: '#FDFAF7', fontWeight: '600', fontSize: 14.5, letterSpacing: 0.1 },
  ctaDivider: { width: 1, height: 18, backgroundColor: 'rgba(253,250,247,0.28)', marginHorizontal: 10 },
  ctaTotal: { color: '#FDFAF7', fontWeight: '700', fontSize: 17, letterSpacing: -0.3 },
});
