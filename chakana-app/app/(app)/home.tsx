import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import HomeHeader from '../../components/home/HomeHeader';
import DisplaySection from '../../components/home/DisplaySection';
import CategoryChipsBar from '../../components/home/CategoryChipsBar';
import TambuFeed from '../../components/home/TambuFeed';
import ChakanaDial from '../../components/core/ChakanaDial';

import { MARKET_CATEGORIES } from '../../data/categories';
import { TAMBUSES } from '../../data/tambuses';

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
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

        <CategoryChipsBar
          categories={MARKET_CATEGORIES}
          active={active}
          onSelect={setActive}
        />

        <TambuFeed
          tambus={TAMBUSES}
          note={'Cada compra siembra.\n Cada reseña hace crecer.'}
        />
      </ScrollView>

      <ChakanaDial
        onTabPress={(tab) => {
          if (tab === 'yo')      router.push('/perfil');
          if (tab === 'carrito') router.push('/carrito');
          if (tab === 'pedidos') router.push('/pedidos');
        }}
        onCenterPress={() => router.replace('/home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
});
