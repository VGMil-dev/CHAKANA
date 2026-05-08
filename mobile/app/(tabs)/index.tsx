import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useReviewSubmit } from '../../../src/hooks/useReviewSubmit';
import { useWallet } from '../../../src/hooks/useWallet';

const TEST_BUSINESS_ID = process.env.EXPO_PUBLIC_QA_BUSINESS_ID ?? '';

function shortenWallet(walletPubKey: string): string {
  return `${walletPubKey.slice(0, 4)}...${walletPubKey.slice(-4)}`;
}

export default function HomeScreen() {
  const {
    walletPubKey,
    aurioBalance,
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

  const handleSubmitReview = () => {
    void submitReview({ businessId: TEST_BUSINESS_ID });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chakana</Text>
      <Text style={styles.subtitle}>MVP conectado</Text>

      {walletPubKey ? (
        <>
          <Text style={styles.text}>Wallet: {shortenWallet(walletPubKey)}</Text>
          <Text style={styles.balance}>Aurios: {aurioBalance}</Text>
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
        </>
      ) : (
        <>
          <Text style={styles.text}>Conecta tu wallet para usar Aurios</Text>
          <Pressable
            style={styles.button}
            onPress={connectWallet}
            disabled={isConnectingWallet}>
            <Text style={styles.buttonText}>
              {isConnectingWallet ? 'Conectando...' : 'Conectar wallet'}
            </Text>
          </Pressable>
        </>
      )}

      {walletError ? <Text style={styles.error}>{walletError}</Text> : null}

      <View style={styles.reviewBox}>
        <Text style={styles.sectionTitle}>Reseña de cafetería</Text>
        <TextInput
          style={styles.input}
          value={currentReviewText}
          onChangeText={onTextChange}
          multiline
          placeholder="Escribe una reseña real de mínimo 50 caracteres"
          placeholderTextColor="#8B949E"
          editable={!isSubmittingReview}
        />
        <Text style={styles.helper}>
          Mínimo 50 caracteres · faltan {Math.max(charsRemaining, 0)}
        </Text>
        <Pressable
          style={styles.button}
          onPress={handleSubmitReview}
          disabled={isSubmittingReview}>
          <Text style={styles.buttonText}>
            {isSubmittingReview ? 'Enviando...' : 'Enviar reseña'}
          </Text>
        </Pressable>
        {reviewError ? <Text style={styles.error}>{reviewError}</Text> : null}
        {reviewSuccess ? (
          <Text style={styles.success}>Reseña enviada. Ganaste 1 Aurio.</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#101418',
    padding: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: '#C9D1D9',
    fontSize: 18,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  balance: {
    color: '#F7C948',
    fontSize: 20,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2F80ED',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  secondaryButton: {
    backgroundColor: '#4B5563',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
  },
  reviewBox: {
    width: '100%',
    maxWidth: 520,
    gap: 10,
    marginTop: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    minHeight: 110,
    borderColor: '#30363D',
    borderRadius: 8,
    borderWidth: 1,
    color: '#FFFFFF',
    padding: 12,
    textAlignVertical: 'top',
  },
  helper: {
    color: '#C9D1D9',
    fontSize: 13,
    textAlign: 'center',
  },
  success: {
    color: '#7EE787',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
