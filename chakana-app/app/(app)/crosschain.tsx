import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import CrosschainAurioCard from '../../components/crosschain/CrosschainAurioCard';
import CrosschainRouteSummary from '../../components/crosschain/CrosschainRouteSummary';
import CrosschainInfoCard from '../../components/crosschain/CrosschainInfoCard';
import { getAurioOnboardingRoute } from '../../../src/services/crosschainAurioService';
import type { CrosschainRouteResult } from '../../../src/types/crosschain';

// ─── Mock config for MVP demo ────────────────────────────────────────────────
// TODO (Paso 3): Replace with real wallet + user-selected chain/token
const MOCK_SOURCE = {
  chainId: 137 as const,       // Polygon
  tokenAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // USDC
  tokenDecimals: 6,
  amount: '10',
  networkName: 'Polygon',
  tokenSymbol: 'USDC',
};

const MOCK_WALLET = '8x7K...a91F'; // TODO: replace with real Solana wallet

export default function CrosschainAurioScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState<CrosschainRouteResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearchRoute = async () => {
    setIsLoading(true);
    setError(null);
    setRoute(null);

    try {
      const result = await getAurioOnboardingRoute({
        fromChainId: MOCK_SOURCE.chainId,
        fromTokenAddress: MOCK_SOURCE.tokenAddress,
        fromTokenDecimals: MOCK_SOURCE.tokenDecimals,
        fromAmount: MOCK_SOURCE.amount,
        // TODO: pass real wallet addresses when wallet is connected
      });
      setRoute(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayTambu = () => {
    console.log("TODO: pay to Tambu with Aurio SDK");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#3D3D3D" />
          </TouchableOpacity>
          <View style={styles.headerBadge}>
            <Text style={styles.badgeText}>Powered by LI.FI</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.title}>Entrar a CHAKANA desde cualquier red</Text>
          <Text style={styles.subtitle}>
            Convierte valor cross-chain en participación local con Aurio.
          </Text>
          <View style={styles.narrativeBox}>
            <Text style={styles.narrativeText}>Crypto global → impacto local</Text>
          </View>
        </View>

        {/* Cards */}
        <View style={styles.cardsRow}>
          <View style={styles.cardWrapper}>
            <CrosschainAurioCard
              type="source"
              network={MOCK_SOURCE.networkName}
              token={MOCK_SOURCE.tokenSymbol}
              amount={`${MOCK_SOURCE.amount} ${MOCK_SOURCE.tokenSymbol}`}
            />
          </View>
          <View style={styles.cardWrapper}>
            <CrosschainAurioCard
              type="destination"
              network="Solana"
              token={route ? route.destinationToken : 'USDC / SOL'}
              wallet={MOCK_WALLET}
            />
          </View>
        </View>

        <CrosschainInfoCard />

        {/* Route Summary */}
        <CrosschainRouteSummary route={route} isLoading={isLoading} error={error} />

        {/* Actions */}
        <View style={styles.footer}>
          {!route ? (
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.disabledButton]}
              activeOpacity={0.8}
              onPress={handleSearchRoute}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>Buscar ruta con LI.FI</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.readyActions}>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={handlePayTambu}
              >
                <Text style={styles.primaryButtonText}>Pagar a Tambú con Aurios</Text>
              </TouchableOpacity>
              <Text style={styles.nextStepText}>Próximo paso: conectar Aurio SDK</Text>

              {/* Reset to search again */}
              <TouchableOpacity
                style={styles.resetButton}
                activeOpacity={0.6}
                onPress={() => { setRoute(null); setError(null); }}
              >
                <Text style={styles.resetButtonText}>Buscar otra ruta</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCF9F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadge: {
    backgroundColor: '#3D3D3D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  hero: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D3D3D',
    lineHeight: 34,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#8A8580',
    lineHeight: 22,
    marginBottom: 16,
  },
  narrativeBox: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8E4DF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  narrativeText: {
    color: '#9E392D',
    fontWeight: '700',
    fontSize: 13,
  },
  cardsRow: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 16,
  },
  cardWrapper: {
    width: '100%',
  },
  footer: {
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#9E392D',
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  readyActions: {
    alignItems: 'center',
  },
  nextStepText: {
    fontSize: 13,
    color: '#A09C96',
    marginTop: 8,
  },
  resetButton: {
    marginTop: 16,
    padding: 4,
  },
  resetButtonText: {
    fontSize: 13,
    color: '#9E392D',
    textDecorationLine: 'underline',
  },
});
