import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  tambuName: string;
  onBellPress?: () => void;
}

export default function DashboardHeader({ tambuName, onBellPress }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/splash-icon.png')} style={styles.logo} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.eyebrow}>· PANEL DEL TAMBU ·</Text>
        <Text style={styles.tambuName}>{tambuName}</Text>
      </View>
      <TouchableOpacity style={styles.bellButton} onPress={onBellPress}>
        <Feather name="bell" size={18} color="#3D3D3D" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: '#E2C2B3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    tintColor: '#A63A2F',
  },
  textContainer: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 9.5,
    letterSpacing: 2,
    color: '#A63A2F',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  tambuName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#2E2A26',
    marginTop: 2,
  },
  bellButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
});
