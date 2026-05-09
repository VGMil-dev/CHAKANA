import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = { label: string };

export default function AuthDivider({ label }: Props) {
  return (
    <View style={styles.divider}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 12,
  },
  line: { flex: 1, height: 1, backgroundColor: '#3D3D3D', opacity: 0.1 },
  label: { fontSize: 12, color: '#A09C96', fontWeight: '500' },
});
