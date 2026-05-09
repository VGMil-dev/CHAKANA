import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface Props {
  dateRange: string;
  title: string;
  accentLine: string;
}

export default function WeekDisplayTitle({ dateRange, title, accentLine }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.dateRange}>{dateRange}</Text>
      <Text style={styles.title}>
        {title}{'\n'}
        <Text style={styles.accent}>{accentLine}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  dateRange: {
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 2,
    color: '#6B645C',
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 6,
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 30,
    color: '#2E2A26',
    letterSpacing: -0.5,
  },
  accent: {
    color: '#A63A2F',
  },
});
