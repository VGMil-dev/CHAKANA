import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export default function Chip({ label, active, onClick, icon }: ChipProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onClick}
      style={[
        styles.chip,
        active ? styles.chipActive : styles.chipInactive,
        !active && styles.chipShadow
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[
        styles.chipText,
        active ? styles.chipTextActive : styles.chipTextInactive
      ]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  chipActive: {
    backgroundColor: '#2E2A26',
  },
  chipInactive: {
    backgroundColor: '#FFFFFF',
  },
  chipShadow: {
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  chipTextActive: {
    color: '#FDFAF7',
    fontWeight: '600',
  },
  chipTextInactive: {
    color: '#3D3D3D',
    fontWeight: '500',
  },
});
