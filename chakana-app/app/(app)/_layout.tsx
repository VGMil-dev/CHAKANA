import { Redirect, Stack, usePathname, useRouter } from 'expo-router';
import { View } from 'react-native';

import { useAuth } from '../../src/hooks/useAuth';
import { useCartCount, useCartTotal } from '../../store/cart';
import ChakanaDial, { type DialTab } from '../../components/core/ChakanaDial';

const HIDDEN_ROUTES  = ['/checkout', '/pagare', '/resena'];
const COMPACT_ROUTES = ['/carrito'];

export default function AppLayout() {
  const { isConnected, isAuthLoading, role } = useAuth();
  const cartCount  = useCartCount();
  const cartTotal  = useCartTotal();
  const pathname   = usePathname();
  const router     = useRouter();

  if (!isConnected && !isAuthLoading) return <Redirect href="/login" />;

  const isInventario = pathname.startsWith('/inventario');
  const compact = COMPACT_ROUTES.includes(pathname) || (isInventario && cartCount > 0);
  const hidden  = HIDDEN_ROUTES.includes(pathname) || (pathname === '/carrito' && cartCount === 0);

  const activeTab: DialTab | undefined =
    pathname === '/perfil'  ? 'yo'      :
    pathname === '/pedidos' ? 'pedidos' :
    undefined;

  const centerLabel = pathname === '/carrito' ? 'CHECKOUT' : undefined;
  const cartPill    = isInventario && cartCount > 0
    ? { count: cartCount, total: cartTotal }
    : undefined;

  const homeRoute = role === 'tambu' ? '/dashboard' : '/home';

  const onCenterPress = () => {
    if (pathname === '/carrito')           router.push('/checkout' as any);
    else if (isInventario && cartCount > 0) router.push('/carrito'  as any);
    else                                    router.replace(homeRoute as any);
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
          cartPill={cartPill}
          role={role}
          onCenterPress={onCenterPress}
          onTabPress={onTabPress}
        />
      )}
    </View>
  );
}
