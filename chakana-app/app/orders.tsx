import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { listMyOrders, Order } from '../services/commerce';

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      setOrders(await listMyOrders());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de órdenes</Text>
      {loading ? <Text style={styles.info}>Cargando...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 8, paddingTop: 8 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>#{item.id.slice(0, 8)}</Text>
            <Text style={styles.status}>{item.status.toUpperCase()}</Text>
            <Text style={styles.total}>$ {(item.total_cents / 100).toFixed(2)} {item.currency.toUpperCase()}</Text>
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={styles.info}>Aún no hay órdenes.</Text> : null}
      />

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Volver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB', padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#2E2A26' },
  info: { marginTop: 10, color: '#6B645C' },
  error: { marginTop: 10, color: '#A63A2F' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, gap: 2 },
  orderId: { fontWeight: '700', color: '#2E2A26' },
  status: { color: '#6B645C', fontSize: 12 },
  total: { color: '#A63A2F', fontWeight: '600' },
  backBtn: { marginTop: 10, alignItems: 'center', paddingVertical: 8 },
  backText: { color: '#6B645C', textDecorationLine: 'underline' },
});
