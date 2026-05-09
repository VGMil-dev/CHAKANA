import { useAuthStore } from '../store/auth'

// ─── Test accounts (replace entire block when Supabase is wired) ─────────────
const TEST_ACCOUNTS = [
  {
    email:    process.env.EXPO_PUBLIC_TEST_EMBAJADOR_EMAIL    ?? 'embajador@chakana.ec',
    password: process.env.EXPO_PUBLIC_TEST_EMBAJADOR_PASSWORD ?? 'chakana123',
    name:     process.env.EXPO_PUBLIC_TEST_EMBAJADOR_NAME     ?? 'Valentina Morocho',
    role:     'embajador' as const,
  },
  {
    email:    process.env.EXPO_PUBLIC_TEST_TAMBU_EMAIL    ?? 'tambu@chakana.ec',
    password: process.env.EXPO_PUBLIC_TEST_TAMBU_PASSWORD ?? 'chakana123',
    name:     process.env.EXPO_PUBLIC_TEST_TAMBU_NAME     ?? 'Tambu San Sebastián',
    role:     'tambu' as const,
  },
]

function fakeDelay() {
  return new Promise(resolve => setTimeout(resolve, 700))
}

// ─────────────────────────────────────────────────────────────────────────────

export function useAuth() {
  const { login, logout } = useAuthStore()

  // Teammate replaces body with: supabase.auth.signInWithPassword(...)
  async function signIn(
    email: string,
    password: string,
  ): Promise<{ error: string | null }> {
    await fakeDelay()

    const account = TEST_ACCOUNTS.find(
      a => a.email === email.trim().toLowerCase() && a.password === password,
    )

    if (!account) {
      return { error: 'Correo o contraseña incorrectos.' }
    }

    login({ name: account.name, email: account.email, role: account.role })
    return { error: null }
  }

  // Teammate replaces body with: supabase.auth.signUp(...)
  async function signUp(
    name: string,
    email: string,
    password: string,
    role: 'embajador' | 'tambu',
  ): Promise<{ error: string | null }> {
    await fakeDelay()

    if (!name || !email || !password) {
      return { error: 'Completa todos los campos.' }
    }

    login({ name: name.trim(), email: email.trim().toLowerCase(), role })
    return { error: null }
  }

  function signOut() {
    logout()
  }

  return { signIn, signUp, signOut }
}
