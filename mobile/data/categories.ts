import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export interface MarketCategory {
  label: string;
  /** Ionicons icon name */
  iconName: ComponentProps<typeof Ionicons>['name'];
}

export const MARKET_CATEGORIES: MarketCategory[] = [
  { label: 'Todos',    iconName: 'apps-outline'        },
  { label: 'Café',     iconName: 'cafe-outline'         },
  { label: 'Arte',     iconName: 'color-palette-outline'},
  { label: 'Mercado',  iconName: 'basket-outline'       },
  { label: 'Talleres', iconName: 'construct-outline'    },
  { label: 'Ferias',   iconName: 'storefront-outline'   },
  { label: 'Pan',      iconName: 'restaurant-outline'   },
];
