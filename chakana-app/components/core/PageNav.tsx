import React, { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
  background?: string;
  paddingBottom?: number;
};

export default function PageNav({ label, onBack, rightSlot, background, paddingBottom = 4 }: Props) {
  return (
    <View style={[styles.nav, background ? { backgroundColor: background } : null, { paddingBottom }]}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [styles.navBack, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-back" size={20} color="#3D3D3D" />
        </Pressable>
      ) : (
        <View style={{ width: 44 }} />
      )}
      <Text style={styles.navLabel}>{label}</Text>
      {rightSlot !== undefined ? rightSlot : <View style={{ width: 44 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 6,
  },
  navBack: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F0EAE3', alignItems: 'center', justifyContent: 'center',
  },
  navLabel: {
    fontWeight: '600', fontSize: 11, color: '#6B645C',
    letterSpacing: 2, textTransform: 'uppercase',
  },
  pressed: { opacity: 0.75, transform: [{ translateY: 1 }] },
});
