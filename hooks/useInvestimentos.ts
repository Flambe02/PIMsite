import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface Investimento {
  id: string;
  user_id: string;
  asset_class: string;
  amount: number;
  yield_pct: number | null;
  description: string;
}

const KEYS = ['previdência', 'previdencia', 'pgbl', 'vgbl'];

const fetchInvestimentos = async (userId: string): Promise<Investimento[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('investimentos')
    .select('*')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return (data || []) as Investimento[];
};

export default function useInvestimentos(userId: string | null, holeriteRaw?: any) {
  return useQuery({
    queryKey: ['investimentos', userId, !!holeriteRaw],
    queryFn: async () => {
      if (!userId) return [] as Investimento[];
      // 1. Check table
      const fromDb = await fetchInvestimentos(userId);
      if (fromDb && fromDb.length > 0) return fromDb;
      // 2. If nothing and holerite available, detect
      if (holeriteRaw) {
        const text = JSON.stringify(holeriteRaw).toLowerCase();
        const detected = KEYS.some(k => text.includes(k));
        if (detected) {
          return [{
            id: 'local-detect',
            user_id: userId,
            asset_class: 'previdencia',
            amount: 0,
            yield_pct: null,
            description: 'Previdência privada detectada no holerite',
          }];
        }
      }
      return [] as Investimento[];
    },
    enabled: !!userId,
  });
} 