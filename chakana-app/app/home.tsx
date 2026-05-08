import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function Home() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState('Café');
  const cats = ['Todos', 'Café', 'Arte', 'Mercado', 'Talleres', 'Ferias', 'Pan'];
  const tambus = [
    { name:'Tambu San Sebastián',   barrio:'San Sebastián · 0.4 km', cat:'CAFÉ',   tone:'clay',   rating: 4.9, n: 312, aurios: 12 },
    { name:'Hilos de Susudel',      barrio:'El Vado · 1.1 km',       cat:'TEXTIL', tone:'weave',  rating: 4.8, n: 187, aurios: 18 },
    { name:'Panadería Vieja Plaza', barrio:'Centro · 0.6 km',        cat:'PAN',    tone:'ember',  rating: 4.7, n: 421, aurios: 8  },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header — greeting + balance */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>MR</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerEyebrow}>BUEN DÍA · CUENCA</Text>
          <Text style={styles.headerTitle}>Hola, Mateo.</Text>
        </View>
        <BalancePill amount={2840}/>
      </View>

      {/* Eyebrow + display title */}
      <View style={styles.displaySection}>
        <Text style={styles.displayEyebrow}>01 · MERCADO</Text>
        <Text style={styles.displayTitle}>
          Tambus que{'\n'}
          <Text style={{ color:'#A63A2F' }}>laten hoy.</Text>
        </Text>
      </View>

      {/* Filter chips */}
      <View style={styles.chipsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
          {cats.map(c => (
            <Chip key={c} label={c} active={c === active} onClick={() => setActive(c)}/>
          ))}
        </ScrollView>
      </View>

      {/* Feed */}
      <ScrollView contentContainerStyle={styles.feedContainer} showsVerticalScrollIndicator={false}>
        {tambus.map((t, i) => <TambuCard key={t.name} {...t} featured={i === 0}/>)}

        <View style={styles.cycleNote}>
          <Text style={styles.cycleNoteTitle}>· EL CICLO ·</Text>
          <Text style={styles.cycleNoteText}>Cada compra siembra. Cada reseña riega.</Text>
        </View>
      </ScrollView>

      {/* Floating radial Chakana nav (non-conventional) */}
      <ChakanaDial />
    </View>
  );
}

function BalancePill({ amount }: { amount: number }) {
  return (
    <LinearGradient
      colors={['#F1E0CC', '#E8C99B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balancePill}
    >
      <LinearGradient
        colors={['#FBE6BA', '#C97A3A', '#8C4A1E']}
        start={{ x: 0.35, y: 0.3 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceIcon}
      />
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.balanceLabel}>AURIOS</Text>
        <Text style={styles.balanceAmount}>{amount.toLocaleString('es')}</Text>
      </View>
    </LinearGradient>
  );
}

function Chip({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onClick}
      style={[
        styles.chip,
        active ? styles.chipActive : styles.chipInactive,
        !active && styles.chipShadow
      ]}
    >
      <Text style={[
        styles.chipText,
        active ? styles.chipTextActive : styles.chipTextInactive
      ]}>{label}</Text>
    </TouchableOpacity>
  );
}

function TambuImg({ tone, label, height }: { tone: string, label: string, height: number }) {
  // Map tone to a background color
  const bgColors: { [key: string]: string } = {
    clay: '#D4A373',
    weave: '#7B9071',
    ember: '#9E392D',
  };
  const bgColor = bgColors[tone] || '#D4A373';
  return (
    <View style={[{ height, backgroundColor: bgColor }, styles.tambuImgContainer]}>
      <View style={styles.tambuImgLabelContainer}>
        <Text style={styles.tambuImgLabel}>{label}</Text>
      </View>
    </View>
  );
}

function TambuCard({ name, barrio, cat, tone, rating, n, aurios, featured }: any) {
  return (
    <View style={styles.card}>
      <TambuImg tone={tone} label={cat} height={featured ? 168 : 130} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.cardName}>{name}</Text>
            <View style={styles.cardLocation}>
              <Ionicons name="location-outline" size={12} color="#6B645C" />
              <Text style={styles.cardLocationText}>{barrio}</Text>
            </View>
          </View>
          <View style={styles.cardRating}>
            <Ionicons name="star" size={12} color="#A63A2F" />
            <Text style={styles.cardRatingValue}>{rating}</Text>
            <Text style={styles.cardRatingCount}>· {n}</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={styles.cardReward}>
            <View style={styles.cardRewardDot} />
            <Text style={styles.cardRewardText}>devuelve hasta {aurios}% en Aurios</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color="#6B645C" />
        </View>
      </View>
    </View>
  );
}

