import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export function RatingDots({ active }: { active: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <View key={i} style={{
          width: 7, height: 7, borderRadius: 999,
          backgroundColor: i <= active ? '#3AAFA9' : '#E6E2DD',
        }} />
      ))}
    </View>
  );
}

export function MiniBars({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 22 }}>
      {data.map((v, i) => (
        <View key={i} style={{
          flex: 1,
          height: `${(v / max) * 100}%`,
          borderRadius: 2,
          backgroundColor: i === data.length - 1 ? '#277B77' : 'rgba(58,175,169,0.45)',
        }} />
      ))}
    </View>
  );
}

export type MetricTone = 'red' | 'jade';

export interface MetricCardProps {
  eyebrow: string;
  value: string;
  unit: string;
  sub: string | React.ReactNode;
  tone: MetricTone;
  chart: React.ReactNode;
  flex?: number;
  marginRight?: number;
}

const ACCENT: Record<MetricTone, string> = { red: '#A63A2F', jade: '#277B77' };

export default function MetricCard({ eyebrow, value, unit, sub, tone, chart, flex = 1, marginRight = 0 }: MetricCardProps) {
  const accent = ACCENT[tone];
  return (
    <View style={[styles.card, { flex, marginRight }]}>
      <Text style={[styles.eyebrow, { color: accent }]}>{eyebrow}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
      {typeof sub === 'string' ? <Text style={styles.sub}>{sub}</Text> : sub}
      <View style={{ flex: 1 }} />
      <View style={{ marginTop: 8 }}>{chart}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 14,
    minHeight: 130,
  },
  eyebrow: {
    fontSize: 9.5,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  valueRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontWeight: '700',
    fontSize: 30,
    color: '#2E2A26',
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 11,
    color: '#9A938A',
  },
  sub: {
    marginTop: 6,
    fontSize: 10.5,
    color: '#6B645C',
  },
});
