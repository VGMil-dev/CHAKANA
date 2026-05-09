import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useCartItems } from '../../store/cart';

interface Props {
  subtotal: number;
  aurios: number;
  discount: number;
}

function LineItem({ title, detail, price }: { title: string; detail: string; price: string }) {
  return (
    <View style={styles.lineItem}>
      <View style={styles.lineCopy}>
        <Text style={styles.lineTitle}>{title}</Text>
        <Text style={styles.lineDetail}>{detail}</Text>
      </View>
      <Text style={styles.linePrice}>$ {price}</Text>
    </View>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, accent && styles.summaryAccent]}>{label}</Text>
      <Text style={[styles.summaryValue, accent && styles.summaryAccent]}>{value}</Text>
    </View>
  );
}

export default function OrderCard({ subtotal, aurios, discount }: Props) {
  const items = useCartItems();

  return (
    <View style={styles.card}>
      {items.map((item) => (
        <LineItem
          key={item.id}
          title={item.title}
          detail={`${item.type}${item.qty > 1 ? ` · x${item.qty}` : ''}`}
          price={(item.price * item.qty).toFixed(2)}
        />
      ))}
      <View style={styles.divider} />
      <SummaryRow label="Subtotal" value={`$ ${subtotal.toFixed(2)}`} />
      <SummaryRow label={`Aurios aplicados · -${aurios}`} value={`- $ ${discount.toFixed(2)}`} accent />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 7,
    gap: 12,
  },
  lineCopy: {
    flex: 1,
  },
  lineTitle: {
    fontWeight: '500',
    fontSize: 13,
    color: '#2E2A26',
  },
  lineDetail: {
    fontSize: 11.5,
    color: '#9A938A',
    marginTop: 2,
  },
  linePrice: {
    fontWeight: '500',
    fontSize: 13,
    color: '#3D3D3D',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(140,133,123,0.15)',
    marginVertical: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 12.5,
    color: '#6B645C',
  },
  summaryValue: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#3D3D3D',
  },
  summaryAccent: {
    color: '#A63A2F',
    fontWeight: '600',
  },
});
