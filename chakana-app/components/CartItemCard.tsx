import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cartStore, CartEntry } from '../store/cart';

interface Props {
  item: CartEntry;
}

export default function CartItemCard({ item }: Props) {
  return (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>$ {(item.price * item.qty).toFixed(2)}</Text>
      </View>
      <View style={styles.qtyControl}>
        <Pressable
          onPress={() => cartStore.add({ id: item.id, title: item.title, type: item.type, price: item.price, image: item.image })}
          style={({ pressed }) => [styles.qtyBtn, pressed && styles.pressed]}
        >
          <Ionicons name="add" size={14} color="#3D3D3D" />
        </Pressable>
        <Text style={styles.qtyValue}>{item.qty}</Text>
        <Pressable
          onPress={() => cartStore.remove(item.id)}
          style={({ pressed }) => [styles.qtyBtn, pressed && styles.pressed]}
        >
          <Ionicons
            name={item.qty === 1 ? 'trash-outline' : 'remove'}
            size={14}
            color="#A63A2F"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    gap: 14,
  },
  image: {
    width: 62,
    height: 62,
    borderRadius: 8,
    backgroundColor: '#F0EAE4',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  type: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A63A2F',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontWeight: '600',
    fontSize: 13,
    color: '#2E2A26',
    letterSpacing: -0.1,
    lineHeight: 17,
  },
  price: {
    fontWeight: '700',
    fontSize: 14,
    color: '#3AAFA9',
    marginTop: 4,
  },
  qtyControl: {
    alignItems: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8F3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontWeight: '700',
    fontSize: 15,
    color: '#3D3D3D',
    minWidth: 18,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ translateY: 1 }],
  },
});
