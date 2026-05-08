import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';

// Helper component for AI player progress bar
function ProgressBar({ progress }: { progress: number }) {
  const widthAnim = useSharedValue(progress);

  useEffect(() => {
    widthAnim.value = withTiming(progress, { duration: 100 });
  }, [progress]);

  const style = useAnimatedStyle(() => {
    return {
      width: `${widthAnim.value}%`,
    };
  });

  return (
    <View style={{ height: 4, backgroundColor: 'rgba(253,250,247,0.18)', borderRadius: 999, overflow: 'hidden' }}>
      <Animated.View style={[{ height: '100%', backgroundColor: '#3AAFA9', borderRadius: 999 }, style]} />
    </View>
  );
}

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(38); // % progress

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT(p => (p >= 100 ? 0 : p + 0.6)), 100);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.tambuImgContainer}>
            <Image source={require('../assets/images/splash-icon.png')} style={{ width: 36, height: 36, tintColor: '#A63A2F' }} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.eyebrow}>· PANEL DEL TAMBU ·</Text>
            <Text style={styles.tambuName}>Tambu San Sebastián</Text>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Feather name="bell" size={18} color="#3D3D3D" />
          </TouchableOpacity>
        </View>

        {/* Display title */}
        <View style={{ marginTop: 18 }}>
          <Text style={styles.dateRange}>SEMANA · 28 ABR — 04 MAY</Text>
          <Text style={styles.title}>
            El pulso{'\n'}
            <Text style={{ color: '#A63A2F' }}>del barrio.</Text>
          </Text>
        </View>

        {/* Two big metric cards */}
        <View style={styles.metricsRow}>
          <MetricCard
            eyebrow="RATING"
            value="4.9"
            unit="/ 5"
            sub="312 voces de barrio"
            chart={<RatingDots active={5}/>}
            tone="red"
            flex={1.15}
            marginRight={10}
          />
          <MetricCard
            eyebrow="RESEÑAS"
            value="+12"
            unit="esta semana"
            sub={<Text style={{ color: '#277B77', fontSize: 10.5, fontWeight: '500' }}>↑ 38% vs. sem pasada</Text>}
            tone="jade"
            chart={<MiniBars data={[3,5,4,7,9,11,12]}/>}
            flex={1}
            marginRight={0}
          />
        </View>

        {/* Aurios Devueltos */}
        <View style={styles.auriosCard}>
          <View>
            <Text style={styles.auriosEyebrow}>AURIOS DEVUELTOS</Text>
            <Text style={styles.auriosValue}>
              4 218 <Text style={styles.auriosSub}>al barrio</Text>
            </Text>
          </View>
          <View style={styles.cicloBadge}>
            <Feather name="trending-up" size={12} color="#277B77" />
            <Text style={styles.cicloText}>ciclo activo</Text>
          </View>
        </View>

        {/* AI player */}
        <View style={styles.aiPlayer}>
          <Image 
            source={require('../assets/images/splash-icon.png')} 
            style={{ position: 'absolute', right: -20, top: -20, width: 140, height: 140, opacity: 0.05, tintColor: '#FDFAF7' }} 
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>· VOZ DEL CICLO · IA</Text>
            </View>
          </View>
          <Text style={styles.aiTitle}>Resumen narrado{'\n'}de tu semana.</Text>
          <Text style={styles.aiDuration}>2 min · Locución de barrio</Text>

          <View style={styles.aiControlsRow}>
            <TouchableOpacity onPress={() => setPlaying(p => !p)} style={styles.playButton}>
              <Feather name={playing ? "pause" : "play"} size={18} color="#FDFAF7" style={playing ? {} : { marginLeft: 2 }} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <ProgressBar progress={t} />
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>0:{Math.floor(t * 1.2 / 100 * 60).toString().padStart(2,'0')}</Text>
                <Text style={styles.timeText}>2:00</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Insight strip */}
        <Text style={styles.insightsTitle}>HALLAZGOS ACCIONABLES</Text>
        <View style={{ marginTop: 8, gap: 8 }}>
          <Insight tone="jade" eyebrow="RECURRENCIA" body="6 embajadores nuevos volvieron 3 veces. Reconocelos."/>
          <Insight tone="amber" eyebrow="HORA PICO" body="Martes 8–10am supera tu capacidad. ¿Pre-orden?"/>
        </View>

      </ScrollView>
    </View>
  );
}

