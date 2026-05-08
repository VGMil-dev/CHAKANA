import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useWallet } from '../../../src/hooks/useWallet';

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
});
