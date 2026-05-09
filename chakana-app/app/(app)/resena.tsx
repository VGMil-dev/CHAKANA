import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PageNav from '../../components/core/PageNav';
import PageHeader from '../../components/core/PageHeader';
import ReviewForm from '../../components/reviews/ReviewForm';
import { useCartItems } from '../../store/cart';
import { useBusinesses } from '../../src/hooks/useBusinesses';

export default function Resena() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cartBusinessId = useCartItems()[0]?.businessId ?? null;
  const { listaTambus, fetchBusinesses } = useBusinesses();
  const fallbackBusinessId = listaTambus[0]?.id ?? null;
  const businessId = cartBusinessId ?? fallbackBusinessId;

  useEffect(() => {
    if (!businessId) void fetchBusinesses();
  }, [businessId, fetchBusinesses]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageNav
        label="04 · RESEÑA"
        rightSlot={
          <Pressable onPress={() => router.replace('/home')} style={styles.navSkip}>
            <Text style={styles.navSkipText}>Omitir</Text>
          </Pressable>
        }
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <PageHeader
          eyebrow="· EXPERIENCIA ·"
          title="¿Cómo fue"
          accent="tu experiencia?"
          subtitle="Tu reseña completa el ciclo y actualiza tu balance Aurio."
        />

        {businessId ? (
          <ReviewForm businessId={businessId} />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No hay Tambús disponibles para reseñar.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB' },
  navSkip: { width: 64, alignItems: 'flex-end', justifyContent: 'center', height: 44 },
  navSkipText: { fontSize: 13, color: '#9A938A', fontWeight: '500' },
  scrollContent: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 32, gap: 24 },
  emptyState: { alignItems: 'center', paddingVertical: 64, gap: 18 },
  emptyTitle: {
    color: '#9A938A',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
