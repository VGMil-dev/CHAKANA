import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { formatUSD } from '../../src/utils/sliderConfig';

type CashPaymentCardProps = {
  total: number;
  auriosApplied: number;
  aurioDiscount: number;
  subtotal: number;
  isProcessing: boolean;
  isDisabled: boolean;
  cashError: string | null;
  onConfirm: () => void;
};

export default function CashPaymentCard({
  total,
  auriosApplied,
  aurioDiscount,
  subtotal,
  isProcessing,
  isDisabled,
  cashError,
  onConfirm,
}: CashPaymentCardProps) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.eyebrow}>PAGO EN PERSONA</Text>
        <Text style={styles.title}>Confirmar pedido</Text>
      </View>

      {/* Dark total box */}
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>MONTO A ENTREGAR</Text>
        <Text style={styles.totalValue}>{formatUSD(total)}</Text>
      </View>

      {/* Summary rows */}
      <View style={styles.summary}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Subtotal</Text>
          <Text style={styles.rowValue}>{formatUSD(subtotal)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Aurios aplicados</Text>
          <Text style={styles.rowValue}>{auriosApplied} Aurios</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Descuento Aurio</Text>
          <Text style={styles.rowValue}>-{formatUSD(aurioDiscount)}</Text>
        </View>
      </View>

      {/* Instructions box */}
      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsTitle}>CÓMO FUNCIONA</Text>
        <View style={styles.steps}>
          {[
            'Confirma tu pedido aquí.',
            'El Tambú recibe tu orden y la prepara.',
            'Entrega el efectivo al retirar tu pedido.',
          ].map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepPill}>
                <Text style={styles.stepNumber}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Error */}
      {cashError ? <Text style={styles.errorText}>{cashError}</Text> : null}

      {/* CTA button */}
      <Pressable
        accessibilityRole="button"
        testID="checkout-cash-confirm-button"
        onPress={onConfirm}
        disabled={isDisabled}
        style={({ pressed }) => [pressed && !isDisabled ? styles.pressed : null]}>
        <LinearGradient
          colors={['#9A6825', '#C97A3A']}
          style={[styles.confirmButton, isDisabled && styles.confirmButtonDisabled]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}>
          <Ionicons name="checkmark-outline" size={18} color="#FDFAF7" />
          <Text style={styles.confirmButtonText}>
            {isProcessing ? 'Confirmando...' : 'Confirmar pedido en efectivo'}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    gap: 14,
    padding: 18,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  eyebrow: {
    color: '#A63A2F',
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#2E2A26',
    fontSize: 23,
    fontWeight: '800',
    marginTop: 4,
  },
  totalBox: {
    backgroundColor: '#1E1A17',
    borderRadius: 10,
    padding: 16,
  },
  totalLabel: {
    color: '#9A938A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  totalValue: {
    color: '#C97A3A',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
  },
  summary: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowLabel: {
    color: '#6B645C',
    fontSize: 12.5,
  },
  rowValue: {
    color: '#3D3D3D',
    fontSize: 12.5,
    fontWeight: '700',
  },
  instructionsBox: {
    backgroundColor: '#F8F3EE',
    borderRadius: 10,
    padding: 14,
  },
  instructionsTitle: {
    color: '#6B645C',
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  steps: {
    gap: 10,
  },
  stepRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  stepPill: {
    alignItems: 'center',
    backgroundColor: '#F2D9D5',
    borderRadius: 999,
    height: 22,
    justifyContent: 'center',
    minWidth: 22,
    paddingHorizontal: 7,
  },
  stepNumber: {
    color: '#86231A',
    fontSize: 10,
    fontWeight: '800',
  },
  stepText: {
    color: '#6B645C',
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  errorText: {
    color: '#86231A',
    fontSize: 12.5,
    fontWeight: '600',
  },
  confirmButton: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  confirmButtonDisabled: {
    opacity: 0.75,
  },
  confirmButtonText: {
    color: '#FDFAF7',
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
  },
});
