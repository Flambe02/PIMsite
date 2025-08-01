import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface UserBeneficio {
  id: string;
  user_id: string;
  nome: string;
  valor: number;
  tipo: 'vale_refeicao' | 'vale_alimentacao' | 'vale_transporte' | 'plano_saude' | 'plano_odontologico' | 'gympass' | 'aluguel_veiculo' | 'outros';
  descricao?: string;
  created_at: string;
  updated_at: string;
}

export function useUserBeneficios() {
  const [beneficios, setBeneficios] = useState<UserBeneficio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Charger les bénéfices de l'utilisateur
  const loadBeneficios = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setBeneficios([]);
        return;
      }

      const { data, error } = await supabase
        .from('user_beneficios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBeneficios(data || []);
    } catch (err) {
      console.error('Erro ao carregar benefícios:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar benefícios');
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder les bénéfices
  const saveBeneficios = async (beneficiosToSave: Omit<UserBeneficio, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Supprimer les anciens bénéfices
      await supabase
        .from('user_beneficios')
        .delete()
        .eq('user_id', user.id);

      // Insérer les nouveaux bénéfices
      const beneficiosToInsert = beneficiosToSave.map(beneficio => ({
        ...beneficio,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('user_beneficios')
        .insert(beneficiosToInsert);

      if (error) throw error;

      // Recharger les bénéfices
      await loadBeneficios();
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao salvar benefícios:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao salvar benefícios' 
      };
    }
  };

  // Calculer le total des bénéfices
  const getTotalBeneficios = () => {
    return beneficios.reduce((total, beneficio) => total + beneficio.valor, 0);
  };

  // Obtenir les bénéfices par type
  const getBeneficiosByType = (tipo: UserBeneficio['tipo']) => {
    return beneficios.filter(beneficio => beneficio.tipo === tipo);
  };

  // Charger les bénéfices au montage du composant
  useEffect(() => {
    loadBeneficios();
  }, []);

  return {
    beneficios,
    isLoading,
    error,
    loadBeneficios,
    saveBeneficios,
    getTotalBeneficios,
    getBeneficiosByType
  };
} 