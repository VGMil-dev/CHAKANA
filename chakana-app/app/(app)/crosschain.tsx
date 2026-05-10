import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import CrosschainAurioCard from '../../components/crosschain/CrosschainAurioCard';
import CrosschainRouteSummary from '../../components/crosschain/CrosschainRouteSummary';
import CrosschainInfoCard from '../../components/crosschain/CrosschainInfoCard';
import { getAurioOnboardingRoute } from '../../src/services/crosschainAurioService';
import {
  SOLANA_CHAIN_ID,
  SOLANA_USDC_ADDRESS,
  type CrosschainRouteRequest,
  type CrosschainRouteResult,
} from '../../src/types/crosschain';

const DEMO_SOURCE = {
  chainId: 137 as const,
  tokenAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  tokenDecimals: 6,
  amount: '10',
  networkName: 'Polygon',
  tokenSymbol: 'USDC',
};

const DEMO_SOURCE_WALLET = '0x000000000000000000000000000000000000dEaD';
const DEMO_SOLANA_DESTINATION_WALLET =
  process.env.EXPO_PUBLIC_QA_PAYOUT_WALLET ?? '7NvESrvRtuEzUUZ1E7qErKTd5uXEkygMxadjbnWFvyZb';

function shortenAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export default function CrosschainAurioScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState<CrosschainRouteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<CrosschainRouteRequest | null>(null);
  const [lastQueriedAt, setLastQueriedAt] = useState<string | null>(null);

  const handleSearchRoute = async () => {
    setIsLoading(true);
    setError(null);
    setRoute(null);

    try {
      const result = await getAurioOnboardingRoute({
        fromChainId: DEMO_SOURCE.chainId,
        fromTokenAddress: DEMO_SOURCE.tokenAddress,
        fromTokenDecimals: DEMO_SOURCE.tokenDecimals,
        fromAmount: DEMO_SOURCE.amount,
        fromWalletAddress: DEMO_SOURCE_WALLET,
        toWalletAddress: DEMO_SOLANA_DESTINATION_WALLET,
      });
      setLastRequest(result.request);
      setLastQueriedAt(result.queriedAt);
      setRoute(result);
    } catch (err) {
      console.warn('[crosschain] Unexpected LI.FI route failure:', err);
      setError('No pudimos obtener una ruta ahora. Intentalo nuevamente en un momento.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayTambu = () => {
    console.log('TODO: pay to Tambu with Aurio SDK');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#3D3D3D" />
          </TouchableOpacity>
          <View style={styles.headerBadge}>
            <Text style={styles.badgeText}>Powered by LI.FI</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>Entrar a CHAKANA desde cualquier red</Text>
          <Text style={styles.subtitle}>
            Convierte valor cross-chain en participacion local con Aurio.
          </Text>
          <View style={styles.narrativeBox}>
            <Text style={styles.narrativeText}>Crypto global -&gt; impacto local</Text>
          </View>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.cardWrapper}>
            <CrosschainAurioCard
              type="source"
              network={DEMO_SOURCE.networkName}
              token={DEMO_SOURCE.tokenSymbol}
              amount={`${DEMO_SOURCE.amount} ${DEMO_SOURCE.tokenSymbol}`}
            />
          </View>
          <View style={styles.cardWrapper}>
            <CrosschainAurioCard
              type="destination"
              network="Solana"
              token={route ? route.destinationToken : 'USDC'}
              wallet={shortenAddress(DEMO_SOLANA_DESTINATION_WALLET)}
            />
          </View>
        </View>

        <CrosschainInfoCard />
        <CrosschainRouteSummary route={route} isLoading={isLoading} error={error} />
        <DemoRoutePanel route={route} request={lastRequest} queriedAt={lastQueriedAt} />

        <View style={styles.footer}>
          {!route ? (
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.disabledButton]}
              activeOpacity={0.8}
              onPress={handleSearchRoute}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Consultando LI.FI...' : 'Buscar ruta con LI.FI'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.readyActions}>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={handlePayTambu}
              >
                <Text style={styles.primaryButtonText}>Pagar a Tambu con Aurios</Text>
              </TouchableOpacity>
              <Text style={styles.nextStepText}>Proximo paso: conectar Aurio SDK</Text>

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

function DemoRoutePanel({
  route,
  request,
  queriedAt,
}: {
  route: CrosschainRouteResult | null;
  request: CrosschainRouteRequest | null;
  queriedAt: string | null;
}) {
  const displayRequest = request ?? {
    fromChainId: DEMO_SOURCE.chainId,
    fromTokenAddress: DEMO_SOURCE.tokenAddress,
    fromAmount: DEMO_SOURCE.amount,
    fromTokenDecimals: DEMO_SOURCE.tokenDecimals,
    toChainId: SOLANA_CHAIN_ID,
    toTokenAddress: SOLANA_USDC_ADDRESS,
    fromAddress: DEMO_SOURCE_WALLET,
    toAddress: DEMO_SOLANA_DESTINATION_WALLET,
  };

  return (
    <View style={styles.demoPanel}>
      <View style={styles.demoPanelHeader}>
        <Text style={styles.demoPanelTitle}>Consulta de demo</Text>
        <View style={styles.demoSourcePill}>
          <Text style={styles.demoSourceText}>{route?.source ?? 'pendiente'}</Text>
        </View>
      </View>

      <View style={styles.demoGrid}>
        <DemoField label="Source" value={route?.source ?? 'real | mock'} />
        <DemoField
          label="Request"
          value={`Polygon USDC ${displayRequest.fromAmount} -> Solana USDC`}
        />
        <DemoField
          label="Wallets"
          value={`${shortenAddress(displayRequest.fromAddress ?? '')} -> ${shortenAddress(displayRequest.toAddress ?? '')}`}
        />
        <DemoField
          label="Timestamp"
          value={queriedAt ? new Date(queriedAt).toLocaleString() : 'Sin consulta'}
        />
      </View>
    </View>
  );
}

function DemoField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.demoField}>
      <Text style={styles.demoLabel}>{label}</Text>
      <Text style={styles.demoValue}>{value}</Text>
    </View>
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
    borderRadius: 999,
  },
  badgeText: {
    color: '#FCF9F6',
    fontSize: 12,
    fontWeight: '700',
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
    borderRadius: 10,
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
  demoPanel: {
    backgroundColor: '#F8F3EE',
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
  },
  demoPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  demoPanelTitle: {
    fontSize: 14,
    color: '#3D3D3D',
    fontWeight: '700',
  },
  demoSourcePill: {
    backgroundColor: '#E8E4DF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  demoSourceText: {
    color: '#6F6861',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  demoGrid: {
    gap: 10,
  },
  demoField: {
    gap: 2,
  },
  demoLabel: {
    fontSize: 11,
    color: '#9E392D',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  demoValue: {
    fontSize: 13,
    color: '#3D3D3D',
    lineHeight: 18,
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
    color: '#FCF9F6',
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
