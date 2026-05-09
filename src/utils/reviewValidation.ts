const MIN_REVIEW_WORDS = 50;

export function countWords(text: string): number {
  const normalized = text.trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).filter(Boolean).length;
}

export function isReviewTextValid(text: string): boolean {
  return countWords(text) >= MIN_REVIEW_WORDS;
}

export function getReviewWordsRemaining(text: string): number {
  return Math.max(MIN_REVIEW_WORDS - countWords(text), 0);
}
