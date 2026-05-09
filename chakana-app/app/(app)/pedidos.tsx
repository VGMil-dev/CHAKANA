import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PageNav from '../../components/core/PageNav';
import PageHeader from '../../components/core/PageHeader';
import { getMyOrders, type Order } from '../../src/services/supabase';

export default function Pedidos() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getMyOrders()
      .then((nextOrders) => {
        setOrders(nextOrders);
        setError(null);
      })
      .catch((nextError: unknown) => {
        setError(nextError instanceof Error ? nextError.message : 'No se pudieron cargar pedidos.');
      });
  }, []);

  const total = orders.reduce((sum, order) => sum + order.final_total_cents, 0) / 100;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageNav label="· PEDIDOS ·" onBack={() => router.back()} background="#F8F3EE" paddingBottom={14} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 96 }]}
      >
        <View style={styles.header}>
          <PageHeader eyebrow="· CHAKANA ·" title="Pedidos" accent="reales." />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>PEDIDOS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.statValueTeal]}>$ {total.toFixed(2)}</Text>
            <Text style={styles.statLabel}>TOTAL</Text>
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.cardsList}>
          {orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={32} color="#C4BEB8" />
              <Text style={styles.emptyText}>Sin pedidos todavía.</Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <Text style={styles.orderTitle}>Pedido {order.id.slice(0, 8)}</Text>
                <Text style={styles.orderMeta}>{order.status}</Text>
                <Text style={styles.orderTotal}>$ {(order.final_total_cents / 100).toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB' },
  scrollContent: { paddingHorizontal: 22, paddingTop: 24, gap: 20 },
  header: { gap: 8 },
  statsRow: {
    backgroundColor: '#1E1A17',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.08)' },
  statValue: { fontSize: 26, fontWeight: '700', color: '#F5F0EB', letterSpacing: 0 },
  statValueTeal: { color: '#3AAFA9' },
  statLabel: { fontSize: 9, fontWeight: '600', letterSpacing: 1.8, color: 'rgba(245,240,235,0.5)', textTransform: 'uppercase' },
  cardsList: { gap: 10, paddingBottom: 8 },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 13, color: '#9A938A', fontStyle: 'italic' },
  error: { color: '#9E392D', fontSize: 13, fontWeight: '600' },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    gap: 4,
  },
  orderTitle: { color: '#2E2A26', fontWeight: '700', fontSize: 14 },
  orderMeta: { color: '#6B645C', fontSize: 12, textTransform: 'uppercase' },
  orderTotal: { color: '#3AAFA9', fontWeight: '800', fontSize: 17 },
});
