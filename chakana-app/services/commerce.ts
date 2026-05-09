import { getAccessToken } from './auth';
import { getCommerceApiUrl, supabase } from './supabase';

export type Tambu = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  merchant_id: string;
};

export type Product = {
  id: string;
  tambu_id: string;
  merchant_id: string;
  title: string;
  description?: string;
  price_cents: number;
  currency: string;
  active: boolean;
};

export type Order = {
  id: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  total_cents: number;
  currency: string;
  created_at: string;
};

async function authorizedFetch(path: string, init?: RequestInit) {
  const token = await getAccessToken();
  if (!token) throw new Error('No hay sesión activa');

  const response = await fetch(getCommerceApiUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error ?? 'Error inesperado de API');
  }

  return body;
}

export async function uploadProductImage(userId: string, productId: string, fileUri: string) {
  const fileName = `${userId}/${productId}-${Date.now()}.jpg`;

  const fileResponse = await fetch(fileUri);
  const blob = await fileResponse.blob();

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, blob, { contentType: 'image/jpeg', upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);

  return { storagePath: fileName, publicUrl: data.publicUrl };
}

export async function createTambu(payload: {
  title: string;
  description?: string;
  location?: string;
  merchant_name?: string;
}) {
  const body = await authorizedFetch('/api/tambus', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return body.tambu as Tambu;
}

export async function getTambu(tambuId: string) {
  const body = await authorizedFetch(`/api/tambus/${tambuId}`, { method: 'GET' });
  return body.tambu as Tambu & { products: Product[] };
}

export async function createProduct(tambuId: string, payload: {
  title: string;
  description?: string;
  price_cents: number;
  currency?: string;
  image_path?: string;
  image_url?: string;
}) {
  const body = await authorizedFetch(`/api/tambus/${tambuId}/products`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return body.product as Product;
}

export async function updateProduct(productId: string, payload: Partial<{
  title: string;
  description: string;
  price_cents: number;
  currency: string;
  active: boolean;
}>) {
  const body = await authorizedFetch(`/api/products/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return body.product as Product;
}

export async function syncCart(items: Array<{ product_id: string; quantity: number }>) {
  return authorizedFetch('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

export async function checkout(items: Array<{ product_id: string; quantity: number }>) {
  return authorizedFetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({
      items,
      success_url: 'https://example.com/checkout/success',
      cancel_url: 'https://example.com/checkout/cancel',
    }),
  });
}

export async function getOrder(orderId: string) {
  const body = await authorizedFetch(`/api/orders/${orderId}`, {
    method: 'GET',
  });

  return body.order as Order & { order_items: Array<Record<string, unknown>> };
}

export async function listMyOrders() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return [] as Order[];

  const { data, error } = await supabase
    .from('orders')
    .select('id, status, total_cents, currency, created_at')
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Order[];
}
