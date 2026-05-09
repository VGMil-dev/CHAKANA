import React, { useRef } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { formatAurios, usdToAurios } from '../../../src/utils/sliderConfig';

const DISC_SIZE = 28;

interface Props {
  checkoutTotal: number;
  auriosToSpend: number;
  aurioBalance: number;
  sliderMax: number;
  isWalletConnected: boolean;
  isLocked?: boolean;
  onAuriosChange: (aurios: number) => void;
  onClear: () => void;
}

export default function AuriosSlider({
  checkoutTotal,
  auriosToSpend,
  aurioBalance,
  sliderMax,
  isWalletConnected,
  isLocked = false,
  onAuriosChange,
  onClear,
}: Props) {
  const onChangeRef = useRef(onAuriosChange);
  onChangeRef.current = onAuriosChange;

  const railWidth = useRef(0);
  const dragStartX = useRef(0);
  const overshootAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const safeAurios = Math.max(0, auriosToSpend);
  const availableBalance = Math.max(0, Math.floor(aurioBalance));
  const percentUsed = checkoutTotal > 0 ? (safeAurios * 0.01 * 100) / checkoutTotal : 0;
  const railMax = Math.max(sliderMax, 1);
  const fillRatio = sliderMax > 0 ? Math.min(1, safeAurios / sliderMax) : 0;
  const auriosFor5Percent = usdToAurios(checkoutTotal * 0.05);
  const auriosFor10Percent = usdToAurios(checkoutTotal * 0.1);

  const applyAurios = (value: number): void => {
    if (isLocked) return;
    onChangeRef.current(Math.min(value, sliderMax));
  };

  const applyX = useRef((x: number) => {
    const w = railWidth.current;
    if (!w || isLocked) return;

    const ratio = Math.max(0, Math.min(1.22, x / w));
    const requested = Math.round(ratio * railMax);

    if (requested > sliderMax) {
      onChangeRef.current(sliderMax);
      overshootAnim.setValue(Math.min(14, ((requested - sliderMax) / railMax) * 40));
    } else {
      onChangeRef.current(Math.max(0, requested));
      overshootAnim.setValue(0);
    }
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isLocked,
      onMoveShouldSetPanResponder: () => !isLocked,
      onPanResponderGrant: (evt) => {
        Animated.spring(scaleAnim, {
          toValue: 1.06,
          useNativeDriver: true,
          speed: 24,
          bounciness: 4,
        }).start();
        dragStartX.current = evt.nativeEvent.locationX;
        applyX.current(dragStartX.current);
      },
      onPanResponderMove: (_evt, gs) => {
        applyX.current(dragStartX.current + gs.dx);
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

  const fillPct = `${fillRatio * 100}%` as `${number}%`;
  const discLeft = `${fillRatio * 100}%` as `${number}%`;
  const maxMarkerLeft = '100%' as `${number}%`;
  const presetStyle = [styles.presetButton, isLocked ? styles.presetDisabled : null];

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

      <View style={styles.presets}>
        <Pressable style={presetStyle} onPress={() => applyAurios(auriosFor5Percent)} disabled={isLocked}>
          <Text style={styles.presetLabel}>5% de descuento</Text>
          <Text style={styles.presetValue}>{Math.min(auriosFor5Percent, sliderMax)} Aurios</Text>
        </Pressable>
        <Pressable style={presetStyle} onPress={() => applyAurios(auriosFor10Percent)} disabled={isLocked}>
          <Text style={styles.presetLabel}>10% de descuento</Text>
          <Text style={styles.presetValue}>{Math.min(auriosFor10Percent, sliderMax)} Aurios</Text>
        </Pressable>
        <Pressable style={presetStyle} onPress={() => applyAurios(sliderMax)} disabled={isLocked}>
          <Text style={styles.presetLabel}>Maximo permitido</Text>
          <Text style={styles.presetValue}>{sliderMax} Aurios</Text>
        </Pressable>
        <Pressable
          style={[styles.presetButton, styles.clearButton, isLocked ? styles.presetDisabled : null]}
          onPress={onClear}
          disabled={isLocked}>
          <Text style={styles.presetLabel}>Limpiar</Text>
          <Text style={styles.presetValue}>0 Aurios</Text>
        </Pressable>
      </View>

      <Text style={styles.hint}>
        {isLocked ? (
          <Text style={styles.hintMax}>Descuento Aurio aplicado. El balance ya fue actualizado.</Text>
        ) : safeAurios >= sliderMax && sliderMax > 0 ? (
          <Text style={styles.hintMax}>Llegaste al limite del ciclo. Mas alla, lo guarda la tierra.</Text>
        ) : (
          `1 Aurio = 1 centavo. Puedes usar hasta ${formatAurios(sliderMax)} en este pedido.`
        )}
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
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  presetButton: {
    backgroundColor: '#F8F3EE',
    borderRadius: 10,
    minWidth: 132,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  presetDisabled: {
    opacity: 0.55,
  },
  clearButton: {
    backgroundColor: '#E6E2DD',
  },
  presetLabel: {
    color: '#3D3D3D',
    fontSize: 12,
    fontWeight: '600',
  },
  presetValue: {
    color: '#A63A2F',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
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
