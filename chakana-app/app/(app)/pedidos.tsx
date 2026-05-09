import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChakanaDial from '../../components/core/ChakanaDial';
import PageNav from '../../components/core/PageNav';
import PageHeader from '../../components/core/PageHeader';
import PedidoCard from '../../components/pedidos/PedidoCard';
import {
  PEDIDOS_MOCK,
  type PedidoEstado,
} from '../../data/pedidos';

type Filtro = 'todos' | PedidoEstado;

const FILTROS: { key: Filtro; label: string }[] = [
  { key: 'todos',      label: 'Todos'      },
  { key: 'nuevo',      label: 'Nuevos'     },
  { key: 'preparando', label: 'En curso'   },
  { key: 'listo',      label: 'Listos'     },
  { key: 'entregado',  label: 'Entregados' },
];

export default function Pedidos() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const pedidosFiltrados = filtro === 'todos'
    ? PEDIDOS_MOCK
    : PEDIDOS_MOCK.filter(p => p.estado === filtro);

  const activos    = PEDIDOS_MOCK.filter(p => p.estado !== 'entregado').length;
  const entregados = PEDIDOS_MOCK.filter(p => p.estado === 'entregado').length;
  const totalHoy   = PEDIDOS_MOCK.reduce((s, p) => s + p.total, 0).toFixed(2);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageNav
        label="· PEDIDOS ·"
        onBack={() => router.back()}
        background="#F8F3EE"
        paddingBottom={14}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 96 }]}
      >
        <View style={styles.header}>
          <PageHeader eyebrow="· TAMBU SAN SEBASTIÁN ·" title="Pedidos" accent="de hoy." />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{activos}</Text>
            <Text style={styles.statLabel}>ACTIVOS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entregados}</Text>
            <Text style={styles.statLabel}>ENTREGADOS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.statValueTeal]}>$ {totalHoy}</Text>
            <Text style={styles.statLabel}>TOTAL HOY</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtrosRow}
        >
          {FILTROS.map(f => {
            const count = f.key === 'todos'
              ? PEDIDOS_MOCK.length
              : PEDIDOS_MOCK.filter(p => p.estado === f.key).length;
            const active = filtro === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFiltro(f.key)}
                style={[styles.filtroChip, active && styles.filtroChipActive]}
              >
                <Text style={[styles.filtroText, active && styles.filtroTextActive]}>
                  {f.label}
                </Text>
                {count > 0 && (
                  <View style={[styles.filtroBadge, active && styles.filtroBadgeActive]}>
                    <Text style={[styles.filtroBadgeText, active && styles.filtroBadgeTextActive]}>
                      {count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.cardsList}>
          {pedidosFiltrados.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={32} color="#C4BEB8" />
              <Text style={styles.emptyText}>Sin pedidos en esta categoría.</Text>
            </View>
          ) : (
            pedidosFiltrados.map(p => <PedidoCard key={p.id} pedido={p} />)
          )}
        </View>
      </ScrollView>

      <ChakanaDial
        activeTab="pedidos"
        onCenterPress={() => router.replace('/dashboard')}
        onTabPress={(tab) => {
          if (tab === 'yo') router.push('/perfil');
        }}
      />
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
  statValue: { fontSize: 26, fontWeight: '700', color: '#F5F0EB', letterSpacing: -0.5 },
  statValueTeal: { color: '#3AAFA9' },
  statLabel: { fontSize: 9, fontWeight: '600', letterSpacing: 1.8, color: 'rgba(245,240,235,0.5)', textTransform: 'uppercase' },

  filtrosRow: { flexDirection: 'row', gap: 8, paddingBottom: 2 },
  filtroChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#EDE7DF',
  },
  filtroChipActive: { backgroundColor: '#A63A2F' },
  filtroText: { fontSize: 12, fontWeight: '600', color: '#6B645C' },
  filtroTextActive: { color: '#FDFAF7' },
  filtroBadge: {
    minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: 'rgba(107,100,92,0.18)',
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  filtroBadgeActive: { backgroundColor: 'rgba(253,250,247,0.25)' },
  filtroBadgeText: { fontSize: 10, fontWeight: '700', color: '#6B645C' },
  filtroBadgeTextActive: { color: '#FDFAF7' },

  cardsList: { gap: 10, paddingBottom: 8 },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 13, color: '#9A938A', fontStyle: 'italic' },
});
