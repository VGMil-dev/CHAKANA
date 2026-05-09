import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import DashboardHeader from '../../components/dashboard/DashboardHeader';
import WeekDisplayTitle from '../../components/dashboard/WeekDisplayTitle';
import MetricCard, { RatingDots, MiniBars } from '../../components/dashboard/MetricCard';
import AuriosCard from '../../components/dashboard/AuriosCard';
import AiNarratorPlayer from '../../components/dashboard/AiNarratorPlayer';
import InsightCard from '../../components/dashboard/InsightCard';
import ChakanaDial from '../../components/core/ChakanaDial';
import SkeletonBox from '../../components/core/SkeletonBox';

import { useAuthStore } from '../../store/auth';
import { DASHBOARD_MOCK } from '../../data/dashboard';

const { header, ratingMetric, reviewsMetric, auriosTotal, narrator, insights } = DASHBOARD_MOCK;

function DashboardSkeleton() {
  return (
    <View style={{ gap: 20, paddingHorizontal: 22, paddingTop: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <SkeletonBox width={120} height={20} />
        <SkeletonBox width={44} height={44} borderRadius={22} />
      </View>
      <View style={{ gap: 10 }}>
        <SkeletonBox width="40%" height={12} />
        <SkeletonBox width="70%" height={32} />
        <SkeletonBox width="55%" height={32} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <SkeletonBox width="55%" height={120} borderRadius={12} />
        <SkeletonBox width="43%" height={120} borderRadius={12} />
      </View>
      <SkeletonBox width="100%" height={90} borderRadius={12} />
      <SkeletonBox width="100%" height={72} borderRadius={12} />
      <SkeletonBox width="40%" height={12} />
      <SkeletonBox width="100%" height={64} borderRadius={10} />
      <SkeletonBox width="100%" height={64} borderRadius={10} />
    </View>
  );
}

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const tambuName = user?.name ?? header.tambuName;

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 96 }]}
        bounces={false}
      >
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <DashboardHeader tambuName={tambuName} />

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
          </>
        )}
      </ScrollView>

      <ChakanaDial
        onCenterPress={() => router.replace('/dashboard')}
        onTabPress={(tab) => {
          if (tab === 'yo')      router.push('/perfil');
          if (tab === 'pedidos') router.push('/pedidos');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB' },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 16,
    gap: 20,
  },
  metricsRow: { flexDirection: 'row' },
  reviewsTrend: { color: '#277B77', fontSize: 10.5, fontWeight: '500' },
  insightsTitle: {
    fontSize: 9.5, letterSpacing: 2,
    color: '#6B645C', textTransform: 'uppercase', fontWeight: '600',
  },
  insightsList: { gap: 8 },
});
