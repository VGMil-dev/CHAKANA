import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Chip from './Chip';

export interface Category {
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
}

export interface CategoryChipsBarProps {
  categories: Category[];
  active: string;
  onSelect: (label: string) => void;
}

export default function CategoryChipsBar({ categories, active, onSelect }: CategoryChipsBarProps) {
  return (
    <View style={styles.stickyContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inner}>
        {categories.map((c, i) => (
          <View key={c.label} style={i < categories.length - 1 ? styles.chipGap : undefined}>
            <Chip
              label={c.label}
              active={c.label === active}
              onClick={() => onSelect(c.label)}
              icon={<Ionicons name={c.iconName} size={14} color={c.label === active ? '#FDFAF7' : '#3D3D3D'} />}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  stickyContainer: {
    backgroundColor: '#F5F0EB',
    paddingTop: 12,
    paddingBottom: 28,
    zIndex: 10,
  },
  inner: {
    paddingHorizontal: 28,
  },
  chipGap: {
    marginRight: 12,
  },
});
