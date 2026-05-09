import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';

import HomeHeader from '../../components/home/HomeHeader';
import DisplaySection from '../../components/home/DisplaySection';
import CategoryChipsBar from '../../components/home/CategoryChipsBar';
import TambuFeed from '../../components/home/TambuFeed';
import ChakanaDial from '../../components/core/ChakanaDial';
import { useAuthStore } from '../../store/auth';

import { MARKET_CATEGORIES } from '../../data/categories';
import { TAMBUSES } from '../../data/tambuses';

function getInitials(name: string) {
  return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [active, setActive] = useState('Café');
  const user = useAuthStore((s) => s.user);

  if (user?.role === 'tambu') return <Redirect href="/dashboard" />;

  const initials = user?.name ? getInitials(user.name) : '··';
  const greeting = user?.name ? `Hola, ${user.name.split(' ')[0]}.` : 'Hola.';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <HomeHeader
        initials={initials}
        eyebrow="BUEN DÍA · CUENCA"
        greeting={greeting}
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
