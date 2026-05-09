import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';

function ProgressBar({ progress }: { progress: number }) {
  const widthAnim = useSharedValue(progress);

  useEffect(() => {
    widthAnim.value = withTiming(progress, { duration: 100 });
  }, [progress]);

  const style = useAnimatedStyle(() => ({ width: `${widthAnim.value}%` }));

  return (
    <View style={barStyles.track}>
      <Animated.View style={[barStyles.fill, style]} />
    </View>
  );
}

const barStyles = StyleSheet.create({
  track: { height: 4, backgroundColor: 'rgba(253,250,247,0.18)', borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#3AAFA9', borderRadius: 999 },
});

interface Props {
  title: string;
  duration: string;
  totalSeconds: number;
}

export default function AiNarratorPlayer({ title, duration, totalSeconds }: Props) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(38);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress(p => (p >= 100 ? 0 : p + 0.6)), 100);
    return () => clearInterval(id);
  }, [playing]);

  const elapsed = Math.floor((progress / 100) * totalSeconds);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splash-icon.png')}
        style={styles.bgIcon}
      />
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>· VOZ DEL CICLO · IA</Text>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.duration}>{duration}</Text>
      <View style={styles.controlsRow}>
        <TouchableOpacity onPress={() => setPlaying(p => !p)} style={styles.playButton}>
          <Feather name={playing ? 'pause' : 'play'} size={18} color="#FDFAF7" style={playing ? {} : { marginLeft: 2 }} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <ProgressBar progress={progress} />
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{fmt(elapsed)}</Text>
            <Text style={styles.timeText}>{fmt(totalSeconds)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    backgroundColor: '#2E2622',
    borderRadius: 14,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  bgIcon: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 140,
    height: 140,
    opacity: 0.05,
    tintColor: '#FDFAF7',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(58,175,169,0.15)',
  },
  badgeText: {
    fontSize: 9,
    letterSpacing: 2,
    color: '#3AAFA9',
    fontWeight: '600',
  },
  title: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.1,
    color: '#FDFAF7',
  },
  duration: {
    marginTop: 4,
    fontSize: 11.5,
    color: 'rgba(253,250,247,0.6)',
  },
  controlsRow: {
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
});
