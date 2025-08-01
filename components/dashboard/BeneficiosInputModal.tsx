'use client';

import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';

interface Beneficio {
  id?: string;
  nome: string;
  valor: number;
  tipo: 'vale_refeicao' | 'vale_alimentacao' | 'vale_transporte' | 'plano_saude' | 'plano_odontologico' | 'gympass' | 'aluguel_veiculo' | 'outros';
  descricao?: string;
}

interface BeneficiosInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedBenefits: string[]; // Bénéfices détectés par l'IA
  onSave: (beneficios: Beneficio[]) => void;
  holeriteData?: any; // Données de la feuille de paie pour récupérer les valeurs
}

const BENEFICIOS_TYPES = [
  { value: 'vale_refeicao', label: 'Vale Refeição', icon: '🍽️' },
  { value: 'vale_alimentacao', label: 'Vale Alimentação', icon: '🥗' },
  { value: 'vale_transporte', label: 'Vale Transporte', icon: '🚌' },
  { value: 'plano_saude', label: 'Plano de Saúde', icon: '🏥' },
  { value: 'plano_odontologico', label: 'Plano Odontológico', icon: '🦷' },
  { value: 'gympass', label: 'Gympass', icon: '💪' },
  { value: 'aluguel_veiculo', label: 'Aluguel de Veículo', icon: '🚗' },
  { value: 'outros', label: 'Outros', icon: '📋' },
];

