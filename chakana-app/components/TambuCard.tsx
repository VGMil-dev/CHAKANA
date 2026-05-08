import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface TambuCardProps {
  name: string;
  barrio: string;
  cat: string;
  tone: string;
  rating: number;
  n: number;
  aurios: number;
  featured?: boolean;
}

function TambuImg({ tone, label, height }: { tone: string, label: string, height: number }) {
  // Map tone to a background color
  const bgColors: { [key: string]: string } = {
    clay: '#D4A373',
    weave: '#7B9071',
    ember: '#9E392D',
  };
  const bgColor = bgColors[tone] || '#D4A373';
  return (
    <View style={[{ height, backgroundColor: bgColor }, styles.tambuImgContainer]}>
      <View style={styles.tambuImgLabelContainer}>
        <Text style={styles.tambuImgLabel}>{label}</Text>
      </View>
    </View>
  );
}

export default function TambuCard({ name, barrio, cat, tone, rating, n, aurios, featured }: TambuCardProps) {
  return (
    <View style={styles.card}>
      <TambuImg tone={tone} label={cat} height={featured ? 168 : 130} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.cardName}>{name}</Text>
            <View style={styles.cardLocation}>
              <Ionicons name="location-outline" size={12} color="#6B645C" />
              <Text style={styles.cardLocationText}>{barrio}</Text>
            </View>
          </View>
          <View style={styles.cardRating}>
            <Ionicons name="star" size={12} color="#A63A2F" />
            <Text style={styles.cardRatingValue}>{rating}</Text>
            <Text style={styles.cardRatingCount}>· {n}</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={styles.cardReward}>
            <View style={styles.cardRewardDot} />
            <Text style={styles.cardRewardText}>devuelve hasta {aurios}% en Aurios</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color="#6B645C" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  tambuImgContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  tambuImgLabelContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(46, 42, 38, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
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
