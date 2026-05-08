import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import BalancePill from '../components/BalancePill';
import Chip from '../components/Chip';
import TambuCard from '../components/TambuCard';
import ChakanaDial from '../components/ChakanaDial';

export default function Home() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState('Café');
  const cats = [
    { label: 'Todos', iconName: 'apps-outline' as const },
    { label: 'Café', iconName: 'cafe-outline' as const },
    { label: 'Arte', iconName: 'color-palette-outline' as const },
    { label: 'Mercado', iconName: 'basket-outline' as const },
    { label: 'Talleres', iconName: 'construct-outline' as const },
    { label: 'Ferias', iconName: 'storefront-outline' as const },
    { label: 'Pan', iconName: 'restaurant-outline' as const },
  ];
  const tambus = [
    { name: 'Tambu San Sebastián', barrio: 'San Sebastián · 0.4 km', cat: 'CAFÉ', tone: 'clay', rating: 4.9, n: 312, aurios: 12 },
    { name: 'Hilos de Susudel', barrio: 'El Vado · 1.1 km', cat: 'TEXTIL', tone: 'weave', rating: 4.8, n: 187, aurios: 18 },
    { name: 'Panadería Vieja Plaza', barrio: 'Centro · 0.6 km', cat: 'PAN', tone: 'ember', rating: 4.7, n: 421, aurios: 8 },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header — greeting + balance */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>MR</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerEyebrow}>BUEN DÍA · CUENCA</Text>
          <Text style={styles.headerTitle}>Hola, Mateo.</Text>
        </View>
        <BalancePill amount={2840} />
      </View>

      <ScrollView 
        stickyHeaderIndices={[1]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Eyebrow + display title */}
        <View style={styles.displaySection}>
          <Text style={styles.displayEyebrow}>MERCADO</Text>
          <Text style={styles.displayTitle}>
            Tambús que{'\n'}
            <Text style={{ color: '#A63A2F' }}>laten hoy.</Text>
          </Text>
        </View>

        {/* Filter chips (Sticky) */}
        <View style={styles.stickyChipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            {cats.map(c => (
              <Chip
                key={c.label}
                label={c.label}
                active={c.label === active}
                onClick={() => setActive(c.label)}
                icon={<Ionicons name={c.iconName} size={14} color={c.label === active ? '#FDFAF7' : '#3D3D3D'} />}
              />
            ))}
          </ScrollView>
        </View>

        {/* Feed */}
        <View style={styles.feedContainer}>
          {tambus.map((t, i) => <TambuCard key={t.name} {...t} featured={i === 0} />)}

          <View style={styles.cycleNote}>
            <Text style={styles.cycleNoteText}>Cada compra siembra.{'\n'} Cada reseña hace crecer.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating radial Chakana nav (non-conventional) */}
      <ChakanaDial />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
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
  headerTextContainer: {
    flex: 1,
  },
  headerEyebrow: {
    fontSize: 11,
    color: '#9A938A',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 19,
    color: '#3D3D3D',
    letterSpacing: -0.1,
    marginTop: 2,
  },
  displaySection: {
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 24,
  },
  displayEyebrow: {
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 2.2,
    color: '#A63A2F',
    textTransform: 'uppercase',
  },
  displayTitle: {
    fontWeight: '700',
    fontSize: 34,
    lineHeight: 38,
    color: '#3D3D3D',
    letterSpacing: -0.8,
    marginTop: 12,
  },
  stickyChipsContainer: {
    backgroundColor: '#F5F0EB',
    paddingTop: 12,
    paddingBottom: 28,
    zIndex: 10,
  },
  chipsContainer: {
    paddingHorizontal: 28,
    gap: 12,
  },
  feedContainer: {
    paddingHorizontal: 28,
    paddingBottom: 180,
    gap: 28,
  },
  cycleNote: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 28,
    alignItems: 'center',
  },

  cycleNoteText: {
    fontSize: 16,
    color: '#3D3D3D',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '300',
    fontFamily: 'Graphik-Light',
    fontStyle: 'italic',
  },
});
