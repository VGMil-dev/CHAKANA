import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';

import HomeHeader from '../../components/home/HomeHeader';
import DisplaySection from '../../components/home/DisplaySection';
import CategoryChipsBar from '../../components/home/CategoryChipsBar';
import TambuFeed from '../../components/home/TambuFeed';
import ChakanaDial from '../../components/core/ChakanaDial';
import SkeletonBox from '../../components/core/SkeletonBox';
import { useAuthStore } from '../../store/auth';

import { MARKET_CATEGORIES } from '../../data/categories';
import { TAMBUSES } from '../../data/tambuses';

function getInitials(name: string) {
  return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function TambuCardSkeleton({ featured }: { featured?: boolean }) {
  return (
    <View style={{ gap: 10, backgroundColor: '#FFFFFF', borderRadius: 10, overflow: 'hidden' }}>
      <SkeletonBox width="100%" height={featured ? 168 : 130} borderRadius={0} />
      <View style={{ paddingHorizontal: 14, paddingBottom: 14, gap: 8 }}>
        <SkeletonBox width="75%" height={16} />
        <SkeletonBox width="45%" height={12} />
      </View>
    </View>
  );
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [active, setActive] = useState('Café');
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (user?.role === 'tambu') return <Redirect href="/dashboard" />;

  const initials = user?.name ? getInitials(user.name) : '··';
  const greeting = user?.name ? `Hola, ${user.name.split(' ')[0]}.` : 'Hola.';

  const filteredTambus = active === 'Todos'
    ? TAMBUSES
    : TAMBUSES.filter(t => t.cat.toLowerCase() === active.toLowerCase());

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

        {loading ? (
          <View style={{ paddingHorizontal: 28, paddingBottom: 180, gap: 28 }}>
            <TambuCardSkeleton featured />
            <TambuCardSkeleton />
            <TambuCardSkeleton />
          </View>
        ) : (
          <TambuFeed
            tambus={filteredTambus}
            note={'Cada compra siembra.\n Cada reseña hace crecer.'}
          />
        )}
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
