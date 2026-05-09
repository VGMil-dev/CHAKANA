import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChakanaDial from '../../components/core/ChakanaDial';
import {
  PEDIDOS_MOCK, ESTADO_LABEL, ESTADO_COLOR,
  type Pedido, type PedidoEstado,
} from '../../data/pedidos';

type Filtro = 'todos' | PedidoEstado;

const FILTROS: { key: Filtro; label: string }[] = [
  { key: 'todos',      label: 'Todos'      },
  { key: 'nuevo',      label: 'Nuevos'     },
  { key: 'preparando', label: 'En curso'   },
  { key: 'listo',      label: 'Listos'     },
  { key: 'entregado',  label: 'Entregados' },
];

function initials(name: string) {
  return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function PedidoCard({ pedido }: { pedido: Pedido }) {
  const { indicator, pillBg, pillText } = ESTADO_COLOR[pedido.estado];
  const itemsText = pedido.items.map(i => `${i.qty}× ${i.nombre}`).join('  ·  ');

  return (
    <View style={styles.card}>
      <View style={[styles.cardIndicator, { backgroundColor: indicator }]} />

      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <View style={[styles.avatar, { backgroundColor: indicator + '22' }]}>
              <Text style={[styles.avatarText, { color: indicator }]}>{initials(pedido.cliente)}</Text>
            </View>
            <View>
              <Text style={styles.ordenNumero}>{pedido.numero}</Text>
              <Text style={styles.clienteNombre}>{pedido.cliente}</Text>
            </View>
          </View>
          <View style={[styles.estadoPill, { backgroundColor: pillBg }]}>
            <Text style={[styles.estadoText, { color: pillText }]}>{ESTADO_LABEL[pedido.estado]}</Text>
          </View>
        </View>

        <Text style={styles.itemsText} numberOfLines={1}>{itemsText}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.haceText}>{pedido.hace}</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalAmount}>$ {pedido.total.toFixed(2)}</Text>
            <Ionicons name="chevron-forward" size={14} color="#9A938A" />
          </View>
        </View>
      </View>
    </View>
  );
}

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
      <View style={styles.nav}>
        <TouchableOpacity
          style={styles.navBack}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#3D3D3D" />
        </TouchableOpacity>
        <Text style={styles.navLabel}>· PEDIDOS ·</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 96 }]}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>· TAMBU SAN SEBASTIÁN ·</Text>
          <Text style={styles.displayTitle}>
            Pedidos{'\n'}<Text style={styles.displayAccent}>de hoy.</Text>
          </Text>
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

  nav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14,
    backgroundColor: '#F8F3EE',
  },
  navBack: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F0EAE3', alignItems: 'center', justifyContent: 'center',
  },
  navLabel: {
    fontSize: 11, fontWeight: '600', letterSpacing: 1.98, color: '#6B645C', textTransform: 'uppercase',
  },

  scrollContent: { paddingHorizontal: 22, paddingTop: 24, gap: 20 },

  header: { gap: 8 },
  eyebrow: { fontWeight: '600', fontSize: 11, color: '#A63A2F', letterSpacing: 1.98, textTransform: 'uppercase' },
  displayTitle: { fontWeight: '700', fontSize: 32, lineHeight: 35, color: '#2E2A26', letterSpacing: -0.64 },
  displayAccent: { color: '#A63A2F' },

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

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardIndicator: { width: 4 },
  cardBody: { flex: 1, paddingVertical: 14, paddingHorizontal: 14, gap: 8 },

  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36, height: 36, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  ordenNumero: { fontSize: 9.5, fontWeight: '700', letterSpacing: 1.8, color: '#9A938A', textTransform: 'uppercase' },
  clienteNombre: { fontSize: 14, fontWeight: '600', color: '#2E2A26', marginTop: 1 },

  estadoPill: {
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999,
  },
  estadoText: { fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },

  itemsText: { fontSize: 12, color: '#6B645C', lineHeight: 17 },

  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  haceText: { fontSize: 11, color: '#C4BEB8', fontWeight: '500' },
  totalRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  totalAmount: { fontSize: 16, fontWeight: '700', color: '#3AAFA9', letterSpacing: -0.3 },

  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 13, color: '#9A938A', fontStyle: 'italic' },
});
