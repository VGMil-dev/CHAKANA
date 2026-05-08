import { StyleSheet, Text, View } from 'react-native';

import { useAppStore } from '../../../src/store';

export default function HomeScreen() {
  const walletPubKey = useAppStore((state) => state.walletPubKey);
  const aurioBalance = useAppStore((state) => state.aurioBalance);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chakana</Text>
      <Text style={styles.subtitle}>MVP conectado</Text>
      {walletPubKey ? (
        <Text style={styles.text}>Wallet: {walletPubKey}</Text>
      ) : (
        <Text style={styles.text}>Conecta tu wallet para usar Aurios</Text>
      )}
      <Text style={styles.balance}>Aurios: {aurioBalance}</Text>
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
});
