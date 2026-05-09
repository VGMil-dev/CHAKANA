import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../../src/hooks/useWallet';
import ChakanaDial from '../../components/core/ChakanaDial';
import EmbajadorView from '../../components/perfil/EmbajadorView';
import TambuView from '../../components/perfil/TambuView';

function initials(name: string) {
  return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function truncateWallet(address?: string) {
  if (!address || address === 'phantom_placeholder') return null;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function Perfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { authEmail, signOut } = useAuth();
  const { walletPubKey } = useWallet();

  const role = 'embajador';
  const isEmbajador = role === 'embajador';
  const displayName = authEmail?.split('@')[0] ?? 'Embajador';
  const wallet = truncateWallet(walletPubKey ?? undefined);

  const handleLogout = () => {
    signOut();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
      >
        {/* Nav bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#6B645C" />
          </TouchableOpacity>
          <Text style={styles.navEyebrow}>· PERFIL ·</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Identity */}
        <View style={styles.identityBlock}>
          <View style={styles.identityLeft}>
            <Text style={[styles.roleEyebrow, isEmbajador ? styles.roleEyebrowRed : styles.roleEyebrowTeal]}>
              {isEmbajador ? '· EMBAJADOR · CUENCA ·' : '· TAMBU · CUENCA ·'}
            </Text>
            <Text style={styles.displayName}>{displayName}</Text>
            {wallet && (
              <View style={styles.walletPill}>
                <Ionicons name="wallet-outline" size={12} color="#9A938A" />
                <Text style={styles.walletText}>{wallet}</Text>
              </View>
            )}
            {authEmail && !wallet && (
              <Text style={styles.emailText}>{authEmail}</Text>
            )}
          </View>
          <View style={[styles.avatar, isEmbajador ? styles.avatarRed : styles.avatarTeal]}>
            <Text style={styles.avatarText}>{initials(displayName)}</Text>
          </View>
        </View>

        {isEmbajador ? <EmbajadorView /> : <TambuView />}

        {/* Cuenta */}
        <View style={styles.sectionBase}>
          <Text style={styles.eyebrow}>CUENTA</Text>
          {authEmail && (
            <View style={styles.accountRow}>
              <Ionicons name="mail-outline" size={15} color="#9A938A" />
              <Text style={styles.accountText}>{authEmail}</Text>
            </View>
          )}
          <View style={styles.accountRow}>
            <Ionicons name="location-outline" size={15} color="#9A938A" />
            <Text style={styles.accountText}>Cuenca, Ecuador</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout} activeOpacity={0.6}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <ChakanaDial
        activeTab="yo"
        onTabPress={(tab) => { if (tab === 'home') router.replace('/home'); }}
        onCenterPress={() => router.replace(isEmbajador ? '/home' : '/dashboard')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB' },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  navEyebrow: {
    fontSize: 10, fontWeight: '700', letterSpacing: 2, color: '#9A938A', textTransform: 'uppercase',
  },
  identityBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  identityLeft: { flex: 1, paddingRight: 16 },
  roleEyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  roleEyebrowRed:  { color: '#A63A2F' },
  roleEyebrowTeal: { color: '#3AAFA9' },
  displayName: {
    fontSize: 34, fontWeight: '800', color: '#3D3D3D', letterSpacing: -0.5, lineHeight: 38, marginBottom: 12,
  },
  walletPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F0EAE3', alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999,
  },
  walletText: { fontSize: 11, color: '#6B645C', fontWeight: '500' },
  emailText: { fontSize: 13, color: '#9A938A' },
  avatar: {
    width: 64, height: 64, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginTop: 20,
    shadowColor: '#86231A', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 6,
  },
  avatarRed:  { backgroundColor: '#A63A2F' },
  avatarTeal: { backgroundColor: '#3AAFA9' },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#F5F0EB', letterSpacing: 1 },
  eyebrow: {
    fontSize: 10, fontWeight: '700', letterSpacing: 2,
    textTransform: 'uppercase', color: '#A63A2F', marginBottom: 12,
  },
  sectionBase: { paddingHorizontal: 24, paddingVertical: 24 },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  accountText: { fontSize: 14, color: '#6B645C' },
  logoutRow: { alignItems: 'center', paddingVertical: 28 },
  logoutText: { fontSize: 13, color: '#9A938A', fontWeight: '500', textDecorationLine: 'underline' },
});
