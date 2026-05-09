import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useCartStore, useCartItems, useCartCount, useCartTotal } from '../../store/cart';
import CartItemCard from '../../components/cart/CartItemCard';
import CartSummaryCard from '../../components/cart/CartSummaryCard';
import { AURIOS_BALANCE } from '../../data/checkout';
import PageNav from '../../components/core/PageNav';
import PageHeader from '../../components/core/PageHeader';

export default function Carrito() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { add, remove } = useCartStore();
  const items = useCartItems();
  const count = useCartCount();
  const total = useCartTotal();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageNav label="01 · CARRITO" onBack={() => router.back()} />

      <View style={styles.header}>
        <PageHeader eyebrow="· INVENTARIO CIRCULAR ·" title="Tu" accent="selección." />
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
          <CartSummaryCard count={count} total={total} auriosBalance={AURIOS_BALANCE} />
        )}
      </ScrollView>

      {items.length > 0 && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
          <Pressable
            onPress={() => router.push('/checkout' as any)}
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
  header: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 10 },
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
