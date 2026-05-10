# Contratos Supabase — Dev 4 → Dev 2

## Importar desde
`import { ... } from '../services/supabase';`

## Auth
| Función | Firma | Retorna |
|---------|-------|---------|
| `signUp` | `(email, password, displayName)` | `User` |
| `signIn` | `(email, password)` | `User` |
| `signOut` | `()` | `void` |
| `getUser` | `()` | `User \| null` |
| `onAuthStateChange` | `(callback)` | `unsubscribe fn` |

## Reviews
| Función | Firma | Retorna |
|---------|-------|---------|
| `insertReview` | `({ business_id, text, solana_memo_signature? })` | `Review` |
| `getReviewsByBusiness` | `(businessId)` | `Review[]` |
| `getMyReviews` | `()` | `Review[]` |

## Businesses
| Función | Firma | Retorna |
|---------|-------|---------|
| `getAllBusinesses` | `()` | `Business[]` |
| `getBusinessById` | `(id)` | `Business` |

## Storage / Reportes
| Función | Firma | Retorna |
|---------|-------|---------|
| `getLatestAudioReport` | `(businessId)` | `string (URL) \| null` |

## Edge Function: generate-report
```
GET https://PROJECT_REF.supabase.co/functions/v1/generate-report?business_id=UUID
Authorization: Bearer ANON_KEY

Response: { audio_url: string, report_path: string }
```

## Variables de Entorno (compartir con el equipo via canal seguro)
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

## Nota sobre aurios_rewarded
Después de que el usuario inserta una review, el webhook del oráculo actualiza
`aurios_rewarded` a 1 en ~3 segundos. Dev 3 puede leer este campo para
ejecutar el `mintTo` en Solana desde el cliente.
