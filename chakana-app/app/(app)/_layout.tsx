import { Redirect, Stack } from 'expo-router'
import { useAuthStore } from '../../store/auth'

export default function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Redirect href="/login" />

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="carrito" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="perfil"  options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  )
}
