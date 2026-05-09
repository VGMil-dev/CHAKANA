import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CHECKOUT_CONFIG, AURIOS_BALANCE } from '../../data/checkout';

const { maxDiscountPct: MAX_PCT, railRange: RAIL_RANGE } = CHECKOUT_CONFIG;
const DISC_SIZE = 28;

interface Props {
  initialPct?: number;
  subtotal: number;
  onPctChange: (pct: number) => void;
}

export default function AuriosSlider({ initialPct = 18, subtotal, onPctChange }: Props) {
  const [pct, setPct]     = useState(initialPct);
  const onChangeRef       = useRef(onPctChange);
  onChangeRef.current     = onPctChange;

  const railWidth         = useRef(0);
  const dragStartX        = useRef(0);
  const overshootAnim     = useRef(new Animated.Value(0)).current;
  const scaleAnim         = useRef(new Animated.Value(1)).current;

  const aurios = Math.round(subtotal * 100 * (pct / 100));

  const applyX = useRef((x: number) => {
    const w = railWidth.current;
    if (!w) return;
    const ratio     = Math.max(0, Math.min(1.22, x / w));
    const requested = ratio * RAIL_RANGE;
    if (requested > MAX_PCT) {
      setPct(MAX_PCT);
      onChangeRef.current(MAX_PCT);
      overshootAnim.setValue(Math.min(14, (requested - MAX_PCT) * 3.5));
    } else {
      const newPct = Math.max(0, requested);
      setPct(newPct);
      onChangeRef.current(newPct);
      overshootAnim.setValue(0);
    }
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderGrant: (evt) => {
        Animated.spring(scaleAnim, { toValue: 1.06, useNativeDriver: true, speed: 24, bounciness: 4 }).start();
        dragStartX.current = evt.nativeEvent.locationX;
        applyX.current(dragStartX.current);
      },
      onPanResponderMove: (_evt, gs) => {
        applyX.current(dragStartX.current + gs.dx);
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(overshootAnim, { toValue: 0, useNativeDriver: true, damping: 12, stiffness: 220, mass: 0.8 }),
          Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 4 }),
        ]).start();
      },
      onPanResponderTerminate: () => {
        overshootAnim.setValue(0);
        scaleAnim.setValue(1);
      },
    })
  ).current;

  const fillPct  = `${(pct / RAIL_RANGE) * 100}%` as `${number}%`;
  const discLeft = `${(pct / RAIL_RANGE) * 100}%` as `${number}%`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>DESCUENTO CON AURIOS</Text>
          <Text style={styles.pct}>{Math.round(pct)}%</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.eyebrow}>AURIOS</Text>
          <View style={styles.auriosRow}>
            <Text style={styles.auriosValue}>−{aurios}</Text>
            <Text style={styles.auriosMax}> / {AURIOS_BALANCE}</Text>
          </View>
        </View>
      </View>

      <View
        style={styles.rail}
        onLayout={e => { railWidth.current = e.nativeEvent.layout.width; }}
        {...panResponder.panHandlers}
      >
        <View style={styles.track} />
        <LinearGradient
          colors={['#C5836F', '#A63A2F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: fillPct }]}
        />
        <View style={[styles.maxMarker, { left: `${(MAX_PCT / RAIL_RANGE) * 100}%` as any }]} />
        <Text style={[styles.maxLabel, { left: `${(MAX_PCT / RAIL_RANGE) * 100}%` as any }]}>
          MAX 25%
        </Text>
        <Animated.View
          style={[
            styles.disc,
            {
              left: discLeft,
              marginLeft: -(DISC_SIZE / 2),
              transform: [{ translateX: overshootAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.discDot} />
        </Animated.View>
      </View>

      <Text style={styles.hint}>
        {pct >= MAX_PCT
          ? <Text style={styles.hintMax}>Llegaste al límite del ciclo. Más allá, lo guarda la tierra.</Text>
          : '1 Auro = 1¢. Arrastrá el disco para aplicar más. Tope del 25%.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 18,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  eyebrow: {
    fontWeight: '600',
    fontSize: 9.5,
    letterSpacing: 2,
    color: '#6B645C',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  pct: {
    fontWeight: '700',
    fontSize: 42,
    color: '#A63A2F',
    letterSpacing: -1,
    lineHeight: 46,
  },
  auriosRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  auriosValue: {
    fontWeight: '600',
    fontSize: 17,
    color: '#2E2A26',
    letterSpacing: -0.3,
  },
  auriosMax: {
    fontSize: 12,
    color: '#9A938A',
  },
  rail: {
    height: 48,
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 4,
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E6E2DD',
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 8,
    borderRadius: 999,
  },
  maxMarker: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: 2,
    backgroundColor: '#86231A',
    opacity: 0.5,
    borderRadius: 2,
  },
  maxLabel: {
    position: 'absolute',
    top: -4,
    fontWeight: '700',
    fontSize: 8,
    letterSpacing: 1.5,
    color: '#86231A',
    textTransform: 'uppercase',
    transform: [{ translateX: -14 }],
  },
  disc: {
    position: 'absolute',
    width: DISC_SIZE,
    height: DISC_SIZE,
    borderRadius: DISC_SIZE / 2,
    backgroundColor: '#FDFAF7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
    top: (48 - DISC_SIZE) / 2,
  },
  discDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A63A2F',
  },
  hint: {
    marginTop: 12,
    fontSize: 11,
    color: '#6B645C',
    lineHeight: 16,
  },
  hintMax: {
    color: '#86231A',
    fontWeight: '500',
  },
});
