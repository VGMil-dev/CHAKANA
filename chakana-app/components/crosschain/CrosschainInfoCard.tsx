import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CrosschainInfoCard() {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Ionicons name="information-circle-outline" size={24} color="#9E392D" />
      </View>
      <View style={styles.textContent}>
        <Text style={styles.text}>
          LI.FI trae liquidez desde otras redes hacia Solana. Aurio transforma ese valor en utilidad local dentro de CHAKANA.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#F7E7E3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  iconBox: {
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  text: {
    fontSize: 13,
    color: '#9E392D',
    lineHeight: 18,
    fontWeight: '500',
  },
});
