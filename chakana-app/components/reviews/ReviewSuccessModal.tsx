import React from 'react';
import { StyleSheet, View, Text, Pressable, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { useAppStore } from '../../src/store';
import { haptic } from '../../utils/haptics';

const { width, height } = Dimensions.get('window');

export default function ReviewSuccessModal() {
  const router = useRouter();
  const activeModal = useAppStore((state) => state.activeModal);
  const closeModal = useAppStore((state) => state.closeModal);
  const resetReviewForm = useAppStore((state) => state.resetReviewForm);

  const visible = activeModal === 'reviewSuccess';

  const handleFinish = () => {
    haptic.selection();
    closeModal();
    resetReviewForm();
    router.replace('/home');
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View 
          entering={FadeIn.duration(300)} 
          style={styles.backdrop} 
        />
        
        <Animated.View 
          entering={ZoomIn.duration(400).springify()} 
          style={styles.container}
        >
          <View style={styles.iconCircle}>
            <LinearGradient
              colors={['#3AAFA9', '#2B8C87']}
              style={styles.gradient}
            >
              <Ionicons name="leaf" size={42} color="#FDFAF7" />
            </LinearGradient>
          </View>

          <View style={styles.content}>
            <Text style={styles.eyebrow}>RECOMPENSA RECOLECTADA</Text>
            <Text style={styles.title}>¡Gracias por sembrar!</Text>
            <Text style={styles.subtitle}>
              Tu reseña completa el ciclo y te ha sumado {'\n'}
              <Text style={styles.accent}>+1 Aurio</Text> a tu balance.
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>+1</Text>
              <Text style={styles.statLab}>Aurio</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>100%</Text>
              <Text style={styles.statLab}>Ciclo</Text>
            </View>
          </View>

          <Pressable
            onPress={handleFinish}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
          >
            <Text style={styles.buttonText}>Volver al Inicio</Text>
            <Ionicons name="arrow-forward" size={18} color="#FDFAF7" />
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46, 42, 38, 0.6)',
  },
  container: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#F5F0EB',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    gap: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginTop: -76, // Pull up to overlap top
    borderWidth: 6,
    borderColor: '#F5F0EB',
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 8,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3AAFA9',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2E2A26',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B645C',
    textAlign: 'center',
    lineHeight: 22,
  },
  accent: {
    color: '#3AAFA9',
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2E2A26',
  },
  statLab: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9A938A',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#F0EAE3',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#A63A2F',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 999,
  },
  buttonText: {
    color: '#FDFAF7',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
