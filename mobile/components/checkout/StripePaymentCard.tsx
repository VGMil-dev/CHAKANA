import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { formatUSD } from '../../../src/utils/sliderConfig';

type StripePaymentCardProps = {
  subtotal: number;
  auriosApplied: number;
  aurioDiscount: number;
  total: number;
  isProcessing: boolean;
  isDisabled: boolean;
  requiresLogin: boolean;
  onPay: () => void;
  onLogin: () => void;
};

export default function StripePaymentCard({
  subtotal,
  auriosApplied,
  aurioDiscount,
  total,
  isProcessing,
  isDisabled,
  requiresLogin,
  onPay,
  onLogin,
}: StripePaymentCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>PAGO SEGURO</Text>
          <Text style={styles.title}>Confirma tu pago</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="lock-closed-outline" size={14} color="#1F7A73" />
          <Text style={styles.badgeText}>Pago cifrado · Stripe</Text>
        </View>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total a cobrar</Text>
        <Text style={styles.totalValue}>{formatUSD(total)}</Text>
      </View>

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

      <View style={styles.sandboxBox}>
        <Text style={styles.sandboxLabel}>Sandbox</Text>
        <Text style={styles.sandboxText}>El cobro real se completa con Stripe Checkout.</Text>
      </View>

      {requiresLogin ? (
        <View style={styles.loginNotice}>
          <Text style={styles.loginText}>Inicia sesión para pagar con tarjeta.</Text>
          <Pressable accessibilityRole="button" testID="checkout-login-button" onPress={onLogin}>
            <Text style={styles.loginLink}>Ir a iniciar sesión</Text>
          </Pressable>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        testID="checkout-pay-button"
        onPress={onPay}
        disabled={isDisabled}
        style={({ pressed }) => [pressed && !isDisabled ? styles.pressed : null]}>
        <LinearGradient
          colors={isDisabled ? ['#6B645C', '#7B746C'] : ['#86231A', '#A63A2F']}
          style={[styles.payButton, isDisabled ? styles.payButtonDisabled : null]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}>
          <Ionicons name="card-outline" size={18} color="#FDFAF7" />
          <Text style={styles.payButtonText}>
            {isProcessing ? 'Procesando...' : 'Pagar con tarjeta'}
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
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
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
  badge: {
    alignItems: 'center',
    backgroundColor: '#E7F3EC',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#1F7A73',
    fontSize: 10.5,
    fontWeight: '700',
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
    color: '#3AAFA9',
    fontSize: 34,
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
  sandboxBox: {
    backgroundColor: '#F8F3EE',
    borderRadius: 10,
    padding: 12,
  },
  sandboxLabel: {
    color: '#A63A2F',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sandboxText: {
    color: '#6B645C',
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 4,
  },
  loginNotice: {
    backgroundColor: '#F7E7E3',
    borderRadius: 10,
    gap: 8,
    padding: 12,
  },
  loginText: {
    color: '#86231A',
    fontSize: 12.5,
    fontWeight: '700',
  },
  loginLink: {
    color: '#A63A2F',
    fontSize: 13,
    fontWeight: '800',
  },
  payButton: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  payButtonDisabled: {
    opacity: 0.75,
  },
  payButtonText: {
    color: '#FDFAF7',
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
  },
});
