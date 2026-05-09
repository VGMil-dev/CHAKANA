import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Chip from './Chip';

export interface Category {
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
}

interface Props {
  categories: Category[];
  active: string;
  onSelect: (label: string) => void;
}

export default function CategoryChipsBar({ categories, active, onSelect }: Props) {
  return (
    <View style={styles.stickyContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inner}>
        {categories.map(c => (
          <Chip
            key={c.label}
            label={c.label}
            active={c.label === active}
            onClick={() => onSelect(c.label)}
            icon={<Ionicons name={c.iconName} size={14} color={c.label === active ? '#FDFAF7' : '#3D3D3D'} />}
          />
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
    gap: 12,
  },
});
