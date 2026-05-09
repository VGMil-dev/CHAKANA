import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import BalancePill from './BalancePill';

export interface HomeHeaderProps {
  initials: string;
  eyebrow: string;
  greeting: string;
  amount: number;
  walletPubKey: string | null;
  isConnectingWallet: boolean;
  walletError: string | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onRefreshBalance: () => void;
}

function shortenWallet(walletPubKey: string): string {
  return `${walletPubKey.slice(0, 4)}...${walletPubKey.slice(-4)}`;
}

export default function HomeHeader({
  initials,
  eyebrow,
  greeting,
  amount,
  walletPubKey,
  isConnectingWallet,
  walletError,
  onConnectWallet,
  onDisconnectWallet,
  onRefreshBalance,
}: HomeHeaderProps) {
  const isConnected = Boolean(walletPubKey);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{greeting}</Text>
        </View>
        <BalancePill amount={amount} isConnected={isConnected} />
      </View>

      <View style={styles.walletPanel}>
        <View style={{ flex: 1 }}>
          <Text style={styles.walletLabel}>{isConnected ? 'Wallet conectada' : 'Balance real'}</Text>
          <Text style={styles.walletText}>
            {walletPubKey
              ? `${shortenWallet(walletPubKey)} · ${Math.floor(amount).toLocaleString('es')} AUR`
              : 'Conecta tu wallet para ver tus Aurios.'}
          </Text>
          {walletError ? <Text style={styles.walletError}>{walletError}</Text> : null}
        </View>
        {walletPubKey ? (
          <View style={styles.actions}>
            <Pressable style={styles.ghostButton} onPress={onRefreshBalance} disabled={isConnectingWallet}>
              <Text style={styles.ghostButtonText}>Actualizar</Text>
            </Pressable>
            <Pressable style={styles.ghostButton} onPress={onDisconnectWallet} disabled={isConnectingWallet}>
              <Text style={styles.ghostButtonText}>Salir</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.connectButton} onPress={onConnectWallet} disabled={isConnectingWallet}>
            <Text style={styles.connectButtonText}>
              {isConnectingWallet ? 'Conectando...' : 'Conectar wallet'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 24,
    paddingBottom: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 12,
    gap: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8DFD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B645C',
  },
  textContainer: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    color: '#9A938A',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title: {
    fontWeight: '600',
    fontSize: 19,
    color: '#3D3D3D',
    letterSpacing: -0.1,
    marginTop: 2,
  },
  walletPanel: {
    marginHorizontal: 28,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(134, 35, 26, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletLabel: {
    fontSize: 10,
    color: '#A63A2F',
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  walletText: {
    marginTop: 3,
    fontSize: 12,
    color: '#4B4038',
  },
  walletError: {
    marginTop: 4,
    fontSize: 11,
    color: '#A63A2F',
  },
  actions: {
    gap: 6,
  },
  connectButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#A63A2F',
  },
  connectButtonText: {
    color: '#FDFAF7',
    fontSize: 12,
    fontWeight: '700',
  },
  ghostButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#F5F0EB',
  },
  ghostButtonText: {
    color: '#6B645C',
    fontSize: 11,
    fontWeight: '700',
  },
});
