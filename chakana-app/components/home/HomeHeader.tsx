import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import BalancePill from './BalancePill';

export interface HomeHeaderProps {
  initials: string;
  eyebrow: string;
  greeting: string;
  amount: number;
  walletPubKey?: string | null;
  isConnectingWallet?: boolean;
  walletError?: string | null;
  onConnectWallet?: () => void;
  onDisconnectWallet?: () => void;
  onRefreshBalance?: () => void;
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
        <Pressable onPress={onRefreshBalance} disabled={!walletPubKey}>
          <BalancePill amount={amount} />
        </Pressable>
      </View>

      <View style={styles.walletRow}>
        {walletPubKey ? (
          <>
            <Text style={styles.walletText}>
              {walletPubKey.slice(0, 4)}...{walletPubKey.slice(-4)}
            </Text>
            <Pressable style={styles.ghostButton} onPress={onDisconnectWallet} disabled={isConnectingWallet}>
              <Text style={styles.ghostButtonText}>Desconectar</Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            style={styles.connectButton}
            onPress={onConnectWallet}
            disabled={isConnectingWallet}
            testID="connect-wallet-button"
          >
            <Text style={styles.connectButtonText}>
              {isConnectingWallet ? 'Conectando...' : 'Conectar wallet'}
            </Text>
          </Pressable>
        )}
      </View>
      {walletError ? <Text style={styles.walletError}>{walletError}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 24,
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
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 28,
    marginTop: -10,
  },
  walletText: {
    color: '#6B645C',
    fontSize: 12,
    fontWeight: '600',
  },
  connectButton: {
    backgroundColor: '#9E392D',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  connectButtonText: {
    color: '#FDFAF7',
    fontSize: 12,
    fontWeight: '700',
  },
  ghostButton: {
    backgroundColor: '#F8F3EE',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  ghostButtonText: {
    color: '#9E392D',
    fontSize: 12,
    fontWeight: '700',
  },
  walletError: {
    color: '#9E392D',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 28,
    textAlign: 'right',
    marginTop: 6,
  },
});
