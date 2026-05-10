import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../src/hooks/useAuth'

export function useRequireAuth() {
  const { isConnected, isAuthLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected && !isAuthLoading) {
      router.replace('/login')
    }
  }, [isConnected, isAuthLoading, router])

  return isConnected
}
