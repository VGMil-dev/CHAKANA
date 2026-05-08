import { getAllBusinesses } from '../services/supabase';
import { useAppStore } from '../store';
import type { Business } from '../store/slices/businessSlice';

type UseBusinessesResult = {
  listaTambus: Business[];
  tambuActivo: Business | null;
  isLoadingBusinesses: boolean;
  businessError: string | null;
  fetchBusinesses: () => Promise<void>;
  selectTambu: (business: Business) => void;
  clearSelection: () => void;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudieron cargar los tambus';
}

export function useBusinesses(): UseBusinessesResult {
  const listaTambus = useAppStore((state) => state.listaTambus);
  const tambuActivo = useAppStore((state) => state.tambuActivo);
  const isLoadingBusinesses = useAppStore((state) => state.isLoadingBusinesses);
  const businessError = useAppStore((state) => state.businessError);
  const setListaTambus = useAppStore((state) => state.setListaTambus);
  const setTambuActivo = useAppStore((state) => state.setTambuActivo);
  const setIsLoadingBusinesses = useAppStore((state) => state.setIsLoadingBusinesses);

  const fetchBusinesses = async (): Promise<void> => {
    setIsLoadingBusinesses(true);
    useAppStore.setState({ businessError: null });
    try {
      const businesses = await getAllBusinesses();
      setListaTambus(businesses);
      useAppStore.setState({ businessError: null });
    } catch (error) {
      useAppStore.setState({ businessError: getErrorMessage(error) });
    } finally {
      setIsLoadingBusinesses(false);
    }
  };

  return {
    listaTambus,
    tambuActivo,
    isLoadingBusinesses,
    businessError,
    fetchBusinesses,
    selectTambu: setTambuActivo,
    clearSelection: () => setTambuActivo(null),
  };
}
