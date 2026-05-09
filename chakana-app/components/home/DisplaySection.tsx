import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export interface DisplaySectionProps {
  eyebrow: string;
  title: string;
  accentLine: string;
}

export default function DisplaySection({ eyebrow, title, accentLine }: DisplaySectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>
        {title}{'\n'}
        <Text style={styles.accent}>{accentLine}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 24,
  },
  eyebrow: {
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 2.2,
    color: '#A63A2F',
    textTransform: 'uppercase',
  },
  title: {
    fontWeight: '700',
    fontSize: 34,
    lineHeight: 38,
    color: '#3D3D3D',
    letterSpacing: -0.8,
    marginTop: 12,
  },
  accent: {
    color: '#A63A2F',
  },
});
