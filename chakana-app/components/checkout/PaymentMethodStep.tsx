import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PaymentMethod = 'stripe' | 'cash';

type PaymentMethodStepProps = {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
};

export default function PaymentMethodStep({
  selectedMethod,
  onSelectMethod,
}: PaymentMethodStepProps) {
  const stripeSelected = selectedMethod === 'stripe';
  const cashSelected = selectedMethod === 'cash';

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>MÉTODO DE PAGO</Text>
      <View style={styles.grid}>
        {/* Stripe card */}
        <Pressable
          accessibilityRole="button"
          onPress={() => onSelectMethod('stripe')}
          style={({ pressed }) => [
            styles.card,
            stripeSelected && styles.cardSelected,
            pressed && styles.pressed,
          ]}>
          <View style={[styles.iconWrap, stripeSelected && styles.iconWrapSelected]}>
            <Ionicons
              name="card-outline"
              size={22}
              color={stripeSelected ? '#A63A2F' : '#6B645C'}
            />
          </View>
          <Text style={styles.cardTitle}>Tarjeta</Text>
          <Text style={styles.cardDesc}>Pago cifrado · Stripe Connect</Text>
          {stripeSelected && (
            <View style={styles.selectedPill}>
              <Text style={styles.selectedPillText}>Seleccionado</Text>
            </View>
          )}
        </Pressable>

        {/* Cash card */}
        <Pressable
          accessibilityRole="button"
          onPress={() => onSelectMethod('cash')}
          style={({ pressed }) => [
            styles.card,
            cashSelected && styles.cardSelected,
            pressed && styles.pressed,
          ]}>
          <View style={[styles.iconWrap, cashSelected && styles.iconWrapSelected]}>
            <Ionicons
              name="cash-outline"
              size={22}
              color={cashSelected ? '#A63A2F' : '#6B645C'}
            />
          </View>
          <Text style={styles.cardTitle}>Efectivo</Text>
          <Text style={styles.cardDesc}>Confirmas en persona con el Tambú</Text>
          {cashSelected && (
            <View style={styles.selectedPill}>
              <Text style={styles.selectedPillText}>Seleccionado</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  eyebrow: {
    color: '#9A938A',
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flex: 1,
    gap: 6,
    padding: 14,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#A63A2F',
  },
  pressed: {
    opacity: 0.85,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: '#F5F0EB',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  iconWrapSelected: {
    backgroundColor: '#F2D9D5',
  },
  cardTitle: {
    color: '#2E2A26',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  cardDesc: {
    color: '#6B645C',
    fontSize: 11,
    lineHeight: 15,
  },
  selectedPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F2D9D5',
    borderRadius: 999,
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  selectedPillText: {
    color: '#86231A',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
