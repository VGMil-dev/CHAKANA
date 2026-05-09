import { Redirect, Stack, usePathname, useRouter } from 'expo-router';
import { View } from 'react-native';

import { useAuthStore } from '../../store/auth';
import ChakanaDial, { type DialTab } from '../../components/core/ChakanaDial';

// Screens with their own bottom CTAs — dial stays hidden
const HIDDEN_ROUTES = ['/checkout', '/pagare', '/resena'];
// Payment flow — only center button visible (compact)
const COMPACT_ROUTES = ['/carrito'];

export default function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.user?.role ?? 'embajador');
  const pathname = usePathname();
  const router = useRouter();

  if (!isAuthenticated) return <Redirect href="/login" />;

  const hidden  = HIDDEN_ROUTES.includes(pathname);
  const compact = COMPACT_ROUTES.includes(pathname);

  const activeTab: DialTab | undefined =
    pathname === '/perfil'  ? 'yo'      :
    pathname === '/pedidos' ? 'pedidos' :
    pathname === '/carrito' ? undefined :
    undefined;

  const centerLabel = pathname === '/carrito' ? 'CHECKOUT' : undefined;

  const homeRoute = role === 'tambu' ? '/dashboard' : '/home';

  const onCenterPress = () => {
    if (pathname === '/carrito') router.push('/checkout' as any);
    else router.replace(homeRoute as any);
  };

  const onTabPress = (tab: DialTab) => {
    if (tab === 'yo')      router.push('/perfil'  as any);
    if (tab === 'carrito') router.push('/carrito' as any);
    if (tab === 'pedidos') router.push('/pedidos' as any);
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="carrito" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="perfil"  options={{ animation: 'slide_from_bottom' }} />
      </Stack>

      {!hidden && (
        <ChakanaDial
          compact={compact}
          activeTab={activeTab}
          centerLabel={centerLabel}
          onCenterPress={onCenterPress}
          onTabPress={onTabPress}
        />
      )}
    </View>
  );
}
