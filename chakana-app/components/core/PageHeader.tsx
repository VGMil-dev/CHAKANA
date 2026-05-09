import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle?: string;
};

export default function PageHeader({ eyebrow, title, accent, subtitle }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.displayTitle}>
        {title}{'\n'}<Text style={styles.displayAccent}>{accent}</Text>
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: 0 },
  eyebrow: {
    fontWeight: '600', fontSize: 10, color: '#A63A2F',
    letterSpacing: 2.2, textTransform: 'uppercase',
  },
  displayTitle: {
    fontWeight: '700', fontSize: 32, lineHeight: 36,
    color: '#2E2A26', letterSpacing: -0.8, marginTop: 10,
  },
  displayAccent: { color: '#A63A2F' },
  subtitle: { fontSize: 14, color: '#6B645C', lineHeight: 20, marginTop: 6 },
});
