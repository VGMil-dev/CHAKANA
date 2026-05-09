import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useCheckout } from '../../src/hooks/useCheckout';
import { useReviewSubmit } from '../../src/hooks/useReviewSubmit';
import { useWallet } from '../../src/hooks/useWallet';
import { useWalletSigner } from '../../src/hooks/useWalletSigner';
import { useAppStore } from '../../src/store';
import { formatAurios, formatUSD } from '../../src/utils/sliderConfig';

const DEMO_BUSINESS_ID = 'raiz-cafe';
const DEMO_TOTAL = 10;
const DEMO_TAMBU_MINT = '';

function shortenWallet(walletPubKey: string): string {
  return `${walletPubKey.slice(0, 4)}...${walletPubKey.slice(-4)}`;
}

export default function Index() {
  const {
    walletPubKey,
    aurioBalance,
    isConnected,
    isConnectingWallet,
    walletError,
    connectWallet,
    disconnectWallet,
    refreshAurioBalance,
  } = useWallet();
  const {
    currentReviewText,
    charsRemaining,
    isSubmittingReview,
    reviewError,
    reviewSuccess,
    onTextChange,
    submitReview,
  } = useReviewSubmit();
  const {
    checkoutTotal,
    auriosToSpend,
    discountResult,
    sliderMax,
    isProcessing,
    checkoutError,
    checkoutSignature,
    setTotal,
    onSliderChange,
    confirmCheckout,
    resetCheckout,
  } = useCheckout();
  const { signTransaction, canSignTransactions, signerError } = useWalletSigner();
  const activeModal = useAppStore((state) => state.activeModal);

  useEffect(() => {
    setTotal(DEMO_TOTAL);
  }, [setTotal]);

  const hasTambuMint = DEMO_TAMBU_MINT.trim().length > 0;
  const canConfirmCheckout =
    hasTambuMint && canSignTransactions && Boolean(signTransaction) && !isProcessing;

  const handleSubmitReview = (): void => {
    void submitReview({ businessId: DEMO_BUSINESS_ID });
  };

  const handleAuriosInput = (text: string): void => {
    const parsedValue = Number.parseInt(text.replace(/\D/g, ''), 10);
    onSliderChange(Number.isNaN(parsedValue) ? 0 : parsedValue);
  };

  const handleConfirmCheckout = (): void => {
    if (!signTransaction || !canConfirmCheckout) return;
    void confirmCheckout({
      tambuMint: DEMO_TAMBU_MINT,
      signTransaction,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chakana</Text>
        <Text style={styles.subtitle}>Prueba de lógica Aurio</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet</Text>
        {isConnected && walletPubKey ? (
          <>
            <Text style={styles.text}>Wallet: {shortenWallet(walletPubKey)}</Text>
            <Text style={styles.balance}>Aurios: {formatAurios(aurioBalance)}</Text>
            <View style={styles.actions}>
              <Pressable
                style={styles.button}
                onPress={refreshAurioBalance}
                disabled={isConnectingWallet}>
                <Text style={styles.buttonText}>Actualizar balance</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.secondaryButton]}
                onPress={disconnectWallet}
                disabled={isConnectingWallet}>
                <Text style={styles.buttonText}>Desconectar</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Pressable style={styles.button} onPress={connectWallet} disabled={isConnectingWallet}>
            <Text style={styles.buttonText}>
              {isConnectingWallet ? 'Conectando...' : 'Conectar wallet'}
            </Text>
          </Pressable>
        )}
        {walletError ? <Text style={styles.error}>{walletError}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reseña</Text>
        <Text style={styles.text}>Cafetería demo: {DEMO_BUSINESS_ID}</Text>
        <TextInput
          style={styles.reviewInput}
          value={currentReviewText}
          onChangeText={onTextChange}
          multiline
          placeholder="Escribe una reseña real de mínimo 50 caracteres"
          placeholderTextColor="#8A8F98"
          editable={!isSubmittingReview}
        />
        <Text style={styles.helper}>
          {currentReviewText.length} caracteres. Mínimo 50 caracteres.
          {charsRemaining > 0 ? ` Faltan ${charsRemaining}.` : ''}
        </Text>
        <Pressable
          style={[styles.button, isSubmittingReview ? styles.disabledButton : null]}
          onPress={handleSubmitReview}
          disabled={isSubmittingReview}>
          <Text style={styles.buttonText}>
            {isSubmittingReview ? 'Enviando...' : 'Enviar reseña'}
          </Text>
        </Pressable>
        {reviewError ? <Text style={styles.error}>{reviewError}</Text> : null}
        {reviewSuccess ? (
          <Text style={styles.success}>Reseña enviada. Recompensa AURIO procesada.</Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Checkout con Aurios</Text>
        <Text style={styles.text}>Total demo: {formatUSD(checkoutTotal)}</Text>
        <Text style={styles.text}>Aurios disponibles: {formatAurios(aurioBalance)}</Text>
        <Text style={styles.text}>Máximo permitido: {formatAurios(sliderMax)}</Text>
        <TextInput
          style={styles.numberInput}
          value={String(auriosToSpend)}
          onChangeText={handleAuriosInput}
          keyboardType="number-pad"
          placeholder="Aurios a gastar"
          placeholderTextColor="#8A8F98"
        />
        <View style={styles.actions}>
          <Pressable style={styles.smallButton} onPress={() => onSliderChange(50)}>
            <Text style={styles.buttonText}>50 Aurios</Text>
          </Pressable>
          <Pressable style={styles.smallButton} onPress={() => onSliderChange(100)}>
            <Text style={styles.buttonText}>100 Aurios</Text>
          </Pressable>
          <Pressable style={styles.smallButton} onPress={() => onSliderChange(sliderMax)}>
            <Text style={styles.buttonText}>Máximo</Text>
          </Pressable>
          <Pressable style={[styles.smallButton, styles.secondaryButton]} onPress={resetCheckout}>
            <Text style={styles.buttonText}>Limpiar</Text>
          </Pressable>
        </View>
        <Text style={styles.helper}>Máximo 25% del total</Text>
        <Text style={styles.text}>Descuento: {formatUSD(discountResult.discountUSD)}</Text>
        <Text style={styles.total}>Total final: {formatUSD(discountResult.finalTotal)}</Text>
        <Pressable
          style={[styles.button, canConfirmCheckout ? null : styles.disabledButton]}
          onPress={handleConfirmCheckout}
          disabled={!canConfirmCheckout}>
          <Text style={styles.buttonText}>
            {isProcessing ? 'Procesando...' : 'Confirmar pago con Aurios'}
          </Text>
        </Pressable>
        {!hasTambuMint ? (
          <Text style={styles.helper}>Falta tambuMint real del negocio para probar transferencia.</Text>
        ) : null}
        {hasTambuMint && signerError ? <Text style={styles.helper}>{signerError}</Text> : null}
        {checkoutError ? <Text style={styles.error}>{checkoutError}</Text> : null}
        {checkoutSignature ? <Text style={styles.success}>Signature: {checkoutSignature}</Text> : null}
        {activeModal === 'propina' ? (
          <Text style={styles.success}>Pago confirmado. Aquí se abrirá la propina LI.FI.</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 16,
    backgroundColor: '#101418',
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    gap: 4,
    paddingTop: 28,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: '#C9D1D9',
    fontSize: 16,
  },
  section: {
    gap: 10,
    borderColor: '#30363D',
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  text: {
    color: '#F0F3F6',
    fontSize: 15,
  },
  balance: {
    color: '#F7C948',
    fontSize: 20,
    fontWeight: '700',
  },
  total: {
    color: '#7EE787',
    fontSize: 18,
    fontWeight: '700',
  },
  helper: {
    color: '#C9D1D9',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2F80ED',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  smallButton: {
    alignItems: 'center',
    backgroundColor: '#2F80ED',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  secondaryButton: {
    backgroundColor: '#4B5563',
  },
  disabledButton: {
    backgroundColor: '#56606B',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  reviewInput: {
    minHeight: 120,
    borderColor: '#30363D',
    borderRadius: 8,
    borderWidth: 1,
    color: '#FFFFFF',
    padding: 12,
    textAlignVertical: 'top',
  },
  numberInput: {
    borderColor: '#30363D',
    borderRadius: 8,
    borderWidth: 1,
    color: '#FFFFFF',
    minHeight: 44,
    padding: 12,
  },
  error: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  success: {
    color: '#7EE787',
    fontSize: 14,
    fontWeight: '700',
  },
});
