import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = { error: string | null };

export default function ErrorAlert({ error }: Props) {
  if (!error) return null;
  return (
    <View style={styles.errorBox}>
      <Ionicons name="alert-circle-outline" size={16} color="#9E392D" />
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F7E7E3', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16,
  },
  errorText: { flex: 1, fontSize: 13, color: '#9E392D', fontWeight: '500' },
});
