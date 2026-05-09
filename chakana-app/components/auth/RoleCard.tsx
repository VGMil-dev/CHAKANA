import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { haptic } from '../../utils/haptics';

type Role = 'embajador' | 'tambu';

interface PhaseStep {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
}

const ROLES: Record<Role, { label: string; tagline: string; phases: PhaseStep[] }> = {
  embajador: {
    label: 'Embajador',
    tagline: 'Tu apoyo vuelve siempre.',
    phases: [
      { icon: 'bag-handle-outline', label: 'Compra' },
      { icon: 'star-outline', label: 'Reseña' },
      { icon: 'leaf-outline', label: 'Gana Aurios' },
    ],
  },
  tambu: {
    label: 'Tambu',
    tagline: 'Tu negocio crece con cada ciclo.',
    phases: [
      { icon: 'storefront-outline', label: 'Vende' },
      { icon: 'chatbubble-outline', label: 'Recibe reseñas' },
      { icon: 'trending-up-outline', label: 'Crece' },
    ],
  },
};

interface RoleCardProps {
  value: Role;
  onChange: (role: Role) => void;
}

export default function RoleCard({ value, onChange }: RoleCardProps) {
  const current = ROLES[value];

  const handlePress = (role: Role) => {
    haptic.selection();
    onChange(role);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.chips}>
        {(Object.keys(ROLES) as Role[]).map(role => {
          const active = value === role;
          return (
            <TouchableOpacity
              key={role}
              activeOpacity={0.75}
              onPress={() => handlePress(role)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {ROLES[role].label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.desc}>
        <Text style={styles.tagline}>{current.tagline}</Text>
        <View style={styles.phases}>
          {current.phases.map((step, i) => (
            <React.Fragment key={step.label}>
              <View style={styles.phase}>
                <Ionicons name={step.icon} size={14} color="#9E392D" />
                <Text style={styles.phaseLabel}>{step.label}</Text>
              </View>
              {i < current.phases.length - 1 && (
                <Ionicons name="chevron-forward" size={12} color="#C9C1B8" />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
    marginBottom: 24,
  },
  chips: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCF9F6',
    borderWidth: 1.5,
    borderColor: 'rgba(140,133,123,0.18)',
  },
  chipActive: {
    backgroundColor: '#2E2A26',
    borderColor: '#2E2A26',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3D3D3D',
    letterSpacing: 0.3,
  },
  chipTextActive: {
    color: '#FDFAF7',
  },
  desc: {
    backgroundColor: '#FCF9F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(140,133,123,0.12)',
    gap: 8,
  },
  tagline: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#6B645C',
    fontWeight: '500',
    textAlign: 'center',
  },
  phases: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  phase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phaseLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9E392D',
    letterSpacing: 0.2,
  },
});