export default function BeneficiosInputModal({ 
  isOpen, 
  onClose, 
  detectedBenefits, 
  onSave,
  holeriteData
}: BeneficiosInputModalProps) {
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  // Fonction pour extraire les valeurs des bénéfices depuis la feuille de paie
  const extractBenefitValue = (benefitName: string): number => {
    if (!holeriteData) return 0;
    
    // Chercher dans différentes structures de données
    const beneficiosArray = holeriteData?.structured_data?.final_data?.beneficios ||
                           holeriteData?.structured_data?.beneficios ||
                           holeriteData?.beneficios ||
                           [];
    
    if (Array.isArray(beneficiosArray)) {
      const foundBenefit = beneficiosArray.find((b: any) => 
        b && typeof b === 'object' && 
        (b.nome?.toLowerCase().includes(benefitName.toLowerCase()) ||
         benefitName.toLowerCase().includes(b.nome?.toLowerCase()))
      );
      
      if (foundBenefit) {
        return foundBenefit.valor || foundBenefit.value || 0;
      }
    }
    
    return 0;
  };

  // Fonction pour déterminer le type de bénéfice basé sur le nom
  const getBenefitType = (benefitName: string): Beneficio['tipo'] => {
    const name = benefitName.toLowerCase();
    
    if (name.includes('refeição') || name.includes('refeicao')) return 'vale_refeicao';
    if (name.includes('alimentação') || name.includes('alimentacao')) return 'vale_alimentacao';
    if (name.includes('transporte')) return 'vale_transporte';
    if (name.includes('saúde') || name.includes('saude')) return 'plano_saude';
    if (name.includes('odontológico') || name.includes('odontologico') || name.includes('dental')) return 'plano_odontologico';
    if (name.includes('gympass') || name.includes('academia')) return 'gympass';
    if (name.includes('veículo') || name.includes('veiculo') || name.includes('carro')) return 'aluguel_veiculo';
    
    return 'outros';
  };

  // Charger les bénéfices existants et initialiser avec les détectés
  useEffect(() => {
    const initializeBeneficios = async () => {
      if (!isOpen) return;
      
      setIsInitializing(true);
      
      try {
        // 1. Charger les bénéfices existants de l'utilisateur
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: existingBeneficios } = await supabase
          .from('user_beneficios')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // 2. Créer un map des bénéfices existants par nom
        const existingBeneficiosMap = new Map<string, Beneficio>();
        if (existingBeneficios) {
          existingBeneficios.forEach((beneficio: any) => {
            existingBeneficiosMap.set(beneficio.nome.toLowerCase(), beneficio);
          });
        }

        // 3. Initialiser les bénéfices : d'abord les existants, puis les détectés
        const initialBeneficios: Beneficio[] = [];

        // Ajouter les bénéfices existants
        existingBeneficiosMap.forEach((beneficio) => {
          initialBeneficios.push({
            id: beneficio.id,
            nome: beneficio.nome,
            valor: beneficio.valor,
            tipo: beneficio.tipo,
            descricao: beneficio.descricao
          });
        });

        // Ajouter les bénéfices détectés qui ne sont pas déjà présents
        detectedBenefits.forEach((benefitName) => {
          const normalizedName = benefitName.toLowerCase();
          if (!existingBeneficiosMap.has(normalizedName)) {
            const detectedValue = extractBenefitValue(benefitName);
            initialBeneficios.push({
              nome: benefitName,
              valor: detectedValue,
              tipo: getBenefitType(benefitName),
              descricao: ''
            });
          }
        });

        setBeneficios(initialBeneficios);
        
      } catch (error) {
        console.error('Erro ao inicializar benefícios:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar benefícios existentes.",
          variant: "destructive"
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initializeBeneficios();
  }, [isOpen, detectedBenefits, holeriteData]);

  const addBeneficio = () => {
    setBeneficios(prev => [...prev, {
      nome: '',
      valor: 0,
      tipo: 'outros',
      descricao: ''
    }]);
  };

  const removeBeneficio = (index: number) => {
    setBeneficios(prev => prev.filter((_, i) => i !== index));
  };

  const updateBeneficio = (index: number, field: keyof Beneficio, value: any) => {
    setBeneficios(prev => prev.map((beneficio, i) => 
      i === index ? { ...beneficio, [field]: value } : beneficio
    ));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Filtrer les bénéfices avec des valeurs valides
      const validBeneficios = beneficios.filter(b => b.nome.trim() && b.valor > 0);
      
      if (validBeneficios.length === 0) {
        toast({
          title: "Atenção",
          description: "Adicione pelo menos um benefício com valor válido.",
          variant: "destructive"
        });
        return;
      }

      // Sauvegarder dans Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado.",
          variant: "destructive"
        });
        return;
      }

      // Supprimer les anciens bénéfices de l'utilisateur
      await supabase
        .from('user_beneficios')
        .delete()
        .eq('user_id', user.id);

      // Insérer les nouveaux bénéfices
      const beneficiosToInsert = validBeneficios.map(beneficio => ({
        user_id: user.id,
        nome: beneficio.nome.trim(),
        valor: beneficio.valor,
        tipo: beneficio.tipo,
        descricao: beneficio.descricao?.trim() || null,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('user_beneficios')
        .insert(beneficiosToInsert);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${validBeneficios.length} benefício(s) salvo(s) com sucesso.`,
      });

      onSave(validBeneficios);
      onClose();
      
    } catch (error) {
      console.error('Erro ao salvar benefícios:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar os benefícios. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Benefícios Mensais</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {isInitializing ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando benefícios...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  {detectedBenefits.length > 0 
                    ? `Detectamos ${detectedBenefits.length} benefício(s) na sua folha de pagamento. Os valores foram pré-preenchidos quando disponíveis. Confirme ou ajuste os valores reais que você recebe:`
                    : "Adicione seus benefícios mensais. Informe o valor total que você recebe de cada benefício:"
                  }
                </p>
              </div>

              <div className="space-y-4">
                {beneficios.map((beneficio, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`nome-${index}`}>Nome do Benefício</Label>
                        <Input
                          id={`nome-${index}`}
                          value={beneficio.nome}
                          onChange={(e) => updateBeneficio(index, 'nome', e.target.value)}
                          placeholder="Ex: Vale Refeição"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`tipo-${index}`}>Tipo</Label>
                        <select
                          id={`tipo-${index}`}
                          value={beneficio.tipo}
                          onChange={(e) => updateBeneficio(index, 'tipo', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          {BENEFICIOS_TYPES.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`valor-${index}`}>Valor Mensal (R$)</Label>
                        <Input
                          id={`valor-${index}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={beneficio.valor}
                          onChange={(e) => updateBeneficio(index, 'valor', parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label htmlFor={`descricao-${index}`}>Descrição (opcional)</Label>
                      <Input
                        id={`descricao-${index}`}
                        value={beneficio.descricao || ''}
                        onChange={(e) => updateBeneficio(index, 'descricao', e.target.value)}
                        placeholder="Ex: Cobertura para refeições em restaurantes parceiros"
                      />
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeBeneficio(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  onClick={addBeneficio}
                  className="mr-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Benefício
                </Button>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-1" />
                  {isLoading ? 'Salvando...' : 'Salvar Benefícios'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 