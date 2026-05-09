import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../store/auth'

export function useRequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated])

  return isAuthenticated
}
