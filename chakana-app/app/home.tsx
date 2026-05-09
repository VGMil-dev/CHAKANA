import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import HomeHeader from '../components/home/HomeHeader';
import DisplaySection from '../components/home/DisplaySection';
import CategoryChipsBar from '../components/home/CategoryChipsBar';
import TambuFeed from '../components/home/TambuFeed';
import ChakanaDial from '../components/core/ChakanaDial';
import { useAuthStore } from '../store/auth';

import { MARKET_CATEGORIES } from '../data/categories';
import { TAMBUSES } from '../data/tambuses';

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [active, setActive] = useState('Café');
  const { user, logout } = useAuthStore();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <HomeHeader
        initials="MR"
        eyebrow="BUEN DÍA · CUENCA"
        greeting="Hola, Mateo."
        amount={2840}
      />

      <View style={styles.actionsRow}>
        <Pressable style={styles.actionBtn} onPress={() => router.push('/orders')}>
          <Text style={styles.actionText}>Órdenes</Text>
        </Pressable>
        {(user?.role === 'merchant' || user?.role === 'admin') ? (
          <Pressable style={styles.actionBtn} onPress={() => router.push('/merchant-dashboard')}>
            <Text style={styles.actionText}>Dashboard</Text>
          </Pressable>
        ) : null}
        <Pressable
          style={styles.actionBtn}
          onPress={async () => {
            await logout();
            router.replace('/auth');
          }}
        >
          <Text style={styles.actionText}>Salir</Text>
        </Pressable>
      </View>

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

      <ChakanaDial activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  actionsRow: {
    paddingHorizontal: 22,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: '#D4CCC3',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#FFF',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B645C',
  },
});
