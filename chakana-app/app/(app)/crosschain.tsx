import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import CrosschainAurioCard from '../../components/crosschain/CrosschainAurioCard';
import CrosschainRouteSummary from '../../components/crosschain/CrosschainRouteSummary';
import CrosschainInfoCard from '../../components/crosschain/CrosschainInfoCard';
import { CrosschainRouteMock } from '../../../src/types/crosschain';

export default function CrosschainAurioScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState<CrosschainRouteMock | null>(null);

  const handleSearchRoute = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRoute({
        sourceNetwork: 'Polygon',
        sourceToken: 'USDC',
        destinationNetwork: 'Solana',
        destinationToken: 'USDC / SOL',
        provider: 'LI.FI',
        estimatedTime: '2-4 min',
        estimatedFee: '~0.18 USDC',
        status: 'ready'
      });
      setIsLoading(false);
    }, 1500);
  };

  const handlePayTambu = () => {
    console.log("TODO: pay to Tambu with Aurio SDK");
    // Just a placeholder action for the mock
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#3D3D3D" />
          </TouchableOpacity>
          <View style={styles.headerBadge}>
            <Text style={styles.badgeText}>Powered by LI.FI</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.title}>Entrar a CHAKANA desde cualquier red</Text>
          <Text style={styles.subtitle}>Convierte valor cross-chain en participación local con Aurio.</Text>
          <View style={styles.narrativeBox}>
            <Text style={styles.narrativeText}>Crypto global → impacto local</Text>
          </View>
        </View>

        {/* Cards */}
        <View style={styles.cardsRow}>
          <View style={styles.cardWrapper}>
            <CrosschainAurioCard 
              type="source"
              network="Polygon"
              token="USDC"
              amount="10 USDC"
            />
          </View>
          <View style={styles.cardWrapper}>
            <CrosschainAurioCard 
              type="destination"
              network="Solana"
              token="USDC / SOL"
              wallet="8x7K...a91F"
            />
          </View>
        </View>

        <CrosschainInfoCard />

        {/* Route Summary */}
        <CrosschainRouteSummary route={route} isLoading={isLoading} />

        {/* Actions */}
        <View style={styles.footer}>
          {!route ? (
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={handleSearchRoute}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>Buscar ruta con LI.FI</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.readyActions}>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={handlePayTambu}
              >
                <Text style={styles.primaryButtonText}>Pagar a Tambú con Aurios</Text>
              </TouchableOpacity>
              <Text style={styles.nextStepText}>Próximo paso: conectar Aurio SDK</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100, // Make room for ChakanaDial if needed
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCF9F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadge: {
    backgroundColor: '#3D3D3D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  hero: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D3D3D',
    lineHeight: 34,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#8A8580',
    lineHeight: 22,
    marginBottom: 16,
  },
  narrativeBox: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8E4DF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  narrativeText: {
    color: '#9E392D',
    fontWeight: '700',
    fontSize: 13,
  },
  cardsRow: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 16,
  },
  cardWrapper: {
    width: '100%',
  },
  footer: {
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#9E392D',
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  readyActions: {
    alignItems: 'center',
  },
  nextStepText: {
    fontSize: 13,
    color: '#A09C96',
    marginTop: 8,
  },
});
