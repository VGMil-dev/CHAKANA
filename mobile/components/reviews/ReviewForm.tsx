import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useReviewSubmit } from '../../../src/hooks/useReviewSubmit';
import { useWallet } from '../../../src/hooks/useWallet';

interface ReviewFormProps {
  businessId: string;
}

export default function ReviewForm({ businessId }: ReviewFormProps) {
  const {
    currentReviewText,
    isSubmittingReview,
    reviewError,
    reviewSuccess,
    isTextValid,
    wordsCount,
    wordsRemaining,
    onTextChange,
    submitReview,
    resetForm,
  } = useReviewSubmit();
  const { walletPubKey } = useWallet();

  const missingWords = Math.max(wordsRemaining, 0);
  const canSubmit = isTextValid && !isSubmittingReview;

  const handleSubmit = (): void => {
    if (!canSubmit) return;
    void submitReview({ businessId });
  };

  return (
    <View style={styles.card} testID="review-form">
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#A63A2F" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>RECOMPENSA · AURIO</Text>
          <Text style={styles.title}>Deja tu reseña</Text>
          <Text style={styles.subtitle}>
            Publica un comentario de al menos 50 palabras y gana 1 Aurio.
          </Text>
        </View>
      </View>

      {!walletPubKey ? (
        <View style={styles.walletNotice}>
          <Ionicons name="wallet-outline" size={16} color="#A63A2F" />
          <Text style={styles.walletNoticeText}>Conecta tu wallet para recibir Aurios.</Text>
        </View>
      ) : null}

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

      <View style={styles.metaRow}>
        <Text style={styles.helper}>Mínimo 50 palabras</Text>
        <Text
          style={[styles.counter, isTextValid && styles.counterReady]}
          testID="review-word-count">
          {isTextValid ? `${wordsCount} palabras` : `Faltan ${missingWords} palabras`}
        </Text>
      </View>

      {reviewError ? (
        <Text style={styles.errorText} testID="review-error">
          {reviewError}
        </Text>
      ) : null}

      {reviewSuccess ? (
        <View style={styles.successBox} testID="review-success">
          <Ionicons name="checkmark-circle-outline" size={16} color="#2E7D5B" />
          <Text style={styles.successText}>Comentario publicado. Ganaste 1 Aurio.</Text>
        </View>
      ) : null}

      <View style={styles.actionsRow}>
        <Pressable
          testID="submit-review-button"
          accessibilityLabel="submit-review-button"
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitText}>{isSubmittingReview ? 'Enviando...' : 'Enviar reseña'}</Text>
        </Pressable>

        {currentReviewText.length > 0 || reviewSuccess ? (
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
    marginTop: 34,
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
    alignItems: 'flex-start',
    marginBottom: 16,
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
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3D3D3D',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: '#6B645C',
  },
  walletNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F7E7E3',
    marginBottom: 12,
  },
  walletNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#7A2E26',
    fontWeight: '600',
  },
  input: {
    minHeight: 118,
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
    marginTop: 10,
  },
  helper: {
    fontSize: 12,
    color: '#9A938A',
  },
  counter: {
    fontSize: 12,
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
    marginTop: 16,
  },
  submitButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: '#A63A2F',
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitText: {
    color: '#FDFAF7',
    fontSize: 14,
    fontWeight: '800',
  },
  resetButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#F0EAE3',
  },
  resetText: {
    color: '#6B645C',
    fontSize: 12,
    fontWeight: '700',
  },
});
