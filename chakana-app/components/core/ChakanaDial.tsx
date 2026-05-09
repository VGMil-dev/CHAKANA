import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export type DialTab = 'home' | 'ciclo' | 'yo' | 'eco';

export interface ChakanadialProps {
  activeTab?: DialTab;
  onTabPress?: (tab: DialTab) => void;
  onCenterPress?: () => void;
}

const TABS: { tab: DialTab; icon: React.ComponentProps<typeof Ionicons>['name']; label: string }[] = [
  { tab: 'home',  icon: 'home-outline',         label: 'HOY'  },
  { tab: 'ciclo', icon: 'sync-outline',          label: 'CICLO'},
  { tab: 'yo',    icon: 'person-outline',        label: 'YO'   },
  { tab: 'eco',   icon: 'notifications-outline', label: 'ECO'  },
];

function DialIcon({
  tab,
  icon,
  label,
  active,
  onPress,
}: {
  tab: DialTab;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  active: boolean;
  onPress: (tab: DialTab) => void;
}) {
  return (
    <TouchableOpacity style={styles.dialIconContainer} activeOpacity={0.6} onPress={() => onPress(tab)}>
      <Ionicons name={icon} size={24} color={active ? '#A63A2F' : '#6B645C'} />
      <Text style={[styles.dialIconLabel, active && styles.dialIconLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ChakanaDial({ activeTab, onTabPress, onCenterPress }: ChakanadialProps) {
  const insets = useSafeAreaInsets();
  const handleTab = (tab: DialTab) => onTabPress?.(tab);

  const left  = TABS.slice(0, 2);
  const right = TABS.slice(2);

  return (
    <View style={[styles.dialContainer, { bottom: insets.bottom + 18 }]}>
      <View style={styles.dialGlass}>
        {left.map(t => (
          <DialIcon key={t.tab} {...t} active={activeTab === t.tab} onPress={handleTab} />
        ))}
        <View style={{ width: 72 }} />
        {right.map(t => (
          <DialIcon key={t.tab} {...t} active={activeTab === t.tab} onPress={handleTab} />
        ))}
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
    width: 48,
  },
  dialIconLabel: {
    fontSize: 9.5,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: '#6B645C',
  },
  dialIconLabelActive: {
    color: '#A63A2F',
  },
});
