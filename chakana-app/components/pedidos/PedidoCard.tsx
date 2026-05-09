import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  ESTADO_LABEL, ESTADO_COLOR,
  type Pedido,
} from '../../data/pedidos';

function initials(name: string) {
  return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function PedidoCard({ pedido }: { pedido: Pedido }) {
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

const styles = StyleSheet.create({
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
  ordenNumero: {
    fontSize: 9.5, fontWeight: '700', letterSpacing: 1.8,
    color: '#9A938A', textTransform: 'uppercase',
  },
  clienteNombre: { fontSize: 14, fontWeight: '600', color: '#2E2A26', marginTop: 1 },
  estadoPill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  estadoText: { fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  itemsText: { fontSize: 12, color: '#6B645C', lineHeight: 17 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  haceText: { fontSize: 11, color: '#C4BEB8', fontWeight: '500' },
  totalRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  totalAmount: { fontSize: 16, fontWeight: '700', color: '#3AAFA9', letterSpacing: -0.3 },
});
