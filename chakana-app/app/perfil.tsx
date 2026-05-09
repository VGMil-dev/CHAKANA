import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/auth';
import ChakanaDial from '../components/core/ChakanaDial';

// ─── helpers ────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function truncateWallet(address?: string) {
  if (!address || address === 'phantom_placeholder') return null;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// ─── sub-components ─────────────────────────────────────────────────────────

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, text }: { icon: React.ComponentProps<typeof Ionicons>['name']; text: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color="#A09C96" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

// ─── role views ─────────────────────────────────────────────────────────────

function EmbajadorView({ user }: { user: NonNullable<ReturnType<typeof useAuthStore>['user']> }) {
  const wallet = truncateWallet(user.walletAddress);
  return (
    <>
      {/* Aurios balance card */}
      <View style={styles.auriosCard}>
        <View style={styles.auriosCardTop}>
          <MaterialCommunityIcons name="rhombus-outline" size={18} color="#C5836F" />
          <Text style={styles.auriosEyebrow}>BALANCE AURIOS</Text>
        </View>
        <Text style={styles.auriosAmount}>2,840</Text>
        <Text style={styles.auriosConversion}>= $28.40 USD en descuentos</Text>
        <View style={styles.auriosDivider} />
        <Text style={styles.auriosNote}>Hasta 25% de descuento por compra</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatPill value="12" label="COMPRAS" />
        <StatPill value="8" label="RESEÑAS" />
        <StatPill value="3" label="PROPINAS" />
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        {user.email && <InfoRow icon="mail-outline" text={user.email} />}
        {wallet && <InfoRow icon="wallet-outline" text={wallet} />}
        <InfoRow icon="location-outline" text="Cuenca, Ecuador" />
      </View>
    </>
  );
}

function TambuView({ user }: { user: NonNullable<ReturnType<typeof useAuthStore>['user']> }) {
  const router = useRouter();
  return (
    <>
      {/* Metrics */}
      <View style={styles.statsRow}>
        <StatPill value="4.9" label="RATING" />
        <StatPill value="+12" label="RESEÑAS" />
        <StatPill value="4,218" label="AURIOS" />
      </View>

      {/* Dashboard CTA */}
      <TouchableOpacity
        style={styles.dashboardButton}
        activeOpacity={0.8}
        onPress={() => router.push('/dashboard')}
      >
        <View style={styles.dashboardButtonLeft}>
          <View style={styles.dashboardIconBox}>
            <Ionicons name="bar-chart-outline" size={20} color="#9E392D" />
          </View>
          <View>
            <Text style={styles.dashboardButtonTitle}>Dashboard semanal</Text>
            <Text style={styles.dashboardButtonSub}>Reseñas, métricas e insights IA</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#A09C96" />
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.infoCard}>
        {user.email && <InfoRow icon="mail-outline" text={user.email} />}
        <InfoRow icon="storefront-outline" text="Café · Cuenca, Ecuador" />
      </View>
    </>
  );
}

// ─── main ────────────────────────────────────────────────────────────────────

export default function Perfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

  const role = user?.role ?? 'embajador';
  const isEmbajador = role === 'embajador';
  const displayName = user?.name ?? 'Embajador';

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#3D3D3D" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Perfil</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Identity */}
        <View style={styles.identitySection}>
          <View style={[styles.avatar, isEmbajador ? styles.avatarEmbajador : styles.avatarTambu]}>
            <Text style={styles.avatarText}>{initials(displayName)}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <View style={[styles.roleBadge, isEmbajador ? styles.roleBadgeEmbajador : styles.roleBadgeTambu]}>
            <Text style={[styles.roleLabel, isEmbajador ? styles.roleLabelEmbajador : styles.roleLabelTambu]}>
              {isEmbajador ? 'EMBAJADOR' : 'TAMBU'}
            </Text>
          </View>
        </View>

        {/* Role-specific content */}
        {isEmbajador
          ? <EmbajadorView user={user ?? { name: displayName }} />
          : <TambuView user={user ?? { name: displayName }} />
        }

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={18} color="#A09C96" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <ChakanaDial
        activeTab="yo"
        onTabPress={(tab) => { if (tab === 'home') router.replace('/home'); }}
      />
    </View>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCF9F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3D3D3D',
    letterSpacing: 0.5,
  },

  // identity
  identitySection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarEmbajador: {
    backgroundColor: '#9E392D',
  },
  avatarTambu: {
    backgroundColor: '#3D3D3D',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F5F0EB',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3D3D3D',
    marginBottom: 10,
  },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
  },
  roleBadgeEmbajador: {
    backgroundColor: '#F7E7E3',
  },
  roleBadgeTambu: {
    backgroundColor: '#E8EDE8',
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  roleLabelEmbajador: {
    color: '#9E392D',
  },
  roleLabelTambu: {
    color: '#3A6B3A',
  },

  // aurios card (Embajador)
  auriosCard: {
    backgroundColor: '#3D3D3D',
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
  },
  auriosCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  auriosEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: '#C5836F',
  },
  auriosAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#F5F0EB',
    lineHeight: 54,
  },
  auriosConversion: {
    fontSize: 13,
    color: '#A09C96',
    marginTop: 2,
    marginBottom: 16,
  },
  auriosDivider: {
    height: 1,
    backgroundColor: '#F5F0EB',
    opacity: 0.1,
    marginBottom: 12,
  },
  auriosNote: {
    fontSize: 12,
    color: '#8A8580',
  },

  // stats row
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statPill: {
    flex: 1,
    backgroundColor: '#FCF9F6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3D3D3D',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: '#A09C96',
  },

  // info card
  infoCard: {
    backgroundColor: '#FCF9F6',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#3D3D3D',
    fontWeight: '500',
  },

  // dashboard CTA (Tambu)
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FCF9F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  dashboardButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dashboardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F7E7E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardButtonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3D3D3D',
    marginBottom: 2,
  },
  dashboardButtonSub: {
    fontSize: 12,
    color: '#A09C96',
  },

  // logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 14,
    color: '#A09C96',
    fontWeight: '600',
  },
});
