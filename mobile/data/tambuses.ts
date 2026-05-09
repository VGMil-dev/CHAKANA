export interface Tambu {
  id: string;
  name: string;
  barrio: string;
  cat: string;
  tone: string;
  rating: number;
  /** Number of reviews */
  n: number;
  /** Max % returned as Aurios on each purchase */
  aurios: number;
}

export const TAMBUSES: Tambu[] = [
  {
    id: 'tambu-san-sebastian',
    name: 'Tambu San Sebastián',
    barrio: 'San Sebastián · 0.4 km',
    cat: 'CAFÉ',
    tone: 'clay',
    rating: 4.9,
    n: 312,
    aurios: 12,
  },
  {
    id: 'hilos-de-susudel',
    name: 'Hilos de Susudel',
    barrio: 'El Vado · 1.1 km',
    cat: 'TEXTIL',
    tone: 'weave',
    rating: 4.8,
    n: 187,
    aurios: 18,
  },
  {
    id: 'panaderia-vieja-plaza',
    name: 'Panadería Vieja Plaza',
    barrio: 'Centro · 0.6 km',
    cat: 'PAN',
    tone: 'ember',
    rating: 4.7,
    n: 421,
    aurios: 8,
  },
];

export function getTambu(id: string): Tambu | undefined {
  return TAMBUSES.find(t => t.id === id);
}