function ChakanaDial() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.dialContainer, { bottom: insets.bottom + 18 }]}>
      {/* Glass bar */}
      <BlurView intensity={80} tint="light" style={styles.dialGlass}>
        <DialIcon icon={<Ionicons name="home-outline" size={20} color="#6B645C" />} label="HOY" />
        <DialIcon icon={<Ionicons name="sync-outline" size={20} color="#6B645C" />} label="CICLO" />
        <View style={{ width: 64 }} />
        <DialIcon icon={<Ionicons name="person-outline" size={20} color="#6B645C" />} label="YO" />
        <DialIcon icon={<Ionicons name="notifications-outline" size={20} color="#6B645C" />} label="ECO" />
      </BlurView>

      {/* Center Chakana button */}
      <View style={styles.dialCenterWrapper}>
        <LinearGradient
          colors={['#C5836F', '#A63A2F', '#6E1C13']}
          start={{ x: 0.35, y: 0.3 }}
          end={{ x: 1, y: 1 }}
          style={styles.dialCenterButton}
        >
          <Image source={require('../assets/images/splash-icon.png')} style={styles.dialCenterIcon} />
        </LinearGradient>
      </View>
    </View>
  );
}

function DialIcon({ icon, label }: { icon: any, label: string }) {
  return (
    <TouchableOpacity style={styles.dialIconContainer} activeOpacity={0.6}>
      {icon}
      <Text style={styles.dialIconLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8DFD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B645C',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerEyebrow: {
    fontSize: 11,
    color: '#9A938A',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 18,
    color: '#2E2A26',
    letterSpacing: -0.1,
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 999,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  balanceIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  balanceLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: '#86231A',
    fontWeight: '600',
  },
  balanceAmount: {
    fontWeight: '700',
    fontSize: 14,
    color: '#5A1812',
    marginTop: 2,
  },
  displaySection: {
    paddingHorizontal: 22,
    paddingTop: 4,
    paddingBottom: 14,
  },
  displayEyebrow: {
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 2.2,
    color: '#A63A2F',
    textTransform: 'uppercase',
  },
  displayTitle: {
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 28,
    color: '#2E2A26',
    letterSpacing: -0.5,
    marginTop: 6,
  },
  chipsWrapper: {
    marginBottom: 14,
  },
  chipsContainer: {
    paddingHorizontal: 22,
    gap: 8,
  },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#2E2A26',
  },
  chipInactive: {
    backgroundColor: '#FFFFFF',
  },
  chipShadow: {
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  chipText: {
    fontSize: 12,
  },
  chipTextActive: {
    color: '#FDFAF7',
    fontWeight: '600',
  },
  chipTextInactive: {
    color: '#3D3D3D',
    fontWeight: '500',
  },
  feedContainer: {
    paddingHorizontal: 22,
    paddingBottom: 110,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  tambuImgContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  tambuImgLabelContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(46, 42, 38, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tambuImgLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardContent: {
    paddingTop: 12,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardName: {
    fontWeight: '600',
    fontSize: 15.5,
    color: '#2E2A26',
    letterSpacing: -0.1,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  cardLocationText: {
    color: '#6B645C',
    fontSize: 11.5,
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#F8F3EE',
  },
  cardRatingValue: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#2E2A26',
  },
  cardRatingCount: {
    fontSize: 11,
    color: '#6B645C',
  },
  cardFooter: {
    marginTop: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(140,133,123,0.18)',
    borderStyle: 'dashed',
  },
  cardReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardRewardDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3AAFA9',
  },
  cardRewardText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#3D3D3D',
  },
  cycleNote: {
    marginTop: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F8F3EE',
    alignItems: 'center',
  },
  cycleNoteTitle: {
    color: '#A63A2F',
    fontWeight: '600',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontSize: 9.5,
    marginBottom: 4,
  },
  cycleNoteText: {
    fontSize: 11,
    color: '#6B645C',
    textAlign: 'center',
    lineHeight: 18,
  },
  dialContainer: {
    position: 'absolute',
    left: '50%',
    width: 320,
    transform: [{ translateX: -160 }],
    height: 64,
    zIndex: 20,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  dialGlass: {
    position: 'absolute',
    top: 12,
    bottom: 12,
    left: 0,
    right: 0,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(140,133,123,0.10)',
    overflow: 'hidden',
  },
  dialCenterWrapper: {
    position: 'absolute',
    left: '50%',
    top: 0,
    width: 64,
    height: 64,
    transform: [{ translateX: -32 }],
    borderRadius: 32,
    backgroundColor: '#FDFAF7',
    padding: 4,
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
    width: 24,
    height: 24,
    tintColor: '#FDFAF7',
    resizeMode: 'contain',
  },
  dialIconContainer: {
    alignItems: 'center',
    gap: 2,
    width: 44,
  },
  dialIconLabel: {
    fontSize: 8.5,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontWeight: '600',
    color: '#6B645C',
  },
});
