import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useCartCount } from '../../store/cart';
import { useAuthStore } from '../../store/auth';

export type DialTab = 'carrito' | 'pedidos' | 'yo';

export interface ChakanadialProps {
  activeTab?: DialTab;
  onTabPress?: (tab: DialTab) => void;
  onCenterPress?: () => void;
}

function DialIcon({
  tab,
  icon,
  label,
  active,
  badge,
  onPress,
}: {
  tab: DialTab;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  active: boolean;
  badge?: number;
  onPress: (tab: DialTab) => void;
}) {
  return (
    <TouchableOpacity style={styles.dialIconContainer} activeOpacity={0.6} onPress={() => onPress(tab)}>
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

export default function ChakanaDial({ activeTab, onTabPress, onCenterPress }: ChakanadialProps) {
  const insets = useSafeAreaInsets();
  const cartCount = useCartCount();
  const role = useAuthStore((s) => s.user?.role ?? 'embajador');
  const handleTab = (tab: DialTab) => onTabPress?.(tab);

  const leftTab = role === 'tambu'
    ? { tab: 'pedidos' as DialTab, icon: 'receipt-outline' as const, label: 'PEDIDOS', badge: undefined }
    : { tab: 'carrito' as DialTab, icon: 'bag-outline' as const,     label: 'CARRITO', badge: cartCount };

  return (
    <View style={[styles.dialContainer, { bottom: insets.bottom + 18 }]}>
      <View style={styles.dialGlass}>
        <DialIcon {...leftTab} active={activeTab === leftTab.tab} onPress={handleTab} />
        <View style={{ width: 72 }} />
        <DialIcon tab="yo" icon="person-outline" label="PERFIL" active={activeTab === 'yo'} onPress={handleTab} />
      </View>

      <View style={styles.dialCenterWrapper}>
        <TouchableOpacity activeOpacity={0.8} onPress={onCenterPress} style={{ flex: 1 }}>
          <LinearGradient
            colors={['#C5836F', '#A63A2F', '#6E1C13']}
            start={{ x: 0.35, y: 0.3 }}
            end={{ x: 1, y: 1 }}
            style={styles.dialCenterButton}
          >
            <Image source={require('../../assets/images/splash-icon.png')} style={styles.dialCenterIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dialContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: '92%',
    height: 72,
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
    width: 72,
    height: 72,
    transform: [{ translateX: -36 }],
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialCenterIcon: {
    width: 28,
    height: 28,
    tintColor: '#FDFAF7',
    resizeMode: 'contain',
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
