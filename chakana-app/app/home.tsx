import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeHeader from '../components/HomeHeader';
import DisplaySection from '../components/DisplaySection';
import CategoryChipsBar, { Category } from '../components/CategoryChipsBar';
import TambuFeed, { TambuItem } from '../components/TambuFeed';
import ChakanaDial from '../components/ChakanaDial';

const CATEGORIES: Category[] = [
  { label: 'Todos', iconName: 'apps-outline' },
  { label: 'Café', iconName: 'cafe-outline' },
  { label: 'Arte', iconName: 'color-palette-outline' },
  { label: 'Mercado', iconName: 'basket-outline' },
  { label: 'Talleres', iconName: 'construct-outline' },
  { label: 'Ferias', iconName: 'storefront-outline' },
  { label: 'Pan', iconName: 'restaurant-outline' },
];

const TAMBUS: TambuItem[] = [
  { id: 'tambu-san-sebastian', name: 'Tambu San Sebastián', barrio: 'San Sebastián · 0.4 km', cat: 'CAFÉ', tone: 'clay', rating: 4.9, n: 312, aurios: 12 },
  { id: 'hilos-de-susudel', name: 'Hilos de Susudel', barrio: 'El Vado · 1.1 km', cat: 'TEXTIL', tone: 'weave', rating: 4.8, n: 187, aurios: 18 },
  { id: 'panaderia-vieja-plaza', name: 'Panadería Vieja Plaza', barrio: 'Centro · 0.6 km', cat: 'PAN', tone: 'ember', rating: 4.7, n: 421, aurios: 8 },
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState('Café');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <HomeHeader
        initials="MR"
        eyebrow="BUEN DÍA · CUENCA"
        greeting="Hola, Mateo."
        amount={2840}
      />

      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <DisplaySection eyebrow="MERCADO" title="Tambús que" accentLine="laten hoy." />

        <CategoryChipsBar categories={CATEGORIES} active={active} onSelect={setActive} />

        <TambuFeed
          tambus={TAMBUS}
          note={'Cada compra siembra.\n Cada reseña hace crecer.'}
        />
      </ScrollView>

      <ChakanaDial />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
});
