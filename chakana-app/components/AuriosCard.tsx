import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  amount: number;
}

export default function AuriosCard({ amount }: Props) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.eyebrow}>AURIOS DEVUELTOS</Text>
        <Text style={styles.value}>
          {amount.toLocaleString()} <Text style={styles.sub}>al barrio</Text>
        </Text>
      </View>
      <View style={styles.badge}>
        <Feather name="trending-up" size={12} color="#277B77" />
        <Text style={styles.badgeText}>ciclo activo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 9.5,
    letterSpacing: 2,
    color: '#6B645C',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  value: {
    fontWeight: '700',
    fontSize: 22,
    color: '#2E2A26',
    marginTop: 4,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 11,
    color: '#9A938A',
    fontWeight: '500',
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#D5EEEC',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    color: '#277B77',
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
