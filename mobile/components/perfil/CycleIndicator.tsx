import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  activeStep?: number;
}

const STEPS = ['COMPRA', 'RESEÑA', 'GANA', 'CANJEA'] as const;

export default function CycleIndicator({ activeStep = 3 }: Props) {
  return (
    <View style={styles.container}>
      {STEPS.map((label, i) => (
        <React.Fragment key={label}>
          <View style={styles.step}>
            <View style={[styles.dot, i < activeStep ? styles.dotActive : styles.dotInactive]} />
            <Text style={[styles.label, i < activeStep ? styles.labelActive : styles.labelInactive]}>
              {label}
            </Text>
          </View>
          {i < STEPS.length - 1 && (
            <View style={[styles.line, i < activeStep - 1 ? styles.lineActive : styles.lineInactive]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  step: {
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  dotActive:   { backgroundColor: '#3AAFA9' },
  dotInactive: { backgroundColor: '#E6E2DD' },
  line: {
    flex: 1,
    height: 2,
    marginTop: 4,
    borderRadius: 999,
  },
  lineActive:   { backgroundColor: '#3AAFA9' },
  lineInactive: { backgroundColor: '#E6E2DD' },
  label: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  labelActive:   { color: '#3AAFA9' },
  labelInactive: { color: '#9A938A' },
});
