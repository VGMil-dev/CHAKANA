import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import CrosschainAurioCard from '../../components/crosschain/CrosschainAurioCard';
import CrosschainRouteSummary from '../../components/crosschain/CrosschainRouteSummary';
import CrosschainInfoCard from '../../components/crosschain/CrosschainInfoCard';
import {
  getAurioWalletState,
  prepareTambuAurioPayment,
  type AurioPaymentPreparation,
  type AurioWalletState,
} from '../../src/services/aurioCrosschainService';
import { getAurioOnboardingRoute } from '../../src/services/crosschainAurioService';
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
    walletPubKey,
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
      setAurioState(null);
      setAurioError('No pudimos leer el estado Aurio de esta wallet.');
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
      setError('No pudimos obtener una ruta ahora. Intentalo nuevamente en un momento.');
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

        <View style={styles.flowStrip}>
          <FlowStep index="01" text="Trae valor desde Polygon con LI.FI" />
          <FlowStep index="02" text="Recibelo en Solana" />
          <FlowStep index="03" text="Usalo con Aurio en Tambus" />
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
              wallet={shortenAddress(destinationWallet.address)}
              walletBadge={destinationWallet.label}
            />
          </View>
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
                  {isPreparingPayment ? 'Preparando Aurio...' : 'Pagar a Tambu con Aurios'}
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
        <View>
          <Text style={styles.sectionTitle}>Estado Aurio</Text>
          <Text style={styles.sectionCopy}>
            Aurio conecta el valor recibido con Tambus, recompensas e impacto local.
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

      <View style={styles.aurioRows}>
        <DemoField label="Wallet" value={shortenAddress(destinationWallet.address)} />
        <DemoField label="Tipo" value={destinationWallet.label} />
        <DemoField
          label="Balance AUR"
          value={aurioState ? `${formatBalance(aurioState.aurBalance)} AUR` : 'Pendiente'}
        />
        <DemoField
          label="Balance SOL"
          value={aurioState?.solBalance === undefined ? 'No disponible' : `${formatBalance(aurioState.solBalance)} SOL`}
        />
        <DemoField
          label="Actualizado"
          value={aurioState ? new Date(aurioState.updatedAt).toLocaleString() : 'Sin lectura'}
        />
        <DemoField label="Estado" value={status} />
      </View>

      {error ? <Text style={styles.inlineError}>{error}</Text> : null}
    </View>
  );
}

function PreparationStatus({ preparation }: { preparation: AurioPaymentPreparation }) {
  const isPrepared = preparation.status === 'prepared';

  return (
    <View style={[styles.preparationBox, isPrepared && styles.preparedBox]}>
      <Text style={[styles.preparationTitle, isPrepared && styles.preparedTitle]}>
        {isPrepared ? 'Transaccion Aurio preparada' : 'Preparacion Aurio'}
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

      <View style={styles.demoGrid}>
        <DemoField label="Source" value={route?.source ?? 'real | mock'} />
        <DemoField label="Wallet destino" value={destinationWallet.label} />
        <DemoField label="Origen wallet" value={destinationWallet.source} />
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
  flowStrip: {
    backgroundColor: '#F8F3EE',
    borderRadius: 10,
    padding: 14,
    gap: 10,
    marginBottom: 18,
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
  aurioCard: {
    backgroundColor: '#FCF9F6',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  aurioHeader: {
    gap: 12,
    marginBottom: 14,
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
  aurioRows: {
    gap: 10,
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
