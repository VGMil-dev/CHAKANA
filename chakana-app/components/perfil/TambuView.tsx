import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TambuView() {
  const router = useRouter();

  return (
    <>
      <View style={styles.sectionSurface}>
        <Text style={styles.eyebrow}>SEMANA · 28 ABR — 04 MAY</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.displayNumberSm}>4.9</Text>
            <Text style={styles.metricLabel}>RATING</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.displayNumberSm}>+12</Text>
            <Text style={styles.metricLabel}>RESEÑAS</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.displayNumberSm}>4.2k</Text>
            <Text style={styles.metricLabel}>AURIOS</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContained}>
        <Text style={styles.eyebrow}>MI PANEL</Text>
        <TouchableOpacity
          style={styles.panelRow}
          activeOpacity={0.7}
          onPress={() => router.replace('/dashboard')}
        >
          <View style={styles.panelIconBox}>
            <Ionicons name="bar-chart-outline" size={18} color="#A63A2F" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.panelRowTitle}>Panel del Tambu</Text>
            <Text style={styles.panelRowSub}>Métricas, reseñas e insights IA</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9A938A" />
        </TouchableOpacity>
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
  displayNumberSm: {
    fontSize: 36,
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
  panelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FDFAF7',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  panelIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F2D9D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelRowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3D3D3D',
    marginBottom: 2,
  },
  panelRowSub: {
    fontSize: 12,
    color: '#9A938A',
  },
});
