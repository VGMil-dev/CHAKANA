import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

type Tone = 'jade' | 'amber' | 'red';

interface Props {
  eyebrow: string;
  body: string;
  tone: Tone;
}

const ACCENT: Record<Tone, string> = { jade: '#3AAFA9', amber: '#C97A3A', red: '#A63A2F' };

export default function InsightCard({ eyebrow, body, tone }: Props) {
  const color = ACCENT[tone];
  return (
    <View style={styles.card}>
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.eyebrow, { color }]}>{eyebrow}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  indicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginTop: 2,
  },
  eyebrow: {
    fontSize: 9.5,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  body: {
    fontSize: 12.5,
    color: '#3D3D3D',
    marginTop: 4,
    lineHeight: 18,
  },
});
