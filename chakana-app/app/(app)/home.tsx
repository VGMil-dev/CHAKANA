import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeHeader from '../../components/home/HomeHeader';
import DisplaySection from '../../components/home/DisplaySection';
import CategoryChipsBar from '../../components/home/CategoryChipsBar';
import TambuFeed, { type TambuItem } from '../../components/home/TambuFeed';
import SkeletonBox from '../../components/core/SkeletonBox';
import { useAuth } from '../../src/hooks/useAuth';
import { useBusinesses } from '../../src/hooks/useBusinesses';
import { useWallet } from '../../src/hooks/useWallet';

import { MARKET_CATEGORIES } from '../../data/categories';

function getInitials(name: string) {
  return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function TambuCardSkeleton({ featured }: { featured?: boolean }) {
  return (
    <View style={{ gap: 10, backgroundColor: '#FFFFFF', borderRadius: 10, overflow: 'hidden' }}>
      <SkeletonBox width="100%" height={featured ? 168 : 130} borderRadius={0} />
      <View style={{ paddingHorizontal: 14, paddingBottom: 14, gap: 8 }}>
        <SkeletonBox width="75%" height={16} />
        <SkeletonBox width="45%" height={12} />
      </View>
    </View>
  );
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState('Todos');
  const { authEmail, displayName: authDisplayName } = useAuth();
  const {
    listaTambus,
    isLoadingBusinesses,
    businessError,
    fetchBusinesses,
  } = useBusinesses();
  const {
    aurioBalance,
    walletPubKey,
    isConnectingWallet,
    walletError,
    connectWallet,
    disconnectWallet,
    refreshAurioBalance,
  } = useWallet();

  useEffect(() => {
    void fetchBusinesses();
  }, [fetchBusinesses]);

  const displayName = authDisplayName ?? authEmail?.split('@')[0] ?? 'Explorador';
  const initials = getInitials(displayName);
  const greeting = `Hola, ${displayName.split(/[.\s_-]/)[0]}.`;

  const tambus = useMemo<TambuItem[]>(
    () =>
      listaTambus.map((business) => ({
        id: business.id,
        name: business.name,
        barrio: business.location ?? undefined,
        cat: business.category ?? undefined,
        tone: 'andes',
        rating: null,
        n: null,
        aurios: null,
        image: business.image_url ?? undefined,
      })),
    [listaTambus],
  );

  const filteredTambus = active === 'Todos'
    ? tambus
    : tambus.filter(t => {
      if (!t.cat) return true;
      return t.cat.toLowerCase() === active.toLowerCase();
    });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <HomeHeader
        initials={initials}
        eyebrow={walletPubKey ? 'WALLET CONECTADA · CUENCA' : 'CONECTA TU WALLET · CUENCA'}
        greeting={greeting}
        amount={aurioBalance}
        walletPubKey={walletPubKey}
        isConnectingWallet={isConnectingWallet}
        walletError={walletError}
        onConnectWallet={() => void connectWallet()}
        onDisconnectWallet={() => void disconnectWallet()}
        onRefreshBalance={() => void refreshAurioBalance()}
      />

      <ScrollView stickyHeaderIndices={[2]} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <DisplaySection eyebrow="MERCADO" title="Tambús que" accentLine="laten hoy." />

        <CategoryChipsBar
          categories={MARKET_CATEGORIES}
          active={active}
          onSelect={setActive}
        />

        {businessError ? (
          <View style={styles.messageWrap}>
            <Text style={styles.messageText}>{businessError}</Text>
          </View>
        ) : null}

        {isLoadingBusinesses ? (
          <View style={{ paddingHorizontal: 28, paddingBottom: 180, gap: 28 }}>
            <TambuCardSkeleton featured />
            <TambuCardSkeleton />
            <TambuCardSkeleton />
          </View>
        ) : (
          <TambuFeed
            tambus={filteredTambus}
            note={'Cada compra siembra.\n Cada reseña hace crecer.'}
          />
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  messageWrap: {
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  messageText: {
    color: '#9E392D',
    fontSize: 13,
    fontWeight: '600',
  },
});
