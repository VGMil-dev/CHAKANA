import React, { useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

import { haptic } from '../../utils/haptics';

export interface TambuCardProps {
  id: string;
  name: string;
  barrio?: string;
  cat?: string;
  tone?: string;
  rating?: number | null;
  n?: number | null;
  aurios?: number | null;
  image?: string | null;
  featured?: boolean;
}

function TambuImg({ label, height, imageUri }: { tone?: string, label?: string, height: number, imageUri?: string | null }) {
  const [error, setError] = useState(false);
  const source = (imageUri && !error)
    ? { uri: imageUri }
    : require('../../assets/images/tambu_placeholder.webp');

  return (
    <ImageBackground
      source={source}
      resizeMode="cover"
      style={[styles.tambuImgContainer, { height }]}
      onError={() => setError(true)}
    >
      <View style={styles.tambuImgLabelContainer}>
        <Text style={styles.tambuImgLabel}>{label ?? 'Tambú'}</Text>
      </View>
    </ImageBackground>
  );
}

export default function TambuCard({ id, name, barrio, cat, tone, rating, n, aurios, image, featured }: TambuCardProps) {
  return (
    <Link href={`/inventario/${id}`} asChild>
      <Pressable
        onPressIn={() => haptic.light()}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <TambuImg tone={tone} label={cat} height={featured ? 168 : 130} imageUri={image} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.cardName}>{name}</Text>
              {barrio ? (
                <View style={styles.cardLocation}>
                  <Ionicons name="location-outline" size={12} color="#6B645C" />
                  <Text style={styles.cardLocationText}>{barrio}</Text>
                </View>
              ) : null}
            </View>
            {rating ? (
              <View style={styles.cardRating}>
                <Ionicons name="star" size={12} color="#A63A2F" />
                <Text style={styles.cardRatingValue}>{rating}</Text>
                {n ? <Text style={styles.cardRatingCount}>· {n}</Text> : null}
              </View>
            ) : null}
          </View>

          <View style={styles.cardFooter}>
            {aurios ? (
              <View style={styles.cardReward}>
                <View style={styles.cardRewardDot} />
                <Text style={styles.cardRewardText}>devuelve hasta {aurios}% en Aurios</Text>
              </View>
            ) : (
              <Text style={styles.cardRewardText}>Inventario disponible</Text>
            )}
            <Ionicons name="arrow-forward" size={16} color="#6B645C" />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    transform: [{ translateY: 1 }],
    shadowOpacity: 0.02,
    shadowRadius: 6,
  },
  tambuImgContainer: {
    width: '100%',
    backgroundColor: '#E8E2DB',
    justifyContent: 'flex-start',
  },
  tambuImgLabelContainer: {
    backgroundColor: 'rgba(46, 42, 38, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  tambuImgLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardContent: {
    paddingTop: 12,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardName: {
    fontWeight: '600',
    fontSize: 15.5,
    color: '#2E2A26',
    letterSpacing: -0.1,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  cardLocationText: {
    color: '#6B645C',
    fontSize: 11.5,
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#F8F3EE',
  },
  cardRatingValue: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#2E2A26',
  },
  cardRatingCount: {
    fontSize: 11,
    color: '#6B645C',
  },
  cardFooter: {
    marginTop: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(140,133,123,0.18)',
    borderStyle: 'dashed',
  },
  cardReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardRewardDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3AAFA9',
  },
  cardRewardText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#3D3D3D',
  },
});
