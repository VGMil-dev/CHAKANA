import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

// ─── Cycle Indicator ────────────────────────────────────────────────────────
// Mirrors the 4 arms of the Chakana cross: Compra → Reseña → Gana → Canjea

function CycleIndicator({ activeStep = 3 }: { activeStep?: number }) {
  const steps = ['COMPRA', 'RESEÑA', 'GANA', 'CANJEA'];
  return (
    <View style={cycle.container}>
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <View style={cycle.step}>
            <View style={[cycle.dot, i < activeStep ? cycle.dotActive : cycle.dotInactive]} />
            <Text style={[cycle.label, i < activeStep ? cycle.labelActive : cycle.labelInactive]}>
              {label}
            </Text>
          </View>
          {i < steps.length - 1 && (
            <View style={[cycle.line, i < activeStep - 1 ? cycle.lineActive : cycle.lineInactive]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const cycle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  step: {
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  dotActive: {
    backgroundColor: '#3AAFA9',
  },
  dotInactive: {
    backgroundColor: '#E6E2DD',
  },
  line: {
    flex: 1,
    height: 2,
    marginTop: 4,
    borderRadius: 999,
  },
  lineActive: {
    backgroundColor: '#3AAFA9',
  },
  lineInactive: {
    backgroundColor: '#E6E2DD',
  },
  label: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  labelActive: {
    color: '#3AAFA9',
  },
  labelInactive: {
    color: '#9A938A',
  },
});

// ─── Embajador view ──────────────────────────────────────────────────────────

function EmbajadorView() {
  return (
    <>
      {/* Aurios balance — surface shift, editorial display number */}
      <View style={styles.sectionSurface}>
        <Text style={styles.eyebrow}>BALANCE · AURIOS</Text>
        <Text style={styles.displayNumber}>2,840</Text>
        <Text style={styles.displaySub}>circulan en el ecosistema.</Text>
        <Text style={styles.displayConversion}>= $28.40 en descuentos disponibles</Text>
      </View>

      {/* Ciclo activo */}
      <View style={styles.sectionBase}>
        <Text style={styles.eyebrow}>CICLO ACTIVO</Text>
        <CycleIndicator activeStep={3} />
        <Text style={styles.cycleHint}>
          Publica una reseña para completar el ciclo y ganar más Aurios.
        </Text>
      </View>

      {/* Actividad */}
      <View style={styles.sectionContained}>
        <Text style={styles.eyebrow}>ACTIVIDAD</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>12</Text>
            <Text style={styles.metricLabel}>COMPRAS</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>8</Text>
            <Text style={styles.metricLabel}>RESEÑAS</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>3</Text>
            <Text style={styles.metricLabel}>PROPINAS</Text>
          </View>
        </View>
      </View>
    </>
  );
}

// ─── Tambu view ──────────────────────────────────────────────────────────────

function TambuView() {
  const router = useRouter();
  return (
    <>
      {/* Métricas semanales — surface shift */}
      <View style={styles.sectionSurface}>
        <Text style={styles.eyebrow}>SEMANA · 28 ABR — 04 MAY</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.displayNumberSm}>4.9</Text>
            <Text style={styles.metricLabel}>RATING</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.displayNumberSm}>+12</Text>
            <Text style={styles.metricLabel}>RESEÑAS</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.displayNumberSm}>4.2k</Text>
            <Text style={styles.metricLabel}>AURIOS</Text>
          </View>
        </View>
      </View>

      {/* Dashboard CTA — editorial block */}
      <View style={styles.sectionContained}>
        <Text style={styles.eyebrow}>DASHBOARD SEMANAL</Text>
        <Text style={styles.dashboardTitle}>El pulso{'\n'}del barrio.</Text>
        <TouchableOpacity
          style={styles.dashboardCta}
          activeOpacity={0.7}
          onPress={() => router.push('/dashboard')}
        >
          <Text style={styles.dashboardCtaText}>Ver análisis completo</Text>
          <Ionicons name="arrow-forward" size={14} color="#A63A2F" />
        </TouchableOpacity>
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
  const wallet = truncateWallet(user?.walletAddress);

  const handleLogout = () => {
    logout();
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

        {/* Identity — left-aligned, editorial */}
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
            {user?.email && !wallet && (
              <Text style={styles.emailText}>{user.email}</Text>
            )}
          </View>
          <View style={[styles.avatar, isEmbajador ? styles.avatarRed : styles.avatarTeal]}>
            <Text style={styles.avatarText}>{initials(displayName)}</Text>
          </View>
        </View>

        {/* Role-specific content */}
        {isEmbajador ? <EmbajadorView /> : <TambuView />}

        {/* Cuenta */}
        <View style={styles.sectionBase}>
          <Text style={styles.eyebrow}>CUENTA</Text>
          {user?.email && (
            <View style={styles.accountRow}>
              <Ionicons name="mail-outline" size={15} color="#9A938A" />
              <Text style={styles.accountText}>{user.email}</Text>
            </View>
          )}
          <View style={styles.accountRow}>
            <Ionicons name="location-outline" size={15} color="#9A938A" />
            <Text style={styles.accountText}>Cuenca, Ecuador</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout} activeOpacity={0.6}>
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

  // nav
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#9A938A',
    textTransform: 'uppercase',
  },

  // identity block (left-aligned, avatar floats right)
  identityBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  identityLeft: {
    flex: 1,
    paddingRight: 16,
  },
  roleEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  roleEyebrowRed: {
    color: '#A63A2F',
  },
  roleEyebrowTeal: {
    color: '#3AAFA9',
  },
  displayName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#3D3D3D',
    letterSpacing: -0.5,
    lineHeight: 38,
    marginBottom: 12,
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0EAE3',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  walletText: {
    fontSize: 11,
    color: '#6B645C',
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  emailText: {
    fontSize: 13,
    color: '#9A938A',
    fontWeight: '400',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarRed: {
    backgroundColor: '#A63A2F',
  },
  avatarTeal: {
    backgroundColor: '#3AAFA9',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F5F0EB',
    letterSpacing: 1,
  },

  // section containers — background shifts, no borders
  sectionBase: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionSurface: {
    backgroundColor: '#F8F3EE',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionContained: {
    backgroundColor: '#F0EAE3',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  // eyebrow (section label)
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#A63A2F',
    marginBottom: 12,
  },

  // aurios display
  displayNumber: {
    fontSize: 60,
    fontWeight: '800',
    color: '#3D3D3D',
    letterSpacing: -1,
    lineHeight: 64,
  },
  displayNumberSm: {
    fontSize: 36,
    fontWeight: '800',
    color: '#3D3D3D',
    letterSpacing: -0.5,
  },
  displaySub: {
    fontSize: 14,
    color: '#6B645C',
    marginTop: 4,
    fontWeight: '400',
  },
  displayConversion: {
    fontSize: 12,
    color: '#9A938A',
    marginTop: 4,
  },

  // cycle hint
  cycleHint: {
    fontSize: 12,
    color: '#9A938A',
    marginTop: 16,
    lineHeight: 18,
  },

  // activity / metrics
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metric: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 4,
  },
  metricNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D3D3D',
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: '#9A938A',
    textTransform: 'uppercase',
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#3D3D3D',
    opacity: 0.08,
    marginHorizontal: 16,
  },

  // dashboard cta (Tambu)
  dashboardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D3D3D',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginTop: 4,
    marginBottom: 16,
  },
  dashboardCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  dashboardCtaText: {
    fontSize: 14,
    color: '#A63A2F',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  // account rows
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  accountText: {
    fontSize: 14,
    color: '#6B645C',
    fontWeight: '400',
  },

  // logout
  logoutRow: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  logoutText: {
    fontSize: 13,
    color: '#9A938A',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
