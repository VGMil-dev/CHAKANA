import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CycleIndicator from './CycleIndicator';

type EmbajadorViewProps = {
  aurioBalance: number;
  isWalletConnected: boolean;
};

export default function EmbajadorView({ aurioBalance, isWalletConnected }: EmbajadorViewProps) {
  const displayBalance = isWalletConnected ? Math.floor(aurioBalance).toLocaleString('es') : 'Conectar';
  const displayConversion = isWalletConnected
    ? `= $${(Math.floor(aurioBalance) * 0.01).toFixed(2)} en descuentos disponibles`
    : 'Conecta tu wallet para ver tus Aurios.';

  return (
    <>
      <View style={styles.sectionSurface}>
        <Text style={styles.eyebrow}>BALANCE · AURIOS</Text>
        <Text style={styles.displayNumber}>{displayBalance}</Text>
        <Text style={styles.displaySub}>{isWalletConnected ? 'AUR disponibles.' : 'Wallet no conectada.'}</Text>
        <Text style={styles.displayConversion}>{displayConversion}</Text>
      </View>

      <View style={styles.sectionBase}>
        <Text style={styles.eyebrow}>CICLO ACTIVO</Text>
        <CycleIndicator activeStep={3} />
        <Text style={styles.cycleHint}>
          Publica una reseña para completar el ciclo y ganar más Aurios.
        </Text>
      </View>

      <View style={styles.sectionContained}>
        <Text style={styles.eyebrow}>ACTIVIDAD</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>12</Text>
            <Text style={styles.metricLabel}>COMPRAS</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>8</Text>
            <Text style={styles.metricLabel}>RESEÑAS</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>3</Text>
            <Text style={styles.metricLabel}>PROPINAS</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#A63A2F',
    marginBottom: 12,
  },
  sectionBase: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionSurface: {
    backgroundColor: '#F8F3EE',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionContained: {
    backgroundColor: '#F0EAE3',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  displayNumber: {
    fontSize: 60,
    fontWeight: '800',
    color: '#3D3D3D',
    letterSpacing: -1,
    lineHeight: 64,
  },
  displaySub: {
    fontSize: 14,
    color: '#6B645C',
    marginTop: 4,
  },
  displayConversion: {
    fontSize: 12,
    color: '#9A938A',
    marginTop: 4,
  },
  cycleHint: {
    fontSize: 12,
    color: '#9A938A',
    marginTop: 16,
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metric: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 4,
  },
  metricNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D3D3D',
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: '#9A938A',
    textTransform: 'uppercase',
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#3D3D3D',
    opacity: 0.08,
    marginHorizontal: 16,
  },
});
