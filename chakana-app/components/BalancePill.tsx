import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BalancePillProps {
  amount: number;
}

export default function BalancePill({ amount }: BalancePillProps) {
  return (
    <LinearGradient
      colors={['#F1E0CC', '#E8C99B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balancePill}
    >
      <LinearGradient
        colors={['#FBE6BA', '#C97A3A', '#8C4A1E']}
        start={{ x: 0.35, y: 0.3 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceIcon}
      />
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.balanceLabel}>AURIOS</Text>
        <Text style={styles.balanceAmount}>{amount.toLocaleString('es')}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 999,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  balanceIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  balanceLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: '#86231A',
    fontWeight: '600',
  },
  balanceAmount: {
    fontWeight: '700',
    fontSize: 14,
    color: '#5A1812',
    marginTop: 2,
  },
});
