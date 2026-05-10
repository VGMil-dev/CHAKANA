import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CycleIndicator from './CycleIndicator';

type EmbajadorViewProps = {
  aurioBalance: number;
  onCrosschain?: () => void;
};

export default function EmbajadorView({ aurioBalance, onCrosschain }: EmbajadorViewProps) {
  const balance = Math.max(0, Math.floor(aurioBalance));

  return (
    <>
      <View style={styles.sectionSurface}>
        <Text style={styles.eyebrow}>BALANCE · AURIOS</Text>
        <Text style={styles.displayNumber}>{balance.toLocaleString('en-US')}</Text>
        <Text style={styles.displaySub}>circulan en el ecosistema.</Text>
        <Text style={styles.displayConversion}>
          = ${(balance * 0.01).toFixed(2)} en descuentos disponibles
        </Text>
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
            <Text style={styles.metricNumber}>0</Text>
            <Text style={styles.metricLabel}>COMPRAS</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>0</Text>
            <Text style={styles.metricLabel}>RESEÑAS</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>0</Text>
            <Text style={styles.metricLabel}>PROPINAS</Text>
          </View>
        </View>
      </View>

      {onCrosschain ? (
        <View style={styles.sectionBase}>
          <Text style={styles.eyebrow}>VALOR EXTERNO</Text>
          <Pressable
            style={({ pressed }) => [styles.crosschainRow, pressed && styles.crosschainRowPressed]}
            onPress={onCrosschain}
          >
            <View style={styles.crosschainIcon}>
              <Ionicons name="swap-horizontal" size={18} color="#3AAFA9" />
            </View>
            <View style={styles.crosschainText}>
              <Text style={styles.crosschainTitle}>Traer valor con LI.FI</Text>
              <Text style={styles.crosschainSub}>Polygon USDC → Solana → Aurio</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9A938A" />
          </Pressable>
        </View>
      ) : null}
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
  crosschainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F8F3EE',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  crosschainRowPressed: {
    backgroundColor: '#F0EAE3',
  },
  crosschainIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#D5EEEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosschainText: {
    flex: 1,
  },
  crosschainTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E2A26',
    letterSpacing: -0.1,
  },
  crosschainSub: {
    fontSize: 11,
    color: '#9A938A',
    marginTop: 2,
  },
});
