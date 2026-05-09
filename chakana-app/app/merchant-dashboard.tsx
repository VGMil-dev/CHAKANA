import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { createTambu } from '../services/commerce';
import { useAuthStore } from '../store/auth';

export default function MerchantDashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTambuId, setActiveTambuId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/auth');
    }
  }, [router, user]);

  const handleCreateTambu = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const tambu = await createTambu({
        title,
        description,
        location,
        merchant_name: user?.fullName || user?.email,
      });
      setActiveTambuId(tambu.id);
      setMessage('Tambú creado correctamente.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo crear el tambú');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Dashboard Emprendedor</Text>
      <Text style={styles.subtitle}>{user.email}</Text>

      <Text style={styles.section}>Crear Tambú</Text>
      <TextInput style={styles.input} placeholder="Nombre del tambú" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Descripción" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Ubicación" value={location} onChangeText={setLocation} />

      <Pressable style={styles.primaryBtn} onPress={handleCreateTambu} disabled={saving}>
        <Text style={styles.primaryText}>{saving ? 'Guardando...' : 'Crear tambú'}</Text>
      </Pressable>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {activeTambuId ? (
        <View style={styles.actionsRow}>
          <Pressable style={styles.secondaryBtn} onPress={() => router.push({ pathname: '/product-editor', params: { tambuId: activeTambuId } })}>
            <Text style={styles.secondaryText}>Crear producto</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => router.push('/orders')}>
            <Text style={styles.secondaryText}>Ver órdenes</Text>
          </Pressable>
        </View>
      ) : null}

      <Pressable style={styles.linkBtn} onPress={() => router.push('/home')}>
        <Text style={styles.linkText}>Ir a catálogo cliente</Text>
      </Pressable>

      <Pressable style={styles.linkBtn} onPress={async () => { await logout(); router.replace('/auth'); }}>
        <Text style={styles.linkText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB' },
  content: { padding: 20, gap: 10 },
  title: { fontSize: 30, fontWeight: '700', color: '#2E2A26' },
  subtitle: { color: '#6B645C', marginBottom: 8 },
  section: { marginTop: 10, fontSize: 16, fontWeight: '600', color: '#2E2A26' },
  input: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  primaryBtn: { marginTop: 4, backgroundColor: '#86231A', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  message: { color: '#3D3D3D', marginTop: 4 },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  secondaryBtn: { flex: 1, borderWidth: 1, borderColor: '#A63A2F', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  secondaryText: { color: '#A63A2F', fontWeight: '600' },
  linkBtn: { marginTop: 8, alignItems: 'center', paddingVertical: 8 },
  linkText: { color: '#6B645C', textDecorationLine: 'underline' },
});
