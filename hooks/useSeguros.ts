import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface SeguroEntry {
  id: string;
  user_id: string;
  type: 'saude' | 'vida' | 'acidentes' | 'odontologico' | 'rcp' | 'pet';
  detected: boolean;
  comment: string;
  link: string;
  priority: number;
}

const fetchSeguros = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('seguros')
    .select('*')
    .eq('user_id', userId)
    .order('priority', { ascending: true });

  if (error) {
    console.error('Error fetching seguros:', error);
    throw new Error(error.message);
  }

  return data as SeguroEntry[];
};

export default function useSeguros(userId: string | null) {
  return useQuery({
    queryKey: ['seguros', userId],
    queryFn: () => {
      if (!userId) {
        return Promise.resolve([]);
      }
      return fetchSeguros(userId);
    },
    enabled: !!userId,
  });
}
