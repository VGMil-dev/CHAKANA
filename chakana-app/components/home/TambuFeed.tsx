import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TambuCard from './TambuCard';

export interface TambuItem {
  id: string;
  name: string;
  barrio: string;
  cat: string;
  tone: string;
  rating: number;
  n: number;
  aurios: number;
}

export interface TambuFeedProps {
  tambus: TambuItem[];
  note?: string;
}

export default function TambuFeed({ tambus, note }: TambuFeedProps) {
  return (
    <View style={styles.container}>
      {tambus.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Sin tambús aquí.</Text>
          <Text style={styles.emptyHint}>Prueba con otra categoría.</Text>
        </View>
      )}
      {tambus.map((t, i) => <TambuCard key={t.id} {...t} featured={i === 0} />)}
      {note && (
        <View style={styles.noteWrap}>
          <Text style={styles.noteText}>{note}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingBottom: 180,
    gap: 28,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 12,
  },
  emptyTitle: {
    fontWeight: '700',
    fontSize: 22,
    color: '#C4BDB6',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 13,
    color: '#A63A2F',
    fontWeight: '500',
  },
  noteWrap: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  noteText: {
    fontSize: 16,
    color: '#3D3D3D',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '300',
    fontFamily: 'Graphik-Light',
    fontStyle: 'italic',
  },
});
