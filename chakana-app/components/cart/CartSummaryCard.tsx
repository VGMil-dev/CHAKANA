import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export interface CartSummaryCardProps {
  count: number;
  total: number;
  auriosBalance: number;
}

export default function CartSummaryCard({ count, total, auriosBalance }: CartSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>{count} artículo{count !== 1 ? 's' : ''}</Text>
        <Text style={styles.value}>$ {total.toFixed(2)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.balanceRow}>
        <View style={styles.dot} />
        <Text style={styles.balanceText}>
          Tenés{' '}
          <Text style={styles.balanceAmount}>{auriosBalance} Aurios</Text>
          {' '}disponibles para descuento
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#6B645C',
    fontWeight: '500',
  },
  value: {
    fontWeight: '700',
    fontSize: 17,
    color: '#2E2A26',
    letterSpacing: -0.3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(140,133,123,0.15)',
    marginVertical: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
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
});
