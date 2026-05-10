# Dev 2 -- Frontend Mobile Logic

**Rol:** Arquitectura de estado, validaciones y conexión con backend.

---

## Carga de Contexto al Iniciar Sesión

**Claude Code:** usa `/chakana-memory`
**Otros agentes:** lee `memory/AGENT_STARTER.md` y sigue el protocolo ahí descrito.

Archivos clave para este rol:
- `memory/chakana_state_services.md` — Zustand stores existentes, estado de integraciones
- `memory/supabase-contracts.md` — firmas de funciones que Dev 4 entrega
- `memory/chakana_built_vs_pending.md` — qué servicios NO están integrados aún

---

## Tu Scope

- Zustand store (slices: User, Business, UI)
- Conexión de componentes UI con estado
- Validación de formularios
- Lógica del slider de descuento (tokenomics)
- Cliente Supabase (queries, inserts)
- Manejo de loading/error states

## NO Tocar

- Componentes visuales puros (estilos, animaciones) — eso es Dev 1
- Firmado de transacciones blockchain — eso es Dev 3
- Edge Functions / endpoints backend — eso es Dev 4

---

## Stores Existentes

```
store/auth.ts   → useAuthStore: isAuthenticated, user (name, email, walletAddress, role)
store/cart.ts   → useCartStore: items[], addItem, removeItem, clearCart
                  Selectores: useCartItems, useCartCount, useCartTotal, useItemQty(id)
```

## Arquitectura de Estado (a completar)

```
Zustand AppStore
  |-- auth (implementado): isAuthenticated, user, role
  |-- cart (implementado): items[], qty, total
  |-- reviews (pendiente): currentReview, reviews[]
  |-- ui (pendiente): isLoading, activeModal, errorMessage
  |-- aurios (pendiente): balance, pendingMint
```

---

## Lógica Crítica: Slider de Descuento

```
// En data/checkout.ts:
CHECKOUT_CONFIG = { maxDiscountPct: 25, railRange: 33, initialDiscountPct: 18 }

// Fórmula:
aurios_descuento = subtotal_usd * 100 * (pct / 100)
// 1 Aurio = $0.01 USD
// Max descuento = 25% del subtotal
// Si usuario no tiene suficientes Aurios → bloquear al max balance
```

---

## Notas Técnicas

- **Supabase en RN:** Necesita polyfill de URL y localStorage adapter de expo-sqlite para auth.
- Consultar `memory/supabase-contracts.md` para las firmas exactas de las funciones.
- `hooks/useAuth.ts` tiene credenciales hardcoded como fallback offline.

---

## Contratos con Otros Devs

- **Recibes de Dev 1:** Componentes UI con props tipadas. Tú los conectas con estado.
- **Entregas a Dev 3:** Datos limpios para transacciones (monto, aurios a transferir, pubkeys).
- **Consumes de Dev 4:** Endpoints de Supabase (insert reviews, fetch businesses, etc).

---

## Delegación IA vs Humano

- **IA:** Boilerplate de Zustand, types/interfaces TS, mocks de datos, setup cliente Supabase.
- **Humano:** Diseño de máquina de estados, lógica del slider (límites, porcentajes), edge cases.
