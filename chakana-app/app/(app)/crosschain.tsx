import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import CrosschainAurioCard from '../../components/crosschain/CrosschainAurioCard';
import CrosschainRouteSummary from '../../components/crosschain/CrosschainRouteSummary';
import CrosschainInfoCard from '../../components/crosschain/CrosschainInfoCard';
import {
  getDemoAurioWalletState,
  getAurioWalletState,
  prepareTambuAurioPayment,
  type AurioPaymentPreparation,
  type AurioWalletState,
} from '../../src/services/aurioCrosschainService';
import { getAurioOnboardingRoute } from '../../src/services/crosschainAurioService';
import { useAuth } from '../../src/hooks/useAuth';
import { useWallet } from '../../src/hooks/useWallet';
import {
  SOLANA_CHAIN_ID,
  SOLANA_USDC_ADDRESS,
  type CrosschainRouteRequest,
  type CrosschainRouteResult,
} from '../../src/types/crosschain';
import {
  getCrosschainDestinationWallet,
  shortenAddress,
  type CrosschainDestinationWallet,
} from '../../src/utils/walletFormat';

const DEMO_SOURCE = {
  chainId: 137 as const,
  tokenAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  tokenDecimals: 6,
  amount: '10',
  networkName: 'Polygon',
  tokenSymbol: 'USDC',
};

const DEMO_SOURCE_WALLET = '0x000000000000000000000000000000000000dEaD';
const DEMO_AURIO_PAYMENT_AMOUNT = 1;