function MetricCard({ eyebrow, value, unit, sub, tone, chart, flex, marginRight }: any) {
  const accent = tone === 'red' ? '#A63A2F' : '#277B77';
  return (
    <View style={[styles.metricCard, { flex, marginRight }]}>
      <Text style={[styles.metricEyebrow, { color: accent }]}>{eyebrow}</Text>
      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricUnit}>{unit}</Text>
      </View>
      {typeof sub === 'string' ? (
        <Text style={styles.metricSub}>{sub}</Text>
      ) : (
        sub
      )}
      <View style={{ flex: 1 }} />
      <View style={{ marginTop: 8 }}>{chart}</View>
    </View>
  );
}

function RatingDots({ active }: { active: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <View key={i} style={{
          width: 7, height: 7, borderRadius: 999,
          backgroundColor: i <= active ? '#3AAFA9' : '#E6E2DD',
        }}/>
      ))}
    </View>
  );
}

function MiniBars({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 22 }}>
      {data.map((v, i) => (
        <View key={i} style={{
          flex: 1, height: `${(v / max) * 100}%`, borderRadius: 2,
          backgroundColor: i === data.length - 1 ? '#277B77' : 'rgba(58,175,169,0.45)',
        }}/>
      ))}
    </View>
  );
}

function Insight({ eyebrow, body, tone }: { eyebrow: string, body: string, tone: 'jade' | 'amber' | 'red' }) {
  const c = { jade: '#3AAFA9', amber: '#C97A3A', red: '#A63A2F' }[tone];
  return (
    <View style={styles.insightCard}>
      <View style={[styles.insightIndicator, { backgroundColor: c }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.insightEyebrow, { color: c }]}>{eyebrow}</Text>
        <Text style={styles.insightBody}>{body}</Text>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tambuImgContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: '#E2C2B3', // fallback color
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 9.5,
    letterSpacing: 2,
    color: '#A63A2F',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  tambuName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#2E2A26',
    marginTop: 2,
  },
  bellButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  dateRange: {
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 2,
    color: '#6B645C',
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 6,
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 30,
    color: '#2E2A26',
    letterSpacing: -0.5,
  },
  metricsRow: {
    marginTop: 18,
    flexDirection: 'row',
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 14,
    minHeight: 130,
  },
  metricEyebrow: {
    fontSize: 9.5,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metricValueRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  metricValue: {
    fontWeight: '700',
    fontSize: 30,
    color: '#2E2A26',
    letterSpacing: -0.5,
  },
  metricUnit: {
    fontSize: 11,
    color: '#9A938A',
  },
  metricSub: {
    marginTop: 6,
    fontSize: 10.5,
    color: '#6B645C',
  },
  auriosCard: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  auriosEyebrow: {
    fontSize: 9.5,
    letterSpacing: 2,
    color: '#6B645C',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  auriosValue: {
    fontWeight: '700',
    fontSize: 22,
    color: '#2E2A26',
    marginTop: 4,
    letterSpacing: -0.3,
  },
  auriosSub: {
    fontSize: 11,
    color: '#9A938A',
    fontWeight: '500',
  },
  cicloBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#D5EEEC',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cicloText: {
    color: '#277B77',
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  aiPlayer: {
    marginTop: 14,
    backgroundColor: '#2E2622',
    borderRadius: 14,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  aiBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(58,175,169,0.15)',
  },
  aiBadgeText: {
    fontSize: 9,
    letterSpacing: 2,
    color: '#3AAFA9',
    fontWeight: '600',
  },
  aiTitle: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.1,
    color: '#FDFAF7',
  },
  aiDuration: {
    marginTop: 4,
    fontSize: 11.5,
    color: 'rgba(253,250,247,0.6)',
  },
  aiControlsRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#3AAFA9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3AAFA9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 4,
  },
  timeRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 10,
    color: 'rgba(253,250,247,0.55)',
  },
  insightsTitle: {
    marginTop: 16,
    fontSize: 9.5,
    letterSpacing: 2,
    color: '#6B645C',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  insightIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginTop: 2,
  },
  insightEyebrow: {
    fontSize: 9.5,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  insightBody: {
    fontSize: 12.5,
    color: '#3D3D3D',
    marginTop: 4,
    lineHeight: 18,
  },
});
