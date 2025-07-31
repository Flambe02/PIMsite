import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/supabase-provider';
import { CheckupResult } from '@/types/financial-checkup';

export function useFinancialCheckup(userId?: string) {
  const { supabase } = useSupabase();
  const [checkups, setCheckups] = useState<CheckupResult[]>([]);
  const [latestCheckup, setLatestCheckup] = useState<CheckupResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchCheckups = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('financial_checkups')
          .select('*')
          .eq('user_id', userId)
          .order('checkup_date', { ascending: false });

        if (error) throw error;

        setCheckups(data || []);
        setLatestCheckup(data?.[0] || null);
      } catch (err) {
        console.error('Error fetching financial checkups:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckups();
  }, [userId, supabase]);

  const saveCheckup = async (checkup: Omit<CheckupResult, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_checkups')
        .insert([checkup])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setCheckups(prev => [data, ...prev]);
      setLatestCheckup(data);
      
      return data;
    } catch (err) {
      console.error('Error saving financial checkup:', err);
      throw err;
    }
  };

  const deleteCheckup = async (checkupId: string) => {
    try {
      const { error } = await supabase
        .from('financial_checkups')
        .delete()
        .eq('id', checkupId);

      if (error) throw error;

      // Update local state
      setCheckups(prev => prev.filter(c => c.id !== checkupId));
      if (latestCheckup?.id === checkupId) {
        setLatestCheckup(checkups[1] || null);
      }
    } catch (err) {
      console.error('Error deleting financial checkup:', err);
      throw err;
    }
  };

  return {
    checkups,
    latestCheckup,
    loading,
    error,
    saveCheckup,
    deleteCheckup,
  };
} 