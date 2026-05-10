import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import AuriosSlider from './AuriosSlider';

type Props = {
  subtotal: number;
  auriosToSpend: number;
  aurioBalance: number;
  sliderMax: number;
  isWalletConnected: boolean;
  hasAppliedAurioDiscount: boolean;
  isProcessing: boolean;
  isAurioDisabled: boolean;
  checkoutError: string | null;
  hybridError: string | null;
  onAuriosChange: (value: number) => void;
  onApply: () => void;
  onSkip: () => void;
};

export default function AurioDiscountStep({
  subtotal,
  auriosToSpend,
  aurioBalance,
  sliderMax,
  isWalletConnected,
  hasAppliedAurioDiscount,
  isProcessing,
  isAurioDisabled,
  checkoutError,
  hybridError,
  onAuriosChange,
  onApply,
  onSkip,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Descuento Aurio</Text>
      <Text style={styles.sectionCopy}>
        ¿Quieres aplicar tus Aurios como descuento? También puedes omitirlo y pagar el total con tarjeta.
      </Text>
      <AuriosSlider
        checkoutTotal={subtotal}
        auriosToSpend={auriosToSpend}
        aurioBalance={aurioBalance}
        sliderMax={sliderMax}
        isWalletConnected={isWalletConnected}
        isLocked={hasAppliedAurioDiscount}
        onAuriosChange={onAuriosChange}
      />
      {checkoutError ? <Text style={styles.error}>{checkoutError}</Text> : null}
      {hybridError ? <Text style={styles.error}>{hybridError}</Text> : null}
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          testID="checkout-aurio-discount-button"
          onPress={onApply}
          disabled={isAurioDisabled}
          style={({ pressed }) => [
            styles.applyOuter,
            pressed && !isAurioDisabled ? styles.applyPressed : null,
          ]}>
          <LinearGradient
            colors={isAurioDisabled ? ['#9A938A', '#7B746C'] : ['#86231A', '#A63A2F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.applyButton, isAurioDisabled ? styles.applyDisabled : null]}>
            <Ionicons name="ticket-outline" size={18} color="#FDFAF7" />
            <Text style={styles.applyButtonText}>
              {isProcessing ? 'Redimiendo...' : 'Aplicar descuento Aurio'}
            </Text>
          </LinearGradient>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          testID="checkout-skip-discount-button"
          onPress={onSkip}
          style={({ pressed }) => [styles.skipButton, pressed ? styles.skipPressed : null]}>
          <Text style={styles.skipButtonText}>Omitir descuento</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  sectionTitle: { color: '#2E2A26', fontSize: 18, fontWeight: '700' },
  sectionCopy: { color: '#6B645C', fontSize: 12.5, lineHeight: 18 },
  error: { color: '#86231A', fontSize: 12.5, fontWeight: '600' },
  actions: { gap: 6, marginTop: 4 },
  applyOuter: { borderRadius: 10 },
  applyButton: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  applyDisabled: { opacity: 0.7 },
  applyPressed: { opacity: 0.88, transform: [{ translateY: 1 }] },
  applyButtonText: {
    color: '#FDFAF7',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipPressed: { opacity: 0.55 },
  skipButtonText: {
    color: '#9A938A',
    fontSize: 13,
    fontWeight: '500',
  },
});
