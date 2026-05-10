import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CrosschainRouteResult } from '../../src/types/crosschain';

interface Props {
  route: CrosschainRouteResult | null;
  isLoading: boolean;
  error: string | null;
}

export default function CrosschainRouteSummary({ route, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#9E392D" />
        <Text style={styles.loadingTitle}>Consultando LI.FI</Text>
        <Text style={styles.loadingText}>Buscando una ruta de Polygon USDC hacia Solana USDC.</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="alert-circle-outline" size={32} color="#9E392D" />
        <Text style={styles.errorTitle}>No pudimos calcular la ruta</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!route) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="git-network-outline" size={32} color="#A09C96" />
        <Text style={styles.emptyTitle}>Ruta pendiente</Text>
        <Text style={styles.emptyText}>
          Consulta LI.FI para traer valor global hacia Solana y convertirlo en impacto local.
        </Text>
      </View>
    );
  }

  const isMock = route.source === 'mock' || route.isMock;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name={isMock ? 'flask-outline' : 'checkmark-circle-outline'}
          size={20}
          color={isMock ? '#8A8580' : '#2F7D72'}
        />
        <Text style={styles.title}>{isMock ? 'Ruta demo lista' : 'Ruta real encontrada'}</Text>
        <View style={[styles.badge, isMock ? styles.mockBadge : styles.realBadge]}>
          <Text style={[styles.badgeText, isMock ? styles.mockBadgeText : styles.realBadgeText]}>
            {isMock ? 'Mock' : 'Ruta real'}
          </Text>
        </View>
      </View>

      {isMock && route.fallbackReason ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>{route.fallbackReason}</Text>
        </View>
      ) : null}

      <View style={styles.details}>
        <DetailRow
          label="Origen"
          value={`${route.sourceAmount} ${route.sourceToken} en ${route.sourceNetwork}`}
        />
        <DetailRow
          label="Destino"
          value={`~${route.destinationAmount} ${route.destinationToken} en ${route.destinationNetwork}`}
        />
        <DetailRow label="Provider" value={route.provider} />
        <DetailRow label="Bridge/tool" value={route.toolUsed ?? 'LI.FI'} />
        <DetailRow label="Tiempo" value={route.estimatedTime} />
        <DetailRow label="Fee" value={route.estimatedFee} />
      </View>

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>
          Quote-only: no se firma, no se ejecuta y no se mueven fondos.
        </Text>
      </View>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCF9F6',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    minHeight: 136,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#3D3D3D',
  },
  loadingText: {
    marginTop: 4,
    fontSize: 13,
    color: '#8A8580',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3D3D3D',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#8A8580',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9E392D',
    marginTop: 12,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#8A8580',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3D3D3D',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  realBadge: {
    backgroundColor: '#DDEEEB',
  },
  mockBadge: {
    backgroundColor: '#E8E4DF',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  realBadgeText: {
    color: '#2F7D72',
  },
  mockBadgeText: {
    color: '#6F6861',
  },
  notice: {
    backgroundColor: '#F8F3EE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  noticeText: {
    fontSize: 13,
    color: '#8A8580',
    lineHeight: 18,
  },
  details: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  label: {
    fontSize: 13,
    color: '#8A8580',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3D3D3D',
    flex: 1,
    textAlign: 'right',
  },
  statusBox: {
    marginTop: 12,
    backgroundColor: '#F7E7E3',
    padding: 10,
    borderRadius: 10,
  },
  statusText: {
    color: '#9E392D',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
});
