import React, { useRef, useEffect } from 'react';
import {
  StyleSheet, View, Text, ScrollView, ImageBackground,
  Pressable, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import InventoryCard from '../../components/InventoryCard';
import { cartStore, useCart } from '../../store/cart';

export default function InventoryScreen() {
  const { tambuid } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useCart(); // re-render when cart changes
  const cartCount = cartStore.getCount();
  const cartTotal = cartStore.getTotal();

  // Scroll-driven header opacity
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [180, 250],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Cart button entrance animation
  const cartBtnAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(cartBtnAnim, {
      toValue: cartCount > 0 ? 1 : 0,
      useNativeDriver: true,
      damping: 14,
      stiffness: 200,
      mass: 0.8,
    }).start();
  }, [cartCount > 0]);

  const tambuName =
    tambuid === 'tambu-san-sebastian'    ? 'Tambu San Sebastián'  :
    tambuid === 'hilos-de-susudel'       ? 'Hilos de Susudel'     :
    tambuid === 'panaderia-vieja-plaza'  ? 'Panadería Vieja Plaza':
    'Tambu Desconocido';

  const inventoryItems = [
    { id: '1', title: 'Silla de Roble Restaurada', type: 'MUEBLE',       price: 150, image: require('../../assets/images/tambu_placeholder.webp') },
    { id: '2', title: 'Bicicleta Vintage',          type: 'TRANSPORTE',   price: 320, image: require('../../assets/images/tambu_placeholder.webp') },
    { id: '3', title: 'Juego de Té Andino',         type: 'CERÁMICA',     price: 45,  image: require('../../assets/images/tambu_placeholder.webp') },
    { id: '4', title: 'Lámpara de Cobre',           type: 'ILUMINACIÓN',  price: 80,  image: require('../../assets/images/tambu_placeholder.webp') },
    { id: '5', title: 'Maceta de Barro Cocido',     type: 'CERÁMICA',     price: 25,  image: require('../../assets/images/tambu_placeholder.webp') },
    { id: '6', title: 'Mesa de Centro Rústica',     type: 'MUEBLE',       price: 210, image: require('../../assets/images/tambu_placeholder.webp') },
    { id: '7', title: 'Poncho de Alpaca',           type: 'TEXTIL',       price: 115, image: require('../../assets/images/tambu_placeholder.webp') },
    { id: '8', title: 'Cámara Analógica 35mm',      type: 'ELECTRÓNICA',  price: 190, image: require('../../assets/images/tambu_placeholder.webp') },
  ];

  return (
    <View style={styles.container}>

      {/* Fixed Navbar */}
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
        {/* Hero Banner */}
        <ImageBackground
          source={require('../../assets/images/tambu_placeholder.webp')}
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

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.infoSection}>
            <Text style={styles.eyebrow}>· CUENCA, ECUADOR ·</Text>
            <Text style={styles.tambuTitle}>{tambuName}</Text>
            <Text style={styles.tambuDesc}>
              Un espacio de economía circular en tu barrio. Aquí cada objeto tiene una segunda historia.
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statChip}>
                <Ionicons name="star" size={14} color="#A63A2F" />
                <Text style={styles.statValue}>4.9</Text>
              </View>
              <View style={styles.statChip}>
                <Ionicons name="location-outline" size={14} color="#6B645C" />
                <Text style={styles.statValue}>Centro</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionEyebrow}>INVENTARIO DISPONIBLE</Text>
          <View style={styles.grid}>
            {inventoryItems.map(item => (
              <InventoryCard
                key={item.id}
                id={item.id}
                title={item.title}
                type={item.type}
                price={item.price}
                image={item.image}
              />
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Floating cart button — appears when cart has items */}
      <Animated.View
        style={[
          styles.cartBarWrapper,
          { bottom: insets.bottom + 20 },
          {
            opacity: cartBtnAnim,
            transform: [
              { scale: cartBtnAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
              { translateY: cartBtnAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
            ],
          },
        ]}
        pointerEvents={cartCount > 0 ? 'auto' : 'none'}
      >
        <Pressable
          onPress={() => router.push('/carrito' as any)}
          style={({ pressed }) => [pressed && { opacity: 0.9 }]}
        >
          <LinearGradient
            colors={['#1E1A17', '#2E2A26']}
            style={styles.cartBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="bag-outline" size={18} color="#FDFAF7" />
            <Text style={styles.cartBtnText}>Ver carrito</Text>
            <View style={styles.cartDivider} />
            <Text style={styles.cartBtnTotal}>{cartTotal} Aurios</Text>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  heroBanner: {
    width: '100%',
    height: 320,
    justifyContent: 'flex-start',
  },
  fixedNavbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  fixedNavbarBg: {
    backgroundColor: 'rgba(253,250,247,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(140,133,123,0.15)',
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 32,
    elevation: 4,
  },
  navBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3D3D3D',
    letterSpacing: -0.2,
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F0EB',
    paddingHorizontal: 28,
    paddingTop: 0,
    paddingBottom: 24,
  },
  infoSection: {
    marginBottom: 40,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A63A2F',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  tambuTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3D3D3D',
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 16,
  },
  tambuDesc: {
    fontSize: 15,
    lineHeight: 24,
    color: '#6B645C',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F3EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3D3D3D',
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B645C',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },

  // Floating cart button
  cartBarWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 50,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 16,
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 999,
  },
  cartBtnText: {
    color: '#FDFAF7',
    fontWeight: '600',
    fontSize: 14,
  },
  cartDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(253,250,247,0.2)',
  },
  cartBtnTotal: {
    color: '#3AAFA9',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: -0.2,
  },
  cartBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A63A2F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FDFAF7',
    fontWeight: '700',
    fontSize: 12,
  },
});
