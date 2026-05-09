import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import WeekDisplayTitle from '../components/dashboard/WeekDisplayTitle';
import MetricCard, { RatingDots, MiniBars } from '../components/dashboard/MetricCard';
import AuriosCard from '../components/dashboard/AuriosCard';
import AiNarratorPlayer from '../components/dashboard/AiNarratorPlayer';
import InsightCard from '../components/dashboard/InsightCard';

import { DASHBOARD_MOCK } from '../data/dashboard';

const { header, ratingMetric, reviewsMetric, auriosTotal, narrator, insights } = DASHBOARD_MOCK;

export default function Dashboard() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <DashboardHeader tambuName={header.tambuName} />

        <WeekDisplayTitle
          dateRange={header.dateRange}
          title={header.title}
          accentLine={header.accentLine}
        />

        <View style={styles.metricsRow}>
          <MetricCard
            eyebrow={ratingMetric.eyebrow}
            value={ratingMetric.value}
            unit={ratingMetric.unit}
            sub={ratingMetric.sub}
            chart={<RatingDots active={ratingMetric.ratingActive} />}
            tone={ratingMetric.tone}
            flex={1.15}
            marginRight={10}
          />
          <MetricCard
            eyebrow={reviewsMetric.eyebrow}
            value={reviewsMetric.value}
            unit={reviewsMetric.unit}
            sub={<Text style={styles.reviewsTrend}>{reviewsMetric.trendText}</Text>}
            tone={reviewsMetric.tone}
            chart={<MiniBars data={reviewsMetric.weeklyData} />}
          />
        </View>

        <AuriosCard amount={auriosTotal} />

        <AiNarratorPlayer
          title={narrator.title}
          duration={narrator.duration}
          totalSeconds={narrator.totalSeconds}
        />

        <Text style={styles.insightsTitle}>HALLAZGOS ACCIONABLES</Text>
        <View style={styles.insightsList}>
          {insights.map(insight => (
            <InsightCard
              key={insight.eyebrow}
              tone={insight.tone}
              eyebrow={insight.eyebrow}
              body={insight.body}
            />
          ))}
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
