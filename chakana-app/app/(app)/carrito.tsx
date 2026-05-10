import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore, useCartItems, useCartCount, useCartTotal } from '../../store/cart';
import CartItemCard from '../../components/cart/CartItemCard';
import CartSummaryCard from '../../components/cart/CartSummaryCard';
import PageNav from '../../components/core/PageNav';
import PageHeader from '../../components/core/PageHeader';
import { useWallet } from '../../src/hooks/useWallet';

export default function Carrito() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { add, remove } = useCartStore();
  const items = useCartItems();
  const count = useCartCount();
  const total = useCartTotal();
  const { aurioBalance } = useWallet();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageNav label="01 · CARRITO" onBack={() => router.replace('/home')} />

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
            onAdd={() => add({
              id: item.id,
              businessId: item.businessId,
              title: item.title,
              type: item.type,
              price: item.price,
              image: item.image,
            })}
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
          <CartSummaryCard count={count} total={total} auriosBalance={Math.floor(aurioBalance)} />
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB' },
  header: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 10 },
  scrollContent: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 120, gap: 10 },
  emptyState: { alignItems: 'center', paddingVertical: 64, gap: 18 },
  emptyTitle: { fontWeight: '700', fontSize: 26, color: '#C4BDB6', letterSpacing: -0.5 },
  emptyLink: { fontSize: 14, color: '#A63A2F', textDecorationLine: 'underline', fontWeight: '500' },
});
