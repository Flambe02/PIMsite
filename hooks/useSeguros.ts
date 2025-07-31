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

export default function useSeguros(userId: string | null, holeriteRaw?: any) {
  return useQuery({
    queryKey: ['seguros', userId, !!holeriteRaw],
    queryFn: async () => {
      if (!userId) {
        return Promise.resolve([]);
      }
      
      // 1. Vérifier d'abord la base de données
      const fromDb = await fetchSeguros(userId);
      if (fromDb && fromDb.length > 0) {
        return fromDb;
      }
      
      // 2. Si rien en DB et holerite disponible, détecter
      if (holeriteRaw) {
        const segurosExtraits = holeriteRaw.seguros || [];
        
        if (segurosExtraits.length > 0) {
          console.log('🔍 Seguros extraits par l\'IA:', segurosExtraits);
          return segurosExtraits.map((seguro: any, index: number) => ({
            id: `local-detect-${index}`,
            user_id: userId,
            type: 'saude' as const, // Type par défaut
            detected: true,
            comment: `Seguro detectado: ${seguro}`,
            link: '/recursos/seguros',
            priority: index + 1,
          }));
        }
      }
      
      return [];
    },
    enabled: !!userId,
  });
}
