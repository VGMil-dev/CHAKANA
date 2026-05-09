import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DashboardHeader from '../components/DashboardHeader';
import WeekDisplayTitle from '../components/WeekDisplayTitle';
import MetricCard, { RatingDots, MiniBars } from '../components/MetricCard';
import AuriosCard from '../components/AuriosCard';
import AiNarratorPlayer from '../components/AiNarratorPlayer';
import InsightCard from '../components/InsightCard';

export default function Dashboard() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <DashboardHeader tambuName="Tambu San Sebastián" />

        <WeekDisplayTitle
          dateRange="SEMANA · 28 ABR — 04 MAY"
          title="El pulso"
          accentLine="del barrio."
        />

        <View style={styles.metricsRow}>
          <MetricCard
            eyebrow="RATING"
            value="4.9"
            unit="/ 5"
            sub="312 voces de barrio"
            chart={<RatingDots active={5} />}
            tone="red"
            flex={1.15}
            marginRight={10}
          />
          <MetricCard
            eyebrow="RESEÑAS"
            value="+12"
            unit="esta semana"
            sub={<Text style={styles.reviewsTrend}>↑ 38% vs. sem pasada</Text>}
            tone="jade"
            chart={<MiniBars data={[3, 5, 4, 7, 9, 11, 12]} />}
          />
        </View>

        <AuriosCard amount={4218} />

        <AiNarratorPlayer
          title={'Resumen narrado\nde tu semana.'}
          duration="2 min · Locución de barrio"
          totalSeconds={120}
        />

        <Text style={styles.insightsTitle}>HALLAZGOS ACCIONABLES</Text>
        <View style={styles.insightsList}>
          <InsightCard tone="jade" eyebrow="RECURRENCIA" body="6 embajadores nuevos volvieron 3 veces. Reconocelos." />
          <InsightCard tone="amber" eyebrow="HORA PICO" body="Martes 8–10am supera tu capacidad. ¿Pre-orden?" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 28,
  },
  metricsRow: {
    marginTop: 18,
    flexDirection: 'row',
  },
  reviewsTrend: {
    color: '#277B77',
    fontSize: 10.5,
    fontWeight: '500',
  },
  insightsTitle: {
    marginTop: 16,
    fontSize: 9.5,
    letterSpacing: 2,
    color: '#6B645C',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  insightsList: {
    marginTop: 8,
    gap: 8,
  },
});
