import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  type: 'source' | 'destination';
  network: string;
  token: string;
  amount?: string;
  wallet?: string;
  walletBadge?: string;
}

export default function CrosschainAurioCard({
  type,
  network,
  token,
  amount,
  wallet,
  walletBadge,
}: Props) {
  const isSource = type === 'source';
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons 
          name={isSource ? 'arrow-up-circle-outline' : 'arrow-down-circle-outline'} 
          size={20} 
          color={isSource ? '#8A8580' : '#9E392D'} 
        />
        <Text style={styles.title}>{isSource ? 'Origen' : 'Destino'}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Red:</Text>
          <Text style={styles.value}>{network}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{isSource ? 'Token:' : 'Token destino:'}</Text>
          <Text style={styles.value}>{token}</Text>
        </View>
        {amount && (
          <View style={styles.row}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={styles.value}>{amount}</Text>
          </View>
        )}
        {wallet && (
          <View style={styles.row}>
            <Text style={styles.label}>Wallet destino:</Text>
            <View style={styles.walletValue}>
              {walletBadge ? (
                <View style={[styles.walletBadge, walletBadge === 'wallet conectada' && styles.connectedBadge]}>
                  <Text
                    style={[
                      styles.walletBadgeText,
                      walletBadge === 'wallet conectada' && styles.connectedBadgeText,
                    ]}
                  >
                    {walletBadge}
                  </Text>
                </View>
              ) : null}
              <Text style={styles.value}>{wallet}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FCF9F6',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3D3D3D',
    marginLeft: 8,
  },
  content: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#8A8580',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3D3D3D',
    flex: 1,
    textAlign: 'right',
  },
  walletValue: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 6,
  },
  walletBadge: {
    backgroundColor: '#E8E4DF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  connectedBadge: {
    backgroundColor: '#DDEEEB',
  },
  walletBadgeText: {
    color: '#6F6861',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  connectedBadgeText: {
    color: '#2F7D72',
  },
});
