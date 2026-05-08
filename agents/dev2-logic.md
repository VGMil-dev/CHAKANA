# Dev 2 -- Frontend Mobile Logic

**Rol:** Arquitectura de estado, validaciones y conexion con backend.

---

## Tu Scope

- Zustand store (slices: User, Business, UI)
- Conexion de componentes UI con estado
- Validacion de formularios
- Logica del slider de descuento (tokenomics)
- Cliente Supabase (queries, inserts)
- Manejo de loading/error states

## NO Tocar

- Componentes visuales puros (estilos, animaciones) -- eso es Dev 1
- Firmado de transacciones blockchain -- eso es Dev 3
- Edge Functions / endpoints backend -- eso es Dev 4

---

## Arquitectura de Estado

```
Zustand AppStore
  |-- User Slice: walletPubKey, aurioBalance, isConnected
  |-- Business Slice: tambuActivo, listaTambus
  |-- Review Slice: reviews[], currentReview
  |-- UI Slice: isLoading, activeModal, errorMessage
```

---

## Logica Critica: Slider de Descuento

```
Total = $10.00
Aurios Disponibles = 1200 (= $12.00)
Max Permitido = 25% del Total = $2.50 = 250 Aurios

Si usuario intenta > 25%  -> bloquear slider
Si usuario no tiene suficientes Aurios -> bloquear al max balance
1 Aurio = $0.01 USD
```

---

## Notas Tecnicas

- **Supabase en RN:** Necesita polyfill de URL y localStorage adapter de expo-sqlite para auth.
- **Zustand:** Sintaxis recomendada por pmndrs/zustand para React Native.

```typescript
import { create } from 'zustand'
interface AppState {
  aurioBalance: number;
  updateBalance: (newBalance: number) => void;
}
export const useAppStore = create<AppState>()((set) => ({
  aurioBalance: 0,
  updateBalance: (balance) => set({ aurioBalance: balance }),
}));
```

---

## Contratos con Otros Devs

- **Recibes de Dev 1:** Componentes UI con props tipadas. Tu los conectas con estado.
- **Entregas a Dev 3:** Datos limpios para transacciones (monto, aurios a transferir, pubkeys).
- **Consumes de Dev 4:** Endpoints de Supabase (insert reviews, fetch businesses, etc).

---

## Delegacion IA vs Humano

- **IA:** Boilerplate de Zustand, types/interfaces TS, mocks de datos, setup cliente Supabase.
- **Humano:** Diseno de maquina de estados, logica del slider (limites, porcentajes), edge cases y timeouts.
