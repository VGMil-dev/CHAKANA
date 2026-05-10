import React, { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DashboardHeader from '../../components/dashboard/DashboardHeader';
import WeekDisplayTitle from '../../components/dashboard/WeekDisplayTitle';
import { useAuth } from '../../src/hooks/useAuth';
import { createConnectOnboardingLink } from '../../src/services/commerce';
import { getBusinessesByOwner } from '../../src/services/supabase';
import type { Tables } from '../../src/types/database';

type Business = Tables<'businesses'>;

function openUrl(url: string): void {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.location.href = url;
    return;
  }

  void Linking.openURL(url);
}

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { authUserId } = useAuth();
  const [ownedTambus, setOwnedTambus] = useState<Business[]>([]);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isOpeningStripe, setIsOpeningStripe] = useState(false);
  const tambu = ownedTambus[0] ?? null;

  useEffect(() => {
    if (!authUserId) {
      setOwnedTambus([]);
      return;
    }

    void getBusinessesByOwner(authUserId)
      .then((businesses) => {
        setOwnedTambus(businesses);
        setBusinessError(null);
      })
      .catch((error: unknown) => {
        setOwnedTambus([]);
        setBusinessError(error instanceof Error ? error.message : 'No se pudo cargar tu Tambú.');
      });
  }, [authUserId]);

  const handleConnectStripe = (): void => {
    if (!tambu) {
      setStripeError('No hay un Tambú asociado a tu usuario. Revisa que tu perfil sea Tambú y que businesses.owner_id apunte a tu auth.uid.');
      return;
    }

    setIsOpeningStripe(true);
    setStripeError(null);
    const appUrl = 'chakana://dashboard';

    void createConnectOnboardingLink({
      businessId: tambu.id,
      returnUrl: appUrl,
      refreshUrl: appUrl,
    })
      .then((link) => openUrl(link.url))
      .catch((error: unknown) => {
        setStripeError(error instanceof Error ? error.message : 'No se pudo abrir Stripe Connect.');
      })
      .finally(() => setIsOpeningStripe(false));
  };

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
            {tambu?.stripe_charges_enabled
              ? 'Cuenta Stripe conectada para cobros.'
              : tambu?.stripe_account_id
                ? 'Cuenta Stripe creada. Completa el onboarding para habilitar cobros.'
              : 'Conecta una cuenta Stripe para recibir los cobros de Chakana.'}
          </Text>
          {!tambu ? (
            <Text style={styles.error}>
              No encontramos un Tambú con owner_id de tu usuario. Crea o asigna el negocio antes de conectar Stripe.
            </Text>
          ) : null}
          {stripeError ? <Text style={styles.error}>{stripeError}</Text> : null}
          <Pressable
            accessibilityRole="button"
            testID="stripe-connect-button"
            onPress={handleConnectStripe}
            disabled={!tambu || isOpeningStripe}
            style={({ pressed }) => [
              styles.connectButton,
              (!tambu || isOpeningStripe) ? styles.connectButtonDisabled : null,
              pressed && tambu && !isOpeningStripe ? styles.pressed : null,
            ]}>
            <Text style={styles.connectButtonText}>
              {isOpeningStripe
                ? 'Abriendo Stripe...'
                : tambu?.stripe_account_id && !tambu.stripe_charges_enabled
                  ? 'Continuar onboarding'
                  : 'Conectar Stripe'}
            </Text>
          </Pressable>
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
  connectButton: {
    marginTop: 4,
    minHeight: 44,
    borderRadius: 8,
    backgroundColor: '#A63A2F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  connectButtonDisabled: {
    opacity: 0.5,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: { opacity: 0.8, transform: [{ translateY: 1 }] },
});
