import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '../../../src/hooks/useAuth';
import { useReviewSubmit } from '../../../src/hooks/useReviewSubmit';
import { useWallet } from '../../../src/hooks/useWallet';

const TEST_BUSINESS_ID = process.env.EXPO_PUBLIC_QA_BUSINESS_ID ?? '';

function shortenWallet(walletPubKey: string): string {
  return `${walletPubKey.slice(0, 4)}...${walletPubKey.slice(-4)}`;
}

export default function HomeScreen() {
  const [email, setEmail] = useState('qa-test@chakana.dev');
  const [password, setPassword] = useState('Chakana2024!');
  const [displayName, setDisplayName] = useState('Valentina');
  const {
    authEmail,
    isConnected: isAuthConnected,
    isAuthLoading,
    authError,
    login,
    register,
    logout,
  } = useAuth();
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

  const handleLogin = () => {
    void login(email.trim(), password);
  };

  const handleRegister = () => {
    void register(email.trim(), password, displayName.trim() || 'Embajador Chakana');
  };

  const handleLogout = () => {
    void logout();
  };

  const handleSubmitReview = () => {
    void submitReview({ businessId: TEST_BUSINESS_ID });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chakana</Text>
      <Text style={styles.subtitle}>MVP conectado</Text>

      <View style={styles.authBox}>
        <Text style={styles.sectionTitle}>Sesion Supabase</Text>
        {isAuthConnected ? (
          <>
            <Text style={styles.text}>Usuario: {authEmail}</Text>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={handleLogout}
              disabled={isAuthLoading}>
              <Text style={styles.buttonText}>Cerrar sesion</Text>
            </Pressable>
          </>
        ) : (
          <>
            <TextInput
              style={styles.authInput}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor="#8B949E"
              editable={!isAuthLoading}
            />
            <TextInput
              style={styles.authInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#8B949E"
              editable={!isAuthLoading}
            />
            <TextInput
              style={styles.authInput}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Nombre para registro"
              placeholderTextColor="#8B949E"
              editable={!isAuthLoading}
            />
            <View style={styles.row}>
              <Pressable style={styles.button} onPress={handleLogin} disabled={isAuthLoading}>
                <Text style={styles.buttonText}>
                  {isAuthLoading ? 'Entrando...' : 'Iniciar sesion'}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.secondaryButton]}
                onPress={handleRegister}
                disabled={isAuthLoading}>
                <Text style={styles.buttonText}>Registrar</Text>
              </Pressable>
            </View>
          </>
        )}
        {authError ? <Text style={styles.error}>{authError}</Text> : null}
      </View>

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
          <Pressable style={styles.button} onPress={connectWallet} disabled={isConnectingWallet}>
            <Text style={styles.buttonText}>
              {isConnectingWallet ? 'Conectando...' : 'Conectar wallet'}
            </Text>
          </Pressable>
        </>
      )}

      {walletError ? <Text style={styles.error}>{walletError}</Text> : null}

      <View style={styles.reviewBox}>
        <Text style={styles.sectionTitle}>Resena de cafeteria</Text>
        <TextInput
          style={styles.input}
          value={currentReviewText}
          onChangeText={onTextChange}
          multiline
          placeholder="Escribe una resena real de minimo 50 caracteres"
          placeholderTextColor="#8B949E"
          editable={!isSubmittingReview}
        />
        <Text style={styles.helper}>
          Minimo 50 caracteres - faltan {Math.max(charsRemaining, 0)}
        </Text>
        <Pressable style={styles.button} onPress={handleSubmitReview} disabled={isSubmittingReview}>
          <Text style={styles.buttonText}>
            {isSubmittingReview ? 'Enviando...' : 'Enviar resena'}
          </Text>
        </Pressable>
        {reviewError ? <Text style={styles.error}>{reviewError}</Text> : null}
        {reviewSuccess ? <Text style={styles.success}>Resena enviada. Ganaste 1 Aurio.</Text> : null}
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
  authBox: {
    width: '100%',
    maxWidth: 520,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  authInput: {
    minHeight: 44,
    borderColor: '#30363D',
    borderRadius: 8,
    borderWidth: 1,
    color: '#FFFFFF',
    padding: 12,
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