export default function CrosschainAurioScreen() {
  const router = useRouter();
  const { isDemoMode } = useAuth();
  const { walletPubKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState<CrosschainRouteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<CrosschainRouteRequest | null>(null);
  const [lastQueriedAt, setLastQueriedAt] = useState<string | null>(null);
  const [aurioState, setAurioState] = useState<AurioWalletState | null>(null);
  const [isAurioLoading, setIsAurioLoading] = useState(false);
  const [aurioError, setAurioError] = useState<string | null>(null);
  const [paymentPreparation, setPaymentPreparation] = useState<AurioPaymentPreparation | null>(null);
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);
  const destinationWallet = getCrosschainDestinationWallet(
    isDemoMode ? null : walletPubKey,
    process.env.EXPO_PUBLIC_QA_PAYOUT_WALLET,
  );

  const handleRefreshAurioState = useCallback(async () => {
    setIsAurioLoading(true);
    setAurioError(null);

    try {
      const state = await getAurioWalletState(destinationWallet.address);
      setAurioState(state);
    } catch (err) {
      console.warn('[crosschain] Aurio balance lookup failed:', err);
      setAurioState(getDemoAurioWalletState(destinationWallet.address));
      setAurioError('Balance demo activo para APK.');
    } finally {
      setIsAurioLoading(false);
    }
  }, [destinationWallet.address]);

  useEffect(() => {
    setPaymentPreparation(null);
    void handleRefreshAurioState();
  }, [handleRefreshAurioState]);

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
        toWalletAddress: destinationWallet.address,
      });
      setLastRequest(result.request);
      setLastQueriedAt(result.queriedAt);
      setRoute(result);
    } catch (err) {
      console.warn('[crosschain] Unexpected LI.FI route failure:', err);
      setError('No pudimos obtener una ruta ahora. Inténtalo nuevamente en un momento.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayTambu = () => {
    setIsPreparingPayment(true);
    setPaymentPreparation(null);

    prepareTambuAurioPayment({
      senderWallet: walletPubKey,
      walletSource: destinationWallet.source,
      tambuMint: process.env.EXPO_PUBLIC_QA_TAMBU_MINT,
      amount: DEMO_AURIO_PAYMENT_AMOUNT,
    })
      .then(setPaymentPreparation)
      .catch((err) => {
        console.warn('[crosschain] Aurio payment preparation failed:', err);
        setPaymentPreparation({
          status: 'error',
          message: 'No pudimos preparar el pago Aurio.',
        });
      })
      .finally(() => setIsPreparingPayment(false));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#3D3D3D" />
          </TouchableOpacity>
          <View style={styles.headerBadges}>
            {isDemoMode ? (
              <View style={styles.demoHeaderBadge}>
                <Text style={styles.demoHeaderText}>Modo demo</Text>
              </View>
            ) : null}
            <View style={styles.headerBadge}>
              <Text style={styles.badgeText}>Powered by LI.FI</Text>
            </View>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>Entrar a CHAKANA desde cualquier red</Text>
          <Text style={styles.subtitle}>
            Convierte valor cross-chain en participación local con Aurio.
          </Text>
          <View style={styles.narrativeBox}>
            <Text style={styles.narrativeText}>Crypto global -&gt; impacto local</Text>
          </View>
          {isDemoMode ? (
            <View style={styles.safeDemoBox}>
              <Text style={styles.safeDemoText}>
                Demo segura: no se firman transacciones ni se mueven fondos reales.
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.flowStrip}>
          <FlowStep index="01" text="Trae valor desde Polygon con LI.FI" />
          <FlowStep index="02" text="Recíbelo en Solana" />
          <FlowStep index="03" text="Úsalo con Aurio en Tambús" />
        </View>

        <View style={styles.cardsRow}>
          <CrosschainAurioCard
            type="source"
            network={DEMO_SOURCE.networkName}
            token={DEMO_SOURCE.tokenSymbol}
            amount={`${DEMO_SOURCE.amount} ${DEMO_SOURCE.tokenSymbol}`}
          />
          <CrosschainAurioCard
            type="destination"
            network="Solana"
            token={route ? route.destinationToken : 'USDC'}
            wallet={shortenAddress(destinationWallet.address)}
            walletBadge={destinationWallet.label}
          />
        </View>

        <CrosschainInfoCard />
        <CrosschainRouteSummary route={route} isLoading={isLoading} error={error} />
        <AurioStateCard
          aurioState={aurioState}
          destinationWallet={destinationWallet}
          isLoading={isAurioLoading}
          error={aurioError}
          onRefresh={handleRefreshAurioState}
        />
        <DemoRoutePanel
          route={route}
          request={lastRequest}
          queriedAt={lastQueriedAt}
          destinationWallet={destinationWallet}
        />

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
                disabled={isPreparingPayment}
              >
                <Text style={styles.primaryButtonText}>
                  {isPreparingPayment ? 'Preparando Aurio...' : 'Pagar a Tambú con Aurios'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.nextStepText}>
                {destinationWallet.source === 'connected'
                  ? 'Quote listo. Aurio prepara el pago sin firmarlo.'
                  : 'Modo demo: conecta una wallet para preparar un pago real.'}
              </Text>
              {paymentPreparation ? (
                <PreparationStatus preparation={paymentPreparation} />
              ) : null}

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

function AurioStateCard({
  aurioState,
  destinationWallet,
  isLoading,
  error,
  onRefresh,
}: {
  aurioState: AurioWalletState | null;
  destinationWallet: CrosschainDestinationWallet;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}) {
  const status = error ? 'error' : aurioState ? 'listo' : 'sin wallet';

  return (
    <View style={styles.aurioCard}>
      <View style={styles.aurioHeader}>
        <View style={styles.aurioHeading}>
          <Text style={styles.sectionTitle}>Estado Aurio</Text>
          <Text style={styles.sectionCopy}>
            Aurio conecta el valor recibido con Tambús, recompensas e impacto local.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.secondaryButton, isLoading && styles.disabledButton]}
          onPress={onRefresh}
          activeOpacity={0.75}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>{isLoading ? 'Leyendo...' : 'Refrescar'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.aurioStats}>
        <AurioStat
          label="Balance AUR"
          value={aurioState ? `${formatBalance(aurioState.aurBalance)} AUR` : 'Pendiente'}
        />
        <AurioStat
          label="SOL"
          value={aurioState?.solBalance === undefined ? 'No disponible' : `${formatBalance(aurioState.solBalance)} SOL`}
        />
        <AurioStat label="Tipo" value={destinationWallet.label} />
      </View>

      <View style={styles.walletLine}>
        <Text style={styles.walletLineText}>{shortenAddress(destinationWallet.address)}</Text>
        <Text style={styles.walletLineMeta}>{status}</Text>
      </View>

      <Text style={styles.updatedText}>
        {aurioState ? `Actualizado ${new Date(aurioState.updatedAt).toLocaleString()}` : 'Sin lectura reciente'}
      </Text>

      {error ? <Text style={styles.inlineError}>{error}</Text> : null}
    </View>
  );
}

function AurioStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.aurioStat}>
      <Text style={styles.aurioStatLabel}>{label}</Text>
      <Text style={styles.aurioStatValue}>{value}</Text>
    </View>
  );
}

function PreparationStatus({ preparation }: { preparation: AurioPaymentPreparation }) {
  const isPrepared = preparation.status === 'prepared';

  return (
    <View style={[styles.preparationBox, isPrepared && styles.preparedBox]}>
      <Text style={[styles.preparationTitle, isPrepared && styles.preparedTitle]}>
        {isPrepared ? 'Transacción Aurio preparada' : 'Preparación Aurio'}
      </Text>
      <Text style={styles.preparationText}>{preparation.message}</Text>
      {preparation.preparedAt ? (
        <Text style={styles.preparationMeta}>
          {new Date(preparation.preparedAt).toLocaleString()} - {preparation.amount} AUR
        </Text>
      ) : null}
    </View>
  );
}

function formatBalance(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(4);
}

