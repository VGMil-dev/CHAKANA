import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function Chip({ label, active, onClick }: ChipProps) {
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
    paddingHorizontal: 14,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
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
  chipText: {
    fontSize: 12,
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
