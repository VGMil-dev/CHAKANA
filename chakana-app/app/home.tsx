import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BalancePill from '../components/BalancePill';
import Chip from '../components/Chip';
import TambuCard from '../components/TambuCard';
import ChakanaDial from '../components/ChakanaDial';

export default function Home() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState('Café');
  const cats = ['Todos', 'Café', 'Arte', 'Mercado', 'Talleres', 'Ferias', 'Pan'];
  const tambus = [
    { name:'Tambu San Sebastián',   barrio:'San Sebastián · 0.4 km', cat:'CAFÉ',   tone:'clay',   rating: 4.9, n: 312, aurios: 12 },
    { name:'Hilos de Susudel',      barrio:'El Vado · 1.1 km',       cat:'TEXTIL', tone:'weave',  rating: 4.8, n: 187, aurios: 18 },
    { name:'Panadería Vieja Plaza', barrio:'Centro · 0.6 km',        cat:'PAN',    tone:'ember',  rating: 4.7, n: 421, aurios: 8  },
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
        <BalancePill amount={2840}/>
      </View>

      {/* Eyebrow + display title */}
      <View style={styles.displaySection}>
        <Text style={styles.displayEyebrow}>01 · MERCADO</Text>
        <Text style={styles.displayTitle}>
          Tambus que{'\n'}
          <Text style={{ color:'#A63A2F' }}>laten hoy.</Text>
        </Text>
      </View>

      {/* Filter chips */}
      <View style={styles.chipsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
          {cats.map(c => (
            <Chip key={c} label={c} active={c === active} onClick={() => setActive(c)}/>
          ))}
        </ScrollView>
      </View>

      {/* Feed */}
      <ScrollView contentContainerStyle={styles.feedContainer} showsVerticalScrollIndicator={false}>
        {tambus.map((t, i) => <TambuCard key={t.name} {...t} featured={i === 0}/>)}

        <View style={styles.cycleNote}>
          <Text style={styles.cycleNoteTitle}>· EL CICLO ·</Text>
          <Text style={styles.cycleNoteText}>Cada compra siembra. Cada reseña riega.</Text>
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
    paddingBottom: 36,
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
  chipsWrapper: {
    marginBottom: 28,
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
    marginTop: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#F8F3EE',
    alignItems: 'center',
  },
  cycleNoteTitle: {
    color: '#A63A2F',
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontSize: 10,
    marginBottom: 8,
  },
  cycleNoteText: {
    fontSize: 13,
    color: '#6B645C',
    textAlign: 'center',
    lineHeight: 22,
  },
});
