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
        <Text style={styles.eyebrow}>DASHBOARD SEMANAL</Text>
        <Text style={styles.dashboardTitle}>El pulso{'\n'}del barrio.</Text>
        <TouchableOpacity
          style={styles.dashboardCta}
          activeOpacity={0.7}
          onPress={() => router.push('/dashboard')}
        >
          <Text style={styles.dashboardCtaText}>Ver análisis completo</Text>
          <Ionicons name="arrow-forward" size={14} color="#A63A2F" />
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
  dashboardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D3D3D',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginTop: 4,
    marginBottom: 16,
  },
  dashboardCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  dashboardCtaText: {
    fontSize: 14,
    color: '#A63A2F',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
