import React from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { cartStore, useCart } from '../store/cart';

const AURIOS_BALANCE = 2772; // balance after the pagare demo flow

export default function Carrito() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useCart(); // re-render on every cart mutation
  const items  = cartStore.getItems();
  const count  = cartStore.getCount();
  const total  = cartStore.getTotal();
  const canPay = total <= AURIOS_BALANCE;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Nav */}
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

      {/* Header */}
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

        {/* Item cards */}
        {items.map(item => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
            <View style={styles.itemInfo}>
              <Text style={styles.itemType}>{item.type}</Text>
              <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.itemPrice}>{item.price * item.qty} Aurios</Text>
            </View>
            <View style={styles.qtyControl}>
              <Pressable
                onPress={() => cartStore.add({ id: item.id, title: item.title, type: item.type, price: item.price, image: item.image })}
                style={({ pressed }) => [styles.qtyBtn, pressed && styles.pressed]}
              >
                <Ionicons name="add" size={14} color="#3D3D3D" />
              </Pressable>
              <Text style={styles.qtyValue}>{item.qty}</Text>
              <Pressable
                onPress={() => cartStore.remove(item.id)}
                style={({ pressed }) => [styles.qtyBtn, pressed && styles.pressed]}
              >
                <Ionicons
                  name={item.qty === 1 ? 'trash-outline' : 'remove'}
                  size={14}
                  color="#A63A2F"
                />
              </Pressable>
            </View>
          </View>
        ))}

        {/* Empty state */}
        {items.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>El carrito espera.</Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.emptyLink}>Volver al inventario</Text>
            </Pressable>
          </View>
        )}

        {/* Summary */}
        {items.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{count} artículo{count !== 1 ? 's' : ''}</Text>
              <Text style={styles.summaryValue}>{total} Aurios</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.balanceRow}>
              <View style={styles.balanceDot} />
              <Text style={styles.balanceText}>
                Saldo disponible:{' '}
                <Text style={[styles.balanceAmount, !canPay && styles.balanceInsufficient]}>
                  {AURIOS_BALANCE} Aurios
                </Text>
              </Text>
            </View>
            {!canPay && (
              <Text style={styles.insufficientNote}>
                Aurios insuficientes. Retirá algún artículo.
              </Text>
            )}
          </View>
        )}

      </ScrollView>

      {/* CTA — pay with Aurios directly, no slider needed */}
      {items.length > 0 && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
          <Pressable
            onPress={() => {
              if (canPay) router.push('/checkout' as any);
            }}
            style={({ pressed }) => [pressed && { opacity: 0.9 }]}
            disabled={!canPay}
          >
            <LinearGradient
              colors={canPay ? ['#86231A', '#A63A2F'] : ['#C4BDB6', '#B0A89F']}
              style={styles.ctaBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.ctaLabel}>Pagar con Aurios</Text>
              <View style={styles.ctaDivider} />
              <Text style={styles.ctaTotal}>{total}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FDFAF7" style={{ marginLeft: 4 }} />
            </LinearGradient>
          </Pressable>
        </View>
      )}

    </View>
  );
}

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

  // Header
  header: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 10,
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
    fontSize: 34,
    lineHeight: 38,
    color: '#2E2A26',
    letterSpacing: -0.8,
    marginTop: 10,
  },
  displayAccent: {
    color: '#A63A2F',
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 10,
  },

  // Item card
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    gap: 14,
  },
  itemImage: {
    width: 62,
    height: 62,
    borderRadius: 8,
    backgroundColor: '#F0EAE4',
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemType: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A63A2F',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: 13,
    color: '#2E2A26',
    letterSpacing: -0.1,
    lineHeight: 17,
  },
  itemPrice: {
    fontWeight: '700',
    fontSize: 14,
    color: '#3AAFA9',
    marginTop: 4,
  },
  qtyControl: {
    alignItems: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8F3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontWeight: '700',
    fontSize: 15,
    color: '#3D3D3D',
    minWidth: 18,
    textAlign: 'center',
  },

  // Summary
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginTop: 4,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B645C',
    fontWeight: '500',
  },
  summaryValue: {
    fontWeight: '700',
    fontSize: 17,
    color: '#2E2A26',
    letterSpacing: -0.3,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(140,133,123,0.15)',
    marginVertical: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3AAFA9',
  },
  balanceText: {
    fontSize: 12,
    color: '#6B645C',
  },
  balanceAmount: {
    fontWeight: '600',
    color: '#3AAFA9',
  },
  balanceInsufficient: {
    color: '#A63A2F',
  },
  insufficientNote: {
    fontSize: 11,
    color: '#A63A2F',
    marginTop: 8,
    fontWeight: '500',
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 18,
  },
  emptyTitle: {
    fontWeight: '700',
    fontSize: 26,
    color: '#C4BDB6',
    letterSpacing: -0.5,
  },
  emptyLink: {
    fontSize: 14,
    color: '#A63A2F',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },

  // Bottom CTA
  bottomBar: {
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 4,
  },
  ctaLabel: {
    color: '#FDFAF7',
    fontWeight: '600',
    fontSize: 14.5,
    letterSpacing: 0.1,
  },
  ctaDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(253,250,247,0.28)',
    marginHorizontal: 10,
  },
  ctaTotal: {
    color: '#FDFAF7',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: -0.3,
  },
});
