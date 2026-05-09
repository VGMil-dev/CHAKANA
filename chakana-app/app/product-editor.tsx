import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createProduct, uploadProductImage } from '../services/commerce';
import { useAuthStore } from '../store/auth';

export default function ProductEditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tambuId?: string }>();
  const { user } = useAuthStore();

  const tambuId = useMemo(() => (typeof params.tambuId === 'string' ? params.tambuId : ''), [params.tambuId]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    if (!tambuId) {
      setMessage('Falta tambuId');
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const payload: {
        title: string;
        description?: string;
        price_cents: number;
        image_path?: string;
        image_url?: string;
      } = {
        title,
        description,
        price_cents: Math.round(Number(price) * 100),
      };

      if (imageUri && user) {
        const upload = await uploadProductImage(user.id, tambuId, imageUri);
        payload.image_path = upload.storagePath;
        payload.image_url = upload.publicUrl;
      }

      await createProduct(tambuId, payload);
      setMessage('Producto creado.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear / Editar Producto</Text>
      <Text style={styles.subtitle}>Tambú: {tambuId || 'sin seleccionar'}</Text>

      <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Descripción" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Precio USD (ej: 12.50)" keyboardType="decimal-pad" value={price} onChangeText={setPrice} />
      <TextInput style={styles.input} placeholder="URL/URI imagen (opcional)" autoCapitalize="none" value={imageUri} onChangeText={setImageUri} />

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <Pressable style={styles.btn} onPress={submit} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Guardando...' : 'Guardar producto'}</Text>
      </Pressable>

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Volver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB', padding: 20, gap: 10 },
  title: { fontSize: 28, fontWeight: '700', color: '#2E2A26' },
  subtitle: { color: '#6B645C', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  message: { color: '#3D3D3D' },
  btn: { marginTop: 4, borderRadius: 12, backgroundColor: '#86231A', paddingVertical: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  backBtn: { alignItems: 'center', paddingVertical: 8 },
  backText: { color: '#6B645C', textDecorationLine: 'underline' },
});
