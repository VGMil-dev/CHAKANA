import type { InsightTone } from '../components/dashboard/InsightCard';
import type { MetricTone } from '../components/dashboard/MetricCard';

export interface WeekHeader {
  tambuName: string;
  dateRange: string;
  title: string;
  accentLine: string;
}

export interface RatingMetric {
  tone: MetricTone;
  eyebrow: string;
  value: string;
  unit: string;
  sub: string;
  /** 1–5 dots filled */
  ratingActive: number;
}

export interface ReviewsMetric {
  tone: MetricTone;
  eyebrow: string;
  value: string;
  unit: string;
  trendText: string;
  /** Bar chart values, last bar = current week */
  weeklyData: number[];
}

export interface NarratorData {
  title: string;
  duration: string;
  totalSeconds: number;
}

export interface InsightData {
  tone: InsightTone;
  eyebrow: string;
  body: string;
}

export interface WeekSnapshot {
  header: WeekHeader;
  ratingMetric: RatingMetric;
  reviewsMetric: ReviewsMetric;
  auriosTotal: number;
  narrator: NarratorData;
  insights: InsightData[];
}

export const DASHBOARD_MOCK: WeekSnapshot = {
  header: {
    tambuName: 'Tambu San Sebastián',
    dateRange: 'SEMANA · 28 ABR — 04 MAY',
    title: 'El pulso',
    accentLine: 'del barrio.',
  },

  ratingMetric: {
    tone: 'red',
    eyebrow: 'RATING',
    value: '4.9',
    unit: '/ 5',
    sub: '312 voces de barrio',
    ratingActive: 5,
  },

  reviewsMetric: {
    tone: 'jade',
    eyebrow: 'RESEÑAS',
    value: '+12',
    unit: 'esta semana',
    trendText: '↑ 38% vs. sem pasada',
    weeklyData: [3, 5, 4, 7, 9, 11, 12],
  },

  auriosTotal: 4218,

  narrator: {
    title: 'Resumen narrado\nde tu semana.',
    duration: '2 min · Locución de barrio',
    totalSeconds: 120,
  },

  insights: [
    {
      tone: 'jade',
      eyebrow: 'RECURRENCIA',
      body: '6 embajadores nuevos volvieron 3 veces. Reconocelos.',
    },
    {
      tone: 'amber',
      eyebrow: 'HORA PICO',
      body: 'Martes 8–10am supera tu capacidad. ¿Pre-orden?',
    },
  ],
};
