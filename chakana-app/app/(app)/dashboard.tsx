import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DashboardHeader from '../../components/dashboard/DashboardHeader';
import WeekDisplayTitle from '../../components/dashboard/WeekDisplayTitle';
import { useBusinesses } from '../../src/hooks/useBusinesses';

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { listaTambus, fetchBusinesses, businessError } = useBusinesses();
  const tambu = listaTambus[0] ?? null;

  useEffect(() => {
    if (listaTambus.length === 0) void fetchBusinesses();
  }, [fetchBusinesses, listaTambus.length]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 96 }]}
        bounces={false}
      >
        <DashboardHeader tambuName={tambu?.name ?? 'Tambú'} />

        <WeekDisplayTitle
          dateRange="Operación"
          title="Datos"
          accentLine="del Tambú."
        />

        {businessError ? <Text style={styles.error}>{businessError}</Text> : null}

        <View style={styles.panel}>
          <Text style={styles.eyebrow}>STRIPE CONNECT</Text>
          <Text style={styles.body}>
            {tambu?.stripe_account_id
              ? 'Cuenta Stripe conectada para cobros.'
              : 'Conecta una cuenta Stripe desde el flujo de onboarding del Tambú.'}
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.eyebrow}>WALLET AURIO</Text>
          <Text style={styles.body}>
            {tambu?.wallet_adress ?? 'Configura wallet_adress en Supabase para redimir Aurios.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB' },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 16,
    gap: 20,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    gap: 8,
  },
  eyebrow: {
    fontSize: 10,
    color: '#A63A2F',
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  body: {
    color: '#3D3D3D',
    fontSize: 14,
    lineHeight: 20,
  },
  error: { color: '#9E392D', fontSize: 13, fontWeight: '600' },
});
