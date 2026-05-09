export type PedidoEstado = 'nuevo' | 'preparando' | 'listo' | 'entregado';

export interface PedidoItem {
  nombre: string;
  qty: number;
}

export interface Pedido {
  id: string;
  numero: string;
  cliente: string;
  items: PedidoItem[];
  total: number;
  estado: PedidoEstado;
  hace: string;
}

export const PEDIDOS_MOCK: Pedido[] = [
  {
    id: 'p47',
    numero: '#0047',
    cliente: 'Valentina Torres',
    items: [{ nombre: 'Café molido', qty: 2 }, { nombre: 'Pan de yema', qty: 1 }],
    total: 7.50,
    estado: 'nuevo',
    hace: 'hace 3 min',
  },
  {
    id: 'p46',
    numero: '#0046',
    cliente: 'Mateo Ramírez',
    items: [{ nombre: 'Mote pelado', qty: 1 }, { nombre: 'Chicha morada', qty: 2 }],
    total: 5.20,
    estado: 'preparando',
    hace: 'hace 12 min',
  },
  {
    id: 'p45',
    numero: '#0045',
    cliente: 'Ana Córdova',
    items: [{ nombre: 'Canela molida', qty: 3 }],
    total: 4.80,
    estado: 'listo',
    hace: 'hace 28 min',
  },
  {
    id: 'p44',
    numero: '#0044',
    cliente: 'Carlos Vega',
    items: [{ nombre: 'Panela', qty: 1 }, { nombre: 'Ají', qty: 2 }, { nombre: 'Hierba buena', qty: 1 }],
    total: 6.30,
    estado: 'entregado',
    hace: 'hace 1h',
  },
];

export const ESTADO_LABEL: Record<PedidoEstado, string> = {
  nuevo:      'NUEVO',
  preparando: 'PREPARANDO',
  listo:      'LISTO',
  entregado:  'ENTREGADO',
};

export const ESTADO_COLOR: Record<PedidoEstado, { indicator: string; pillBg: string; pillText: string }> = {
  nuevo:      { indicator: '#A63A2F', pillBg: 'rgba(166,58,47,0.10)',  pillText: '#A63A2F' },
  preparando: { indicator: '#C97A3A', pillBg: 'rgba(201,122,58,0.10)', pillText: '#C97A3A' },
  listo:      { indicator: '#3AAFA9', pillBg: 'rgba(58,175,169,0.12)', pillText: '#277B77' },
  entregado:  { indicator: '#C4BEB8', pillBg: 'rgba(154,147,138,0.10)', pillText: '#9A938A' },
};
