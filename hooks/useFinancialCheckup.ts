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

        // Convertir les données de la base de données vers le format TypeScript
        const convertedData = (data || []).map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          checkupDate: item.checkup_date,
          answers: item.answers,
          scores: item.scores,
          globalScore: item.global_score,
          comments: item.comments,
          country: item.country,
          language: item.language,
          version: item.version
        }));
        
        setCheckups(convertedData);
        setLatestCheckup(convertedData[0] || null);
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
      // Convertir les données TypeScript vers le format de la base de données
      const dbCheckup = {
        user_id: checkup.userId,
        checkup_date: checkup.checkupDate,
        answers: checkup.answers,
        scores: checkup.scores,
        global_score: checkup.globalScore,
        comments: checkup.comments,
        country: checkup.country,
        language: checkup.language,
        version: checkup.version
      };

      const { data, error } = await supabase
        .from('financial_checkups')
        .insert([dbCheckup])
        .select()
        .single();

      if (error) throw error;

      // Convertir la réponse vers le format TypeScript
      const convertedData = {
        id: data.id,
        userId: data.user_id,
        checkupDate: data.checkup_date,
        answers: data.answers,
        scores: data.scores,
        globalScore: data.global_score,
        comments: data.comments,
        country: data.country,
        language: data.language,
        version: data.version
      };

      // Update local state
      setCheckups(prev => [convertedData, ...prev]);
      setLatestCheckup(convertedData);
      
      return convertedData;
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