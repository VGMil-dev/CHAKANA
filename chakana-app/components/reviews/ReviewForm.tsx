import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

import { useReviewSubmit } from '../../src/hooks/useReviewSubmit';
import { useWallet } from '../../src/hooks/useWallet';
import { haptic } from '../../utils/haptics';

const STAR_COUNT = 5;
const PROMPTS_BY_STARS: Record<number, string[]> = {
  1: ['Producto en mal estado', 'Mala atención', 'Empaque deficiente', 'No lo recomendaría'],
  2: ['Frescura mejorable', 'Atención regular', 'Empaque mejorable', 'Llegó incompleto'],
  3: ['Producto aceptable', 'Atención correcta', 'Empaque básico', 'Podría mejorar'],
  4: ['Buen producto', 'Buena atención', 'Buen empaque', 'Lo recomendaría'],
  5: ['Frescura del producto', 'Atención del Tambu', 'Empaque sostenible', 'Lo recomendaría'],
};

interface ReviewFormProps {
  businessId: string;
}

function StarButton({
  filled,
  onPress,
  onPressIn,
  onPressOut,
  isLast,
}: {
  filled: boolean;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  isLast: boolean;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.75, { damping: 10, stiffness: 400 }),
      withSpring(1.3, { damping: 6, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 300 }),
    );
    if (isLast) haptic.success();
    else haptic.light();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.starHit}
    >
      <Animated.View style={animStyle}>
        <Ionicons
          name={filled ? 'star' : 'star-outline'}
          size={38}
          color={filled ? '#A63A2F' : '#C9C1B8'}
        />
      </Animated.View>
    </Pressable>
  );
}

export default function ReviewForm({ businessId }: ReviewFormProps) {
  const {
    currentReviewText,
    isSubmittingReview,
    reviewError,
    reviewSuccess,
    stars,
    tags,
    isTextValid,
    wordsCount,
    wordsRemaining,
    onTextChange,
    setStars,
    toggleTag,
    submitReview,
    resetForm,
  } = useReviewSubmit();
  const { walletPubKey, connectWallet, isConnectingWallet } = useWallet();
  const [hovered, setHovered] = useState(0);

  const missingWords = Math.max(wordsRemaining, 0);
  const canSubmit = isTextValid && stars > 0 && !isSubmittingReview;

  const handleSubmit = (): void => {
    if (!canSubmit) return;
    haptic.success();
    void submitReview({ businessId });
  };

  const display = hovered || stars;

  return (
    <View style={styles.card} testID="review-form">
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#A63A2F" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>RECOMPENSA · AURIO</Text>
          <Text style={styles.title}>Califica tu experiencia</Text>
        </View>
      </View>

      <View style={styles.starsContainer}>
        <View style={styles.starsRow}>
          {Array.from({ length: STAR_COUNT }).map((_, i) => (
            <StarButton
              key={i}
              filled={i < display}
              isLast={i === STAR_COUNT - 1}
              onPress={() => setStars(i + 1)}
              onPressIn={() => setHovered(i + 1)}
              onPressOut={() => setHovered(0)}
            />
          ))}
        </View>
        {stars > 0 && (
          <Text style={styles.starsLabel}>
            {['', 'Mejorable', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'][stars]}
          </Text>
        )}
      </View>

      <View style={styles.tagsWrap}>
        {stars > 0 &&
          (PROMPTS_BY_STARS[stars] ?? []).map((t) => {
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

      {!walletPubKey ? (
        <View style={styles.walletNotice}>
          <Ionicons name="wallet-outline" size={16} color="#A63A2F" />
          <Text style={styles.walletNoticeText}>Conecta tu wallet para recibir Aurios.</Text>
          <Pressable
            onPress={() => void connectWallet()}
            disabled={isConnectingWallet}
            style={({ pressed }) => [styles.walletConnectBtn, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.walletConnectBtnText}>
              {isConnectingWallet ? '...' : 'Conectar'}
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.inputWrap}>
        <Text style={styles.inputLabel}>TU COMENTARIO</Text>
        <TextInput
          testID="review-text-input"
          accessibilityLabel="review-text-input"
          style={styles.input}
          value={currentReviewText}
          onChangeText={onTextChange}
          multiline
          placeholder="Cuéntanos qué hizo especial tu experiencia en este Tambu."
          placeholderTextColor="#A09C96"
          editable={!isSubmittingReview}
        />
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.helper}>Mínimo 10 palabras para recompensa</Text>
        <Text
          style={[styles.counter, isTextValid && styles.counterReady]}
          testID="review-word-count"
        >
          {isTextValid ? `${wordsCount} palabras` : `Faltan ${missingWords} palabras`}
        </Text>
      </View>

      {reviewError ? (
        <Text style={styles.errorText} testID="review-error">
          {reviewError}
        </Text>
      ) : null}

      <View style={styles.actionsRow}>
        <Pressable
          testID="submit-review-button"
          accessibilityLabel="submit-review-button"
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitText}>
            {isSubmittingReview ? 'Enviando...' : 'Enviar reseña'}
          </Text>
        </Pressable>

        {currentReviewText.length > 0 || reviewSuccess || stars > 0 ? (
          <Pressable style={styles.resetButton} onPress={resetForm} disabled={isSubmittingReview}>
            <Text style={styles.resetText}>Limpiar</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FCF9F6',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(134, 35, 26, 0.08)',
    shadowColor: '#86231A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F7E7E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A63A2F',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3D3D3D',
    letterSpacing: -0.3,
  },
  starsContainer: {
    alignItems: 'center',
    marginBottom: 22,
    gap: 10,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  starHit: {
    padding: 4,
  },
  starsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A63A2F',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#EDE7DF',
    borderWidth: 1,
    borderColor: 'rgba(107, 100, 92, 0.1)',
  },
  tagActive: {
    backgroundColor: '#A63A2F',
    borderColor: '#A63A2F',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B645C',
  },
  tagTextActive: {
    color: '#FDFAF7',
  },
  walletNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F7E7E3',
    marginBottom: 16,
  },
  walletNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#7A2E26',
    fontWeight: '600',
  },
  walletConnectBtn: {
    backgroundColor: '#A63A2F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  walletConnectBtnText: {
    color: '#FDFAF7',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  inputWrap: {
    gap: 8,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: '#9A938A',
  },
  input: {
    minHeight: 110,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#2E2A26',
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(140,133,123,0.18)',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 2,
  },
  helper: {
    fontSize: 11,
    color: '#9A938A',
  },
  counter: {
    fontSize: 11,
    color: '#A63A2F',
    fontWeight: '700',
  },
  counterReady: {
    color: '#2E7D5B',
  },
  errorText: {
    marginTop: 12,
    color: '#A63A2F',
    fontSize: 12,
    fontWeight: '600',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#E7F3EC',
  },
  successText: {
    flex: 1,
    color: '#2E7D5B',
    fontSize: 12,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  submitButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: '#A63A2F',
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitText: {
    color: '#FDFAF7',
    fontSize: 15,
    fontWeight: '800',
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#F0EAE3',
  },
  resetText: {
    color: '#6B645C',
    fontSize: 13,
    fontWeight: '700',
  },
});
