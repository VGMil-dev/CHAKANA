import { useCallback, useEffect, useState } from 'react';
import { getProductsByBusiness } from '../services/supabase';
import type { Tables } from '../types/database';

export type Product = Tables<'products'>;

type UseProductsResult = {
  products: Product[];
  isLoadingProducts: boolean;
  productsError: string | null;
  refreshProducts: () => Promise<void>;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo cargar el inventario.';
}

export function useProducts(businessId: string | null): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const refreshProducts = useCallback(async (): Promise<void> => {
    if (!businessId) {
      setProducts([]);
      setProductsError('No se encontró el Tambú.');
      return;
    }

    setIsLoadingProducts(true);
    setProductsError(null);
    try {
      const nextProducts = await getProductsByBusiness(businessId);
      setProducts(nextProducts);
    } catch (error) {
      setProducts([]);
      setProductsError(getErrorMessage(error));
    } finally {
      setIsLoadingProducts(false);
    }
  }, [businessId]);

  useEffect(() => {
    void refreshProducts();
  }, [refreshProducts]);

  return {
    products,
    isLoadingProducts,
    productsError,
    refreshProducts,
  };
}
