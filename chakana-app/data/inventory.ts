export interface Product {
  id: string;
  title: string;
  type: string;
  /** Price in Aurios */
  price: number;
  image: ReturnType<typeof require>;
}

// All items share the placeholder until real photos are available
const PH = require('../assets/images/tambu_placeholder.webp');

const INVENTORY: Record<string, Product[]> = {
  'tambu-san-sebastian': [
    { id: 'tsb-1', title: 'Café de altura · Saraguro',  type: 'CAFÉ',       price: 12,  image: PH },
    { id: 'tsb-2', title: 'Bizcocho de panela',          type: 'PASTELERÍA', price: 8,   image: PH },
    { id: 'tsb-3', title: 'Empanada de viento',          type: 'PASTELERÍA', price: 8,   image: PH },
    { id: 'tsb-4', title: 'Té de hierbas andinas',       type: 'INFUSIÓN',   price: 6,   image: PH },
    { id: 'tsb-5', title: 'Chocolate artesanal',         type: 'BEBIDA',     price: 14,  image: PH },
    { id: 'tsb-6', title: 'Tamal de maíz morado',        type: 'COMIDA',     price: 10,  image: PH },
    { id: 'tsb-7', title: 'Jugo de uvilla',              type: 'BEBIDA',     price: 7,   image: PH },
    { id: 'tsb-8', title: 'Tostado con ají',             type: 'SNACK',      price: 5,   image: PH },
  ],

  'hilos-de-susudel': [
    { id: 'hds-1', title: 'Poncho de alpaca',            type: 'TEXTIL',     price: 115, image: PH },
    { id: 'hds-2', title: 'Chalina tejida a mano',       type: 'TEXTIL',     price: 65,  image: PH },
    { id: 'hds-3', title: 'Bolso de macramé',            type: 'ACCESORIO',  price: 48,  image: PH },
    { id: 'hds-4', title: 'Tapiz andino 60×90',          type: 'DECORACIÓN', price: 130, image: PH },
    { id: 'hds-5', title: 'Mochila de lana natural',     type: 'TEXTIL',     price: 90,  image: PH },
    { id: 'hds-6', title: 'Camino de mesa bordado',      type: 'HOGAR',      price: 55,  image: PH },
    { id: 'hds-7', title: 'Pulseras de hilo cuzqueño',   type: 'JOYERÍA',    price: 18,  image: PH },
    { id: 'hds-8', title: 'Gorro de lana merino',        type: 'TEXTIL',     price: 35,  image: PH },
  ],

  'panaderia-vieja-plaza': [
    { id: 'pvp-1', title: 'Pan de yuca',                 type: 'PAN',        price: 6,   image: PH },
    { id: 'pvp-2', title: 'Rosca de maíz',               type: 'PAN',        price: 8,   image: PH },
    { id: 'pvp-3', title: 'Humita de dulce',             type: 'PASTELERÍA', price: 10,  image: PH },
    { id: 'pvp-4', title: 'Pan de quinoa integral',      type: 'PAN',        price: 9,   image: PH },
    { id: 'pvp-5', title: 'Galleta de anís',             type: 'GALLETA',    price: 5,   image: PH },
    { id: 'pvp-6', title: 'Bizcochuelo de panela',       type: 'PASTELERÍA', price: 12,  image: PH },
    { id: 'pvp-7', title: 'Croissant de mantequilla',    type: 'VIENNOISERIE',price: 11, image: PH },
    { id: 'pvp-8', title: 'Muffin de blueberry andino',  type: 'PASTELERÍA', price: 10,  image: PH },
  ],
};

export function getProducts(tambuId: string): Product[] {
  return INVENTORY[tambuId] ?? [];
}
