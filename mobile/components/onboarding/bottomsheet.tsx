import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BottomSheet({ visible, onClose }: BottomSheetProps) {
  const [showModal, setShowModal] = useState(visible);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.timing(animValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setShowModal(false);
      });
    }
  }, [visible, animValue]);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Modal
      transparent={true}
      visible={showModal}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Animated Background Overlay */}
        <Animated.View style={[styles.overlay, { opacity }]}>
          <TouchableOpacity 
            style={{ flex: 1 }} 
            activeOpacity={1} 
            onPress={onClose}
          />
        </Animated.View>

        {/* Animated Bottom Sheet */}
        <Animated.View style={[styles.sheetContainer, { transform: [{ translateY }] }]}>
          {/* Drag Handle */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          {/* Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ECOSISTEMA · CUENCA</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>¿Qué es un Tambu?</Text>
          <View style={styles.titleUnderline} />

          {/* Description */}
          <Text style={styles.description}>
            Un nodo con historia, oficio y raíz en la ciudad. Negocio local con identidad propia, calidad comprobable y reciprocidad real.
          </Text>

          {/* Chips Row */}
          <View style={styles.chipsRow}>
            <View style={[styles.chip, { backgroundColor: '#F6EAE7' }]}>
              <View style={[styles.dot, { backgroundColor: '#B84B3B' }]} />
              <Text style={[styles.chipText, { color: '#B84B3B' }]}>Raíz local</Text>
            </View>
            
            <View style={[styles.chip, { backgroundColor: '#E8F3F3' }]}>
              <View style={[styles.dot, { backgroundColor: '#37AFB4' }]} />
              <Text style={[styles.chipText, { color: '#37AFB4' }]}>Calidad real</Text>
            </View>

            <View style={[styles.chip, { backgroundColor: '#F6EAE7' }]}>
              <View style={[styles.dot, { backgroundColor: '#B84B3B' }]} />
              <Text style={[styles.chipText, { color: '#B84B3B' }]}>Identidad{'\n'}propia</Text>
            </View>
          </View>

          {/* Bottom Dark Box */}
          <View style={styles.darkBox}>
            <View style={[styles.dot, { backgroundColor: '#B84B3B', marginRight: 12 }]} />
            <Text style={styles.darkBoxText}>Aquí tu apoyo vuelve.</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheetContainer: {
    backgroundColor: '#F5F0EB', // Crema
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1CCC6',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F3F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  badgeText: {
    color: '#37AFB4',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D3D3D',
    marginBottom: 8,
  },
  titleUnderline: {
    width: 48,
    height: 3,
    backgroundColor: '#9E392D', // Chakana Red
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#8A8580',
    lineHeight: 22,
    marginBottom: 24,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  chip: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  darkBox: {
    backgroundColor: '#3C3836',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkBoxText: {
    color: '#F5F0EB', // Crema
    fontSize: 15,
    fontWeight: '700',
  },
});
