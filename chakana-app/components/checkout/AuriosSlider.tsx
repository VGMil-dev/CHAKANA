import React, { useEffect, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const DISC_SIZE = 28;
const MAX_VIS_RATIO = 6 / 7;

interface Props {
  checkoutTotal: number;
  auriosToSpend: number;
  aurioBalance: number;
  sliderMax: number;
  isWalletConnected: boolean;
  isLocked?: boolean;
  onAuriosChange: (aurios: number) => void;
}

export default function AuriosSlider({
  checkoutTotal,
  auriosToSpend,
  aurioBalance,
  sliderMax,
  isWalletConnected,
  isLocked = false,
  onAuriosChange,
}: Props) {
  const onChangeRef = useRef(onAuriosChange);
  onChangeRef.current = onAuriosChange;

  const railWidth = useRef(0);
  const dragStartAurios = useRef(0);
  const overshootAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const limitX = useRef(new Animated.Value(20)).current;
  const limitOpacity = useRef(new Animated.Value(0)).current;

  const safeAurios = Math.max(0, auriosToSpend);
  const safeAuriosRef = useRef(safeAurios);
  safeAuriosRef.current = safeAurios;
  const availableBalance = Math.max(0, Math.floor(aurioBalance));
  const percentUsed = checkoutTotal > 0 ? (safeAurios * 0.01 * 100) / checkoutTotal : 0;
  // trackMax = theoretical 25% cap in aurios (always maps to the 6/7 marker)
  // sliderMax = actual cap (may be lower if balance insufficient)
  const trackMax = checkoutTotal > 0 ? Math.max(Math.floor(checkoutTotal * 25), 1) : 1;
  const sliderMaxRef = useRef(sliderMax);
  sliderMaxRef.current = sliderMax;
  const trackMaxRef = useRef(trackMax);
  trackMaxRef.current = trackMax;
  const fillRatio = trackMax > 0 ? Math.min(MAX_VIS_RATIO, (safeAurios / trackMax) * MAX_VIS_RATIO) : 0;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isLocked,
      onMoveShouldSetPanResponder: () => !isLocked,
      onPanResponderGrant: () => {
        Animated.spring(scaleAnim, {
          toValue: 1.06,
          useNativeDriver: true,
          speed: 24,
          bounciness: 4,
        }).start();
        dragStartAurios.current = safeAuriosRef.current;
      },
      onPanResponderMove: (_evt, gs) => {
        const w = railWidth.current;
        const ct = trackMaxRef.current;
        if (!w || !ct) return;
        const trackPx = MAX_VIS_RATIO * w;
        const target = Math.round(dragStartAurios.current + (gs.dx / trackPx) * ct);
        const cap = sliderMaxRef.current;
        if (target > cap) {
          onChangeRef.current(cap);
          overshootAnim.setValue(Math.min(14, ((target - cap) / ct) * 40));
        } else {
          onChangeRef.current(Math.max(0, target));
          overshootAnim.setValue(0);
        }
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(overshootAnim, {
            toValue: 0,
            useNativeDriver: true,
            damping: 12,
            stiffness: 220,
            mass: 0.8,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 24,
            bounciness: 4,
          }),
        ]).start();
      },
      onPanResponderTerminate: () => {
        overshootAnim.setValue(0);
        scaleAnim.setValue(1);
      },
    }),
  ).current;

  const limitReached = sliderMax > 0 && safeAurios >= sliderMax;

  useEffect(() => {
    if (limitReached) {
      limitX.setValue(20);
      limitOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(limitX, {
          toValue: 0,
          useNativeDriver: true,
          damping: 16,
          stiffness: 200,
          mass: 0.8,
        }),
        Animated.spring(limitOpacity, {
          toValue: 1,
          useNativeDriver: true,
          damping: 20,
          stiffness: 220,
        }),
      ]).start();
    } else {
      limitX.setValue(20);
      limitOpacity.setValue(0);
    }
  }, [limitReached, limitX, limitOpacity]);

  const fillPct = `${fillRatio * 100}%` as `${number}%`;
  const discLeft = `${fillRatio * 100}%` as `${number}%`;
  const maxMarkerLeft = `${MAX_VIS_RATIO * 100}%` as `${number}%`;
  const isBalanceLimited = sliderMax < trackMax;
  const balanceMarkerLeft = trackMax > 0
    ? `${(sliderMax / trackMax) * MAX_VIS_RATIO * 100}%` as `${number}%`
    : `0%` as `${number}%`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>DESCUENTO CON AURIOS</Text>
          <Text style={styles.pct}>{Math.round(percentUsed)}%</Text>
        </View>
        <View style={styles.balanceBlock}>
          <Text style={styles.eyebrow}>BALANCE DISPONIBLE</Text>
          <Text style={styles.auriosValue}>
            {isWalletConnected ? `${availableBalance} Aurios` : 'Conecta wallet'}
          </Text>
          <Text style={styles.auriosMax}>Aurios aplicados: {safeAurios}</Text>
        </View>
      </View>

      <View
        style={styles.rail}
        onLayout={(e) => {
          railWidth.current = e.nativeEvent.layout.width;
        }}
        {...panResponder.panHandlers}>
        <View style={styles.track} />
        <LinearGradient
          colors={['#C5836F', '#A63A2F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: fillPct }]}
        />
        <View style={[styles.maxMarker, { left: maxMarkerLeft }]} />
        <Text style={[styles.maxLabel, { left: maxMarkerLeft }]}>MAX 25%</Text>
        {isBalanceLimited ? (
          <>
            <View style={[styles.balanceMarker, { left: balanceMarkerLeft }]} />
            <Text style={[styles.balanceLabel, { left: balanceMarkerLeft }]}>BALANCE</Text>
          </>
        ) : null}
        <Animated.View
          style={[
            styles.disc,
            {
              left: discLeft,
              marginLeft: -(DISC_SIZE / 2),
              transform: [{ translateX: overshootAnim }, { scale: scaleAnim }],
            },
          ]}>
          <View style={styles.discDot} />
        </Animated.View>
      </View>

      {isLocked ? (
        <Text style={styles.hint}>
          <Text style={styles.hintMax}>Descuento Aurio aplicado. El balance ya fue actualizado.</Text>
        </Text>
      ) : null}
      {!isLocked && limitReached ? (
        <Animated.View style={{ transform: [{ translateX: limitX }], opacity: limitOpacity }}>
          <Text style={[styles.hint, styles.hintMax]}>
            Llegaste al límite del ciclo. Más allá, lo guarda la tierra.
          </Text>
        </Animated.View>
      ) : null}
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
  balanceBlock: {
    alignItems: 'flex-end',
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
    letterSpacing: 0,
    lineHeight: 46,
  },
  auriosValue: {
    fontWeight: '600',
    fontSize: 17,
    color: '#2E2A26',
    letterSpacing: 0,
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
    transform: [{ translateX: -48 }],
  },
  balanceMarker: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: 2,
    backgroundColor: '#6B645C',
    opacity: 0.6,
    borderRadius: 2,
  },
  balanceLabel: {
    position: 'absolute',
    bottom: -4,
    fontWeight: '600',
    fontSize: 7,
    letterSpacing: 1.2,
    color: '#6B645C',
    textTransform: 'uppercase',
    transform: [{ translateX: -22 }],
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
