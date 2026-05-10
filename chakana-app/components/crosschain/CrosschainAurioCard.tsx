import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  type: 'source' | 'destination';
  network: string;
  token: string;
  amount?: string;
  wallet?: string;
}

export default function CrosschainAurioCard({ type, network, token, amount, wallet }: Props) {
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
          <Text style={styles.label}>Token:</Text>
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
            <Text style={styles.label}>Wallet:</Text>
            <Text style={styles.value}>{wallet}</Text>
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
});
