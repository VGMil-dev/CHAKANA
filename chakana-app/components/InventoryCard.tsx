import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { cartStore, useCart } from '../store/cart';

export interface InventoryCardProps {
  id: string;
  title: string;
  type: string;
  price: number; // Aurios
  image?: ReturnType<typeof require>;
  onPress?: () => void;
}

export default function InventoryCard({ id, title, type, price, image, onPress }: InventoryCardProps) {
  useCart(); // re-render whenever the cart changes
  const qty = cartStore.getQty(id);

  const handleAdd = () => cartStore.add({ id, title, type, price, image });
  const handleRemove = () => cartStore.remove(id);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* Image area */}
      <View style={styles.imageContainer}>
        {image
          ? <Image source={image} style={StyleSheet.absoluteFill} resizeMode="cover" />
          : <View style={[StyleSheet.absoluteFill, styles.imagePlaceholder]} />
        }
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.4)', '#FFFFFF']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
        />
        {/* Type tag */}
        <View style={styles.typeTag}>
          <Text style={styles.typeTagText}>{type}</Text>
        </View>

        {/* Add button (qty = 0) */}
        {qty === 0 && (
          <Pressable
            onPress={handleAdd}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}
          >
            <LinearGradient
              colors={['#C5836F', '#A63A2F']}
              style={styles.addBtnGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="add" size={18} color="#FDFAF7" />
            </LinearGradient>
          </Pressable>
        )}

        {/* Stepper overlay (qty > 0) */}
        {qty > 0 && (
          <View style={styles.stepperOverlay}>
            <Pressable
              onPress={handleRemove}
              style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons
                name={qty === 1 ? 'trash-outline' : 'remove'}
                size={14}
                color="#FDFAF7"
              />
            </Pressable>
            <Text style={styles.stepQty}>{qty}</Text>
            <Pressable
              onPress={handleAdd}
              style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="add" size={14} color="#FDFAF7" />
            </Pressable>
          </View>
        )}
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.itemTitle} numberOfLines={2}>{title}</Text>
        <View style={styles.priceRow}>
          <View style={[styles.priceDot, qty > 0 && styles.priceDotActive]} />
          <Text style={[styles.priceText, qty > 0 && styles.priceTextActive]}>
            {price} Aurios
          </Text>
          {qty > 0 && (
            <Text style={styles.priceSubtotal}>· {price * qty} total</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
    marginBottom: 8,
  },
  cardPressed: {
    transform: [{ translateY: 1 }],
    shadowOpacity: 0.02,
  },

  // Image
  imageContainer: {
    width: '100%',
    height: 160,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 10,
  },
  imagePlaceholder: {
    backgroundColor: '#F0EAE4',
  },
  typeTag: {
    backgroundColor: 'rgba(253,250,247,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeTagText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#A63A2F',
  },

  // Add button
  addBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 4,
  },
  addBtnGrad: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // Stepper overlay
  stepperOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 42,
    backgroundColor: 'rgba(30,26,23,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 4,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(253,250,247,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepQty: {
    color: '#FDFAF7',
    fontWeight: '700',
    fontSize: 16,
    minWidth: 20,
    textAlign: 'center',
  },

  // Details
  details: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 6,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E2A26',
    lineHeight: 18,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3AAFA9',
  },
  priceDotActive: {
    backgroundColor: '#A63A2F',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3AAFA9',
  },
  priceTextActive: {
    color: '#A63A2F',
  },
  priceSubtotal: {
    fontSize: 10.5,
    color: '#9A938A',
    fontWeight: '500',
  },
});