function DemoRoutePanel({
  route,
  request,
  queriedAt,
  destinationWallet,
}: {
  route: CrosschainRouteResult | null;
  request: CrosschainRouteRequest | null;
  queriedAt: string | null;
  destinationWallet: CrosschainDestinationWallet;
}) {
  const displayRequest = request ?? {
    fromChainId: DEMO_SOURCE.chainId,
    fromTokenAddress: DEMO_SOURCE.tokenAddress,
    fromAmount: DEMO_SOURCE.amount,
    fromTokenDecimals: DEMO_SOURCE.tokenDecimals,
    toChainId: SOLANA_CHAIN_ID,
    toTokenAddress: SOLANA_USDC_ADDRESS,
    fromAddress: DEMO_SOURCE_WALLET,
    toAddress: destinationWallet.address,
  };

  return (
    <View style={styles.demoPanel}>
      <View style={styles.demoPanelHeader}>
        <Text style={styles.demoPanelTitle}>Consulta de demo</Text>
        <View style={styles.demoSourcePill}>
          <Text style={styles.demoSourceText}>{route?.source ?? 'pendiente'}</Text>
        </View>
      </View>

      <Text style={styles.demoSummary}>
        Polygon USDC {displayRequest.fromAmount} -&gt; Solana USDC
      </Text>
      <Text style={styles.demoWallets}>
        {shortenAddress(displayRequest.fromAddress ?? '')} -&gt; {shortenAddress(displayRequest.toAddress ?? '')}
      </Text>
      <Text style={styles.demoTimestamp}>
        {queriedAt ? new Date(queriedAt).toLocaleString() : 'Sin consulta'}
      </Text>
    </View>
  );
}

function FlowStep({ index, text }: { index: string; text: string }) {
  return (
    <View style={styles.flowStep}>
      <Text style={styles.flowIndex}>{index}</Text>
      <Text style={styles.flowText}>{text}</Text>
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
    paddingBottom: 176,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerBadges: {
    alignItems: 'flex-end',
    gap: 6,
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
  demoHeaderBadge: {
    backgroundColor: '#F7E7E3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  demoHeaderText: {
    color: '#9E392D',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  hero: {
    marginBottom: 18,
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
  safeDemoBox: {
    backgroundColor: '#F8F3EE',
    borderRadius: 10,
    marginTop: 10,
    padding: 12,
  },
  safeDemoText: {
    color: '#6F6861',
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 18,
  },
  flowStrip: {
    backgroundColor: '#F8F3EE',
    borderRadius: 10,
    padding: 14,
    gap: 10,
    marginBottom: 14,
  },
  flowStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flowIndex: {
    color: '#9E392D',
    fontSize: 11,
    fontWeight: '800',
    width: 24,
  },
  flowText: {
    color: '#3D3D3D',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  cardsRow: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: 10,
  },
  demoPanel: {
    backgroundColor: '#F8F3EE',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },
  demoPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  demoPanelTitle: {
    fontSize: 13,
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
  demoSummary: {
    color: '#3D3D3D',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  demoWallets: {
    color: '#6F6861',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  demoTimestamp: {
    color: '#8A8580',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
  },
  aurioCard: {
    backgroundColor: '#FCF9F6',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  aurioHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  aurioHeading: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3D3D3D',
    marginBottom: 4,
  },
  sectionCopy: {
    fontSize: 13,
    color: '#8A8580',
    lineHeight: 18,
  },
  aurioStats: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  aurioStat: {
    flex: 1,
    backgroundColor: '#F8F3EE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  aurioStatLabel: {
    color: '#8A8580',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  aurioStatValue: {
    color: '#3D3D3D',
    fontSize: 13,
    fontWeight: '800',
  },
  walletLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  walletLineText: {
    color: '#3D3D3D',
    fontSize: 13,
    fontWeight: '700',
  },
  walletLineMeta: {
    color: '#2F7D72',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  updatedText: {
    color: '#8A8580',
    fontSize: 11,
    marginTop: 6,
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#F8F3EE',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: '#9E392D',
    fontSize: 13,
    fontWeight: '700',
  },
  inlineError: {
    color: '#9E392D',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 12,
  },
  preparationBox: {
    backgroundColor: '#F8F3EE',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    width: '100%',
  },
  preparedBox: {
    backgroundColor: '#DDEEEB',
  },
  preparationTitle: {
    color: '#3D3D3D',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  preparedTitle: {
    color: '#2F7D72',
  },
  preparationText: {
    color: '#6F6861',
    fontSize: 13,
    lineHeight: 18,
  },
  preparationMeta: {
    color: '#2F7D72',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  footer: {
    marginTop: 4,
    paddingBottom: 28,
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
    marginTop: 2,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 10,
    marginBottom: 18,
    padding: 8,
  },
  resetButtonText: {
    fontSize: 13,
    color: '#9E392D',
    textDecorationLine: 'underline',
  },
});
