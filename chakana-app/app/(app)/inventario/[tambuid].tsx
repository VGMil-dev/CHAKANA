import React, { useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Text, ImageBackground,
  Pressable, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import InventoryCard from '../../../components/inventory/InventoryCard';
import SkeletonBox from '../../../components/core/SkeletonBox';
import { useCartStore } from '../../../store/cart';
import { useBusinesses } from '../../../src/hooks/useBusinesses';
import { useProducts } from '../../../src/hooks/useProducts';

function ProductGridSkeleton() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={{ width: '47%', backgroundColor: '#FFFFFF', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
          <SkeletonBox width="100%" height={160} borderRadius={0} />
          <View style={{ padding: 12, gap: 8 }}>
            <SkeletonBox width="80%" height={14} />
            <SkeletonBox width="50%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}

export default function InventoryScreen() {
  const { tambuid } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { add, remove, items: cartItems } = useCartStore();

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [180, 250],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const id = typeof tambuid === 'string' ? tambuid : tambuid?.[0] ?? null;
  const { listaTambus, fetchBusinesses } = useBusinesses();
  const tambu = useMemo(() => listaTambus.find((item) => item.id === id) ?? null, [id, listaTambus]);
  const businessId = tambu?.id ?? null;
  const { products, isLoadingProducts, productsError } = useProducts(businessId);
  const tambuName = tambu?.name ?? 'Tambú';

  useEffect(() => {
    if (listaTambus.length === 0) void fetchBusinesses();
  }, [fetchBusinesses, listaTambus.length]);

  return (
    <View style={styles.container}>
      <View style={[styles.fixedNavbar, { paddingTop: insets.top + 12 }]}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.fixedNavbarBg, { opacity: headerOpacity }]} />
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.navBackBtn, pressed && { opacity: 0.8, transform: [{ translateY: 1 }] }]}
        >
          <Ionicons name="arrow-back" size={20} color="#3D3D3D" />
        </Pressable>
        <Animated.Text style={[styles.navTitle, { opacity: headerOpacity }]} numberOfLines={1}>
          {tambuName}
        </Animated.Text>
        <View style={{ width: 44 }} />
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <ImageBackground
          source={tambu?.image_url ? { uri: tambu.image_url } : require('../../../assets/images/tambu_placeholder.webp')}
          style={styles.heroBanner}
          imageStyle={{ resizeMode: 'cover' }}
        >
          <LinearGradient
            colors={['transparent', 'rgba(245,240,235,0.4)', '#F5F0EB']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.6 }}
            end={{ x: 0.5, y: 1 }}
          />
        </ImageBackground>

        <View style={styles.content}>
          <View style={styles.infoSection}>
            <Text style={styles.eyebrow}>· CUENCA, ECUADOR ·</Text>
            <Text style={styles.tambuTitle}>{tambuName}</Text>
            <Text style={styles.tambuDesc}>
              {tambu?.description ?? 'Inventario circular disponible para compra local.'}
            </Text>
            <View style={styles.statsRow}>
              {tambu?.wallet_adress ? (
                <View style={styles.statChip}>
                  <Ionicons name="wallet-outline" size={14} color="#6B645C" />
                  <Text style={styles.statValue}>
                    {tambu.wallet_adress.slice(0, 4)}...{tambu.wallet_adress.slice(-4)}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <Text style={styles.sectionEyebrow}>INVENTARIO DISPONIBLE</Text>
          {isLoadingProducts ? (
            <ProductGridSkeleton />
          ) : productsError ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>{productsError}</Text>
            </View>
          ) : products.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Sin inventario hoy.</Text>
              <Pressable onPress={() => router.back()}>
                <Text style={styles.emptyLink}>Volver al mercado</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.grid}>
              {products.map(item => (
                <InventoryCard
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  type={item.type ?? 'Producto'}
                  price={item.price_cents / 100}
                  image={item.image_url}
                  qty={cartItems.find(i => i.id === item.id)?.qty ?? 0}
                  onAdd={() => add({
                    id: item.id,
                    businessId: item.business_id,
                    title: item.name,
                    type: item.type ?? 'Producto',
                    price: item.price_cents / 100,
                    image: item.image_url,
                  })}
                  onRemove={() => remove(item.id)}
                />
              ))}
            </View>
          )}
        </View>
      </Animated.ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB' },
  heroBanner: { width: '100%', height: 320, justifyContent: 'flex-start' },
  fixedNavbar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingBottom: 16,
  },
  fixedNavbarBg: {
    backgroundColor: 'rgba(253,250,247,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(140,133,123,0.15)',
    shadowColor: '#86231A', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05, shadowRadius: 32, elevation: 4,
  },
  navBackBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F8F3EE', alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { fontSize: 15, fontWeight: '700', color: '#3D3D3D', letterSpacing: -0.2 },
  content: { flex: 1, backgroundColor: '#F5F0EB', paddingHorizontal: 28, paddingBottom: 24 },
  infoSection: { marginBottom: 40 },
  eyebrow: { fontSize: 10, fontWeight: '600', color: '#A63A2F', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  tambuTitle: { fontSize: 32, fontWeight: '700', color: '#3D3D3D', letterSpacing: -0.5, lineHeight: 36, marginBottom: 16 },
  tambuDesc: { fontSize: 15, lineHeight: 24, color: '#6B645C', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8F3EE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, gap: 6,
  },
  statValue: { fontSize: 13, fontWeight: '600', color: '#3D3D3D' },
  sectionEyebrow: { fontSize: 10, fontWeight: '600', color: '#6B645C', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 64, gap: 18 },
  emptyTitle: { fontWeight: '700', fontSize: 26, color: '#C4BDB6', letterSpacing: -0.5 },
  emptyLink: { fontSize: 14, color: '#A63A2F', textDecorationLine: 'underline', fontWeight: '500' },
});
