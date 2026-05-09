import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing,
} from 'react-native-reanimated';

import { useCartCount } from '../../store/cart';
import { useAuthStore } from '../../store/auth';
import { haptic } from '../../utils/haptics';

export type DialTab = 'carrito' | 'pedidos' | 'yo';

export interface ChakanadialProps {
  activeTab?: DialTab;
  onTabPress?: (tab: DialTab) => void;
  onCenterPress?: () => void;
  centerLabel?: string;
  compact?: boolean;
  cartPill?: { count: number; total: number };
}

function DialIcon({
  tab, icon, label, active, badge, onPress,
}: {
  tab: DialTab;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  active: boolean;
  badge?: number;
  onPress: (tab: DialTab) => void;
}) {
  return (
    <TouchableOpacity style={styles.dialIconContainer} activeOpacity={0.6} onPress={() => { haptic.selection(); onPress(tab); }}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={24} color={active ? '#A63A2F' : '#6B645C'} />
        {badge != null && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.dialIconLabel, active && styles.dialIconLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const EASE_OUT   = { duration: 260, easing: Easing.out(Easing.cubic) };
const EASE_IN    = { duration: 200, easing: Easing.in(Easing.cubic) };
const SPRING     = { damping: 12, stiffness: 300, mass: 0.8 };
const BASE_SIZE  = 72;
const PILL_WIDTH = 148;

export default function ChakanaDial({ activeTab, onTabPress, onCenterPress, centerLabel, compact, cartPill }: ChakanadialProps) {
  const insets    = useSafeAreaInsets();
  const cartCount = useCartCount();
  const role      = useAuthStore((s) => s.user?.role ?? 'embajador');
  const handleTab = (tab: DialTab) => onTabPress?.(tab);

  // Center bounce on press
  const centerScale = useSharedValue(1);

  // Glass pill expand / collapse
  const glassOpacity = useSharedValue(compact ? 0 : 1);
  const glassScaleX  = useSharedValue(compact ? 0 : 1);
  useEffect(() => {
    glassOpacity.value = withTiming(compact ? 0 : 1, compact ? EASE_IN : EASE_OUT);
    glassScaleX.value  = withTiming(compact ? 0 : 1, compact ? EASE_IN : EASE_OUT);
  }, [compact]);

  // Center label chip (CHECKOUT) fades with compact
  const labelOpacity = useSharedValue(compact ? 1 : 0);
  useEffect(() => {
    labelOpacity.value = withTiming(compact ? 1 : 0, compact ? EASE_OUT : EASE_IN);
  }, [compact]);

  // Pill morph: 0 = circle, 1 = expanded pill with price
  const pillExpand = useSharedValue(cartPill ? 1 : 0);
  useEffect(() => {
    pillExpand.value = cartPill
      ? withSpring(1, { damping: 14, stiffness: 180 })
      : withTiming(0, EASE_OUT);
  }, [!!cartPill]);

  // Price text fades in as pill expands
  const priceOpacity = useSharedValue(cartPill ? 1 : 0);
  useEffect(() => {
    priceOpacity.value = cartPill ? withTiming(1, EASE_OUT) : withTiming(0, EASE_IN);
  }, [!!cartPill]);

  const glassAnimStyle = useAnimatedStyle(() => ({
    opacity:   glassOpacity.value,
    transform: [{ scaleX: glassScaleX.value }],
  }));

  const labelAnimStyle = useAnimatedStyle(() => ({ opacity: labelOpacity.value }));

  // Width morphs 72→148; translateX stays centered: -(width/2)
  const centerAnimStyle = useAnimatedStyle(() => {
    const w = BASE_SIZE + pillExpand.value * (PILL_WIDTH - BASE_SIZE);
    return {
      width: w,
      transform: [
        { translateX: -(w / 2) },
        { scale: centerScale.value },
      ],
    };
  });

  const priceAnimStyle = useAnimatedStyle(() => ({ opacity: priceOpacity.value }));

  const leftTab = role === 'tambu'
    ? { tab: 'pedidos' as DialTab, icon: 'receipt-outline' as const, label: 'PEDIDOS', badge: undefined }
    : { tab: 'carrito' as DialTab, icon: 'bag-outline'     as const, label: 'CARRITO', badge: cartCount };

  return (
    <View style={[styles.dialContainer, { bottom: insets.bottom + 18 }]}>

      {centerLabel && (
        <Animated.View style={[styles.centerLabelContainer, labelAnimStyle]}>
          <View style={styles.centerLabelPill}>
            <Text style={styles.centerLabelText}>{centerLabel}</Text>
          </View>
        </Animated.View>
      )}

      <Animated.View style={[styles.dialGlass, glassAnimStyle]}>
        <DialIcon {...leftTab} active={activeTab === leftTab.tab} onPress={handleTab} />
        <View style={{ width: BASE_SIZE }} />
        <DialIcon tab="yo" icon="person-outline" label="PERFIL" active={activeTab === 'yo'} onPress={handleTab} />
      </Animated.View>

      <Animated.View style={[styles.dialCenterWrapper, centerAnimStyle]}>
        <Pressable
          onPressIn={() => { centerScale.value = withSpring(0.92, SPRING); }}
          onPressOut={() => { centerScale.value = withSpring(1, SPRING); }}
          onPress={() => { haptic.medium(); onCenterPress?.(); }}
          style={{ flex: 1 }}
        >
          <LinearGradient
            colors={compact ? ['#4DC8C2', '#3AAFA9', '#237A75'] : ['#C5836F', '#A63A2F', '#6E1C13']}
            start={{ x: 0.35, y: 0.3 }}
            end={{ x: 1, y: 1 }}
            style={styles.dialCenterButton}
          >
            <Image source={require('../../assets/images/splash-icon.png')} style={styles.dialCenterIcon} />
            {cartPill != null && (
              <Animated.Text style={[styles.dialCenterPrice, priceAnimStyle]}>
                ${cartPill.total.toFixed(2)}
              </Animated.Text>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  dialContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: '92%',
    height: BASE_SIZE,
    zIndex: 20,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 16,
  },
  dialGlass: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 0,
    right: 0,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(140,133,123,0.15)',
    backgroundColor: '#FFFFFF',
  },
  dialCenterWrapper: {
    position: 'absolute',
    left: '50%',
    top: -4,
    height: BASE_SIZE,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    padding: 6,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  dialCenterButton: {
    flex: 1,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  dialCenterIcon: {
    width: 28,
    height: 28,
    tintColor: '#FDFAF7',
    resizeMode: 'contain',
  },
  dialCenterPrice: {
    color: '#FDFAF7',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.3,
  },
  dialIconContainer: {
    alignItems: 'center',
    gap: 4,
    width: 56,
  },
  iconWrap: {
    width: 24,
    height: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#A63A2F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FDFAF7',
    lineHeight: 11,
  },
  centerLabelContainer: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 21,
  },
  centerLabelPill: {
    backgroundColor: '#3AAFA9',
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 999,
  },
  centerLabelText: {
    color: '#FDFAF7',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  dialIconLabel: {
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: '#6B645C',
  },
  dialIconLabelActive: {
    color: '#A63A2F',
  },
});
