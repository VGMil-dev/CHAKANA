import React, { useState } from 'react';
import {
  StyleSheet, View, Text, Pressable, TextInput, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const STAR_COUNT = 5;

const PROMPTS = [
  'Frescura del producto',
  'Atención del Tambu',
  'Empaque sostenible',
  'Lo recomendaría',
];

export default function Resena() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const toggleTag = (t: string) =>
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const canSubmit = stars > 0;

  const handleSubmit = () => {
    router.replace('/home');
  };

  const display = hovered || stars;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.nav}>
        <View style={{ width: 44 }} />
        <Text style={styles.navLabel}>04 · RESEÑA</Text>
        <Pressable
          onPress={() => router.replace('/home')}
          style={({ pressed }) => [styles.navSkip, pressed && styles.pressed]}
        >
          <Text style={styles.navSkipText}>Omitir</Text>
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>· TAMBU SAN SEBASTIÁN ·</Text>
          <Text style={styles.displayTitle}>
            ¿Cómo fue{'\n'}<Text style={styles.displayAccent}>tu experiencia?</Text>
          </Text>
          <Text style={styles.subtitle}>
            Tu reseña completa el ciclo y te suma Aurios.
          </Text>
        </View>

        <View style={styles.starsRow}>
          {Array.from({ length: STAR_COUNT }).map((_, i) => {
            const filled = i < display;
            return (
              <Pressable
                key={i}
                onPress={() => setStars(i + 1)}
                onPressIn={() => setHovered(i + 1)}
                onPressOut={() => setHovered(0)}
                style={styles.starHit}
              >
                <Ionicons
                  name={filled ? 'star' : 'star-outline'}
                  size={38}
                  color={filled ? '#A63A2F' : '#C9C1B8'}
                />
              </Pressable>
            );
          })}
        </View>

        {stars > 0 && (
          <Text style={styles.starsLabel}>
            {['', 'Mejorable', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'][stars]}
          </Text>
        )}

        <View style={styles.tagsWrap}>
          {PROMPTS.map(t => {
            const active = tags.includes(t);
            return (
              <Pressable
                key={t}
                onPress={() => toggleTag(t)}
                style={[styles.tag, active && styles.tagActive]}
              >
                <Text style={[styles.tagText, active && styles.tagTextActive]}>{t}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>COMENTARIO (OPCIONAL)</Text>
          <TextInput
            style={styles.input}
            placeholder="Cuéntanos más sobre tu pedido..."
            placeholderTextColor="#C9C1B8"
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            maxLength={280}
          />
          <Text style={styles.charCount}>{comment.length} / 280</Text>
        </View>

        <View style={styles.aurios}>
          <Ionicons name="leaf-outline" size={16} color="#3AAFA9" />
          <Text style={styles.auriosText}>
            Ganarás <Text style={styles.auriosAccent}>+120 Aurios</Text> al publicar
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={({ pressed }) => [pressed && { opacity: 0.9 }]}
        >
          <LinearGradient
            colors={canSubmit ? ['#86231A', '#A63A2F'] : ['#D4CFC9', '#C4BEB8']}
            style={styles.submitBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#FDFAF7" />
            <Text style={styles.submitBtnText}>Publicar reseña</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB' },
  nav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingTop: 6, paddingBottom: 4,
  },
  navLabel: { fontWeight: '600', fontSize: 11, color: '#6B645C', letterSpacing: 2, textTransform: 'uppercase' },
  navSkip: { width: 64, alignItems: 'flex-end', justifyContent: 'center', height: 44 },
  navSkipText: { fontSize: 13, color: '#9A938A', fontWeight: '500' },
  pressed: { opacity: 0.7 },
  scrollContent: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 32, gap: 24 },
  header: { gap: 10 },
  eyebrow: { fontWeight: '600', fontSize: 10, color: '#A63A2F', letterSpacing: 2.2, textTransform: 'uppercase' },
  displayTitle: { fontWeight: '700', fontSize: 32, lineHeight: 36, color: '#2E2A26', letterSpacing: -0.8 },
  displayAccent: { color: '#A63A2F' },
  subtitle: { fontSize: 14, color: '#6B645C', lineHeight: 20 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  starHit: { padding: 6 },
  starsLabel: {
    textAlign: 'center', fontSize: 13, fontWeight: '600',
    color: '#A63A2F', letterSpacing: 1.4, textTransform: 'uppercase',
  },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#EDE7DF',
  },
  tagActive: { backgroundColor: '#A63A2F' },
  tagText: { fontSize: 12, fontWeight: '600', color: '#6B645C', letterSpacing: 0.4 },
  tagTextActive: { color: '#FDFAF7' },
  inputWrap: { gap: 8 },
  inputLabel: { fontSize: 9.5, fontWeight: '700', letterSpacing: 1.8, color: '#9A938A', textTransform: 'uppercase' },
  input: {
    backgroundColor: '#FDFAF7', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#3D3D3D', lineHeight: 20,
    minHeight: 96, textAlignVertical: 'top',
    borderWidth: 1, borderColor: 'rgba(140,133,123,0.15)',
  },
  charCount: { fontSize: 11, color: '#C9C1B8', textAlign: 'right' },
  aurios: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#EDF7F6', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  auriosText: { fontSize: 13, color: '#2E2A26', fontWeight: '500' },
  auriosAccent: { color: '#3AAFA9', fontWeight: '700' },
  footer: { paddingHorizontal: 22, paddingTop: 12 },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 17, borderRadius: 999,
  },
  submitBtnText: { color: '#FDFAF7', fontWeight: '700', fontSize: 15, letterSpacing: 0.2 },
});
