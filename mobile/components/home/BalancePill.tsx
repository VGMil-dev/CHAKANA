import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

interface BalancePillProps {
  amount: number;
  isConnected: boolean;
}

export default function BalancePill({ amount, isConnected }: BalancePillProps) {
  const balanceLabel = isConnected ? `${Math.floor(amount).toLocaleString('es')} AUR` : 'Conectar';

  return (
    <LinearGradient
      colors={['#FFF8EE', '#F2E2C6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balancePill}
      testID="aurio-balance"
    >
      <View style={styles.iconContainer}>
        <Image 
          source={require('../../assets/images/splash-icon.png')} 
          style={styles.logoIcon}
          contentFit="contain"
        />
      </View>
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.balanceLabel}>AURIOS</Text>
        <Text style={styles.balanceAmount}>{balanceLabel}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 16,
    borderRadius: 999,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoIcon: {
    width: 20,
    height: 20,
  },
  balanceLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: '#9E392D', // Using the terracotta from the logo
    fontWeight: '700',
  },
  balanceAmount: {
    fontWeight: '800',
    fontSize: 15,
    color: '#4A1D18',
    marginTop: 0,
    letterSpacing: -0.5,
  },
});
