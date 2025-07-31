import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSupabase } from '@/components/supabase-provider';

export interface Holerite {
  id: string;
  created_at: string;
  salario_bruto: number;
  salario_liquido: number;
  nome?: string;
  empresa?: string;
  structured_data?: any;
  period?: string;
}

interface UseUserHoleritesReturn {
  holerites: Holerite[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  fetchHolerites: (page?: number, search?: string) => Promise<void>;
  deleteHolerite: (id: string) => Promise<boolean>;
  refreshHolerites: () => Promise<void>;
}

export function useUserHolerites(itemsPerPage: number = 10): UseUserHoleritesReturn {
  const [holerites, setHolerites] = useState<Holerite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { session } = useSupabase();
  const supabase = createClient();
  const user = session?.user;

  const fetchHolerites = async (page: number = 1, search: string = '') => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('holerites')
        .select('id, created_at, salario_bruto, salario_liquido, nome, empresa, structured_data, period', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Appliquer la recherche si fournie
      if (search) {
        query = query.or(`period.ilike.%${search}%,nome.ilike.%${search}%,empresa.ilike.%${search}%`);
      }

      // Appliquer la pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setHolerites(data || []);
      setTotalCount(count || 0);
      setCurrentPage(page);
      setSearchTerm(search);
    } catch (err) {
      console.error('Erro ao buscar holerites:', err);
      setError('Erro ao carregar holerites');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHolerite = async (id: string): Promise<boolean> => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      return false;
    }

    try {
      // Supprimer les entrées liées dans d'autres tables
      await supabase.from('ocr_results').delete().eq('holerite_id', id);
      await supabase.from('analyses').delete().eq('holerite_id', id);
      
      // Supprimer le holerite
      const { error: deleteError } = await supabase
        .from('holerites')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Rafraîchir la liste
      await fetchHolerites(currentPage, searchTerm);
      return true;
    } catch (err) {
      console.error('Erro ao deletar holerite:', err);
      setError('Erro ao deletar holerite');
      return false;
    }
  };

  const refreshHolerites = async () => {
    await fetchHolerites(currentPage, searchTerm);
  };

  useEffect(() => {
    if (user?.id) {
      fetchHolerites(1);
    }
  }, [user?.id]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return {
    holerites,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    fetchHolerites,
    deleteHolerite,
    refreshHolerites,
  };
} 