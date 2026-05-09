import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import BalancePill from './BalancePill';

export interface HomeHeaderProps {
  initials: string;
  eyebrow: string;
  greeting: string;
  amount: number;
}

export default function HomeHeader({ initials, eyebrow, greeting, amount }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{greeting}</Text>
      </View>
      <BalancePill amount={amount} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8DFD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B645C',
  },
  textContainer: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    color: '#9A938A',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title: {
    fontWeight: '600',
    fontSize: 19,
    color: '#3D3D3D',
    letterSpacing: -0.1,
    marginTop: 2,
  },
});
