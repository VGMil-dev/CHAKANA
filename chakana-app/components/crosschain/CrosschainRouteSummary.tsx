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
        <Text style={styles.loadingText}>Buscando la mejor ruta con LI.FI...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="alert-circle-outline" size={32} color="#9E392D" />
        <Text style={styles.errorTitle}>No se pudo obtener la ruta</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!route) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="git-network-outline" size={32} color="#A09C96" />
        <Text style={styles.emptyTitle}>Aún no hay ruta calculada</Text>
        <Text style={styles.emptyText}>
          Presiona buscar ruta para encontrar el mejor camino cross-chain.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
        <Text style={styles.title}>Ruta Encontrada</Text>
        {route.isMock && (
          <View style={styles.mockBadge}>
            <Text style={styles.mockBadgeText}>mock</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <DetailRow
          label="De"
          value={`${route.sourceAmount} ${route.sourceToken} en ${route.sourceNetwork}`}
        />
        <DetailRow
          label="A"
          value={`~${route.destinationAmount} ${route.destinationToken} en ${route.destinationNetwork}`}
        />
        <DetailRow label="Proveedor" value={route.provider} />
        {route.toolUsed && route.toolUsed !== 'mock' && (
          <DetailRow label="Bridge" value={route.toolUsed} />
        )}
        <DetailRow label="Tiempo Estimado" value={route.estimatedTime} />
        <DetailRow label="Fee Estimado" value={route.estimatedFee} />

        <View style={styles.statusBox}>
          <Text style={styles.statusText}>
            Estado: Listo para recibir valor en Solana
          </Text>
        </View>
      </View>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCF9F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F5F0EB',
    minHeight: 160,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8A8580',
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
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3D3D3D',
    marginLeft: 8,
    flex: 1,
  },
  mockBadge: {
    backgroundColor: '#E8E4DF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mockBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A8580',
  },
  details: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#8A8580',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3D3D3D',
    flexShrink: 1,
    textAlign: 'right',
  },
  statusBox: {
    marginTop: 8,
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 13,
  },
});
