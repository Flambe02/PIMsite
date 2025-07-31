"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSupabase } from '@/components/supabase-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FileText, Calendar, DollarSign, Trash2, Eye, Upload, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Holerite {
  id: string;
  created_at: string;
  salario_bruto: number;
  salario_liquido: number;
  nome?: string;
  empresa?: string;
  structured_data?: any;
  period?: string;
}

export function HoleriteHistory() {
  const [holerites, setHolerites] = useState<Holerite[]>([]);
  const [filteredHolerites, setFilteredHolerites] = useState<Holerite[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSupabase();
  const supabase = createClient();
  const router = useRouter();
  const user = session?.user;

  useEffect(() => {
    if (user) {
      fetchHolerites();
    }
  }, [user]);

  // Filtrer les holerites basé sur la recherche
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredHolerites(holerites);
      return;
    }

    const filtered = holerites.filter(holerite => {
      const searchLower = searchTerm.toLowerCase();
      
      // Rechercher dans la période
      const period = getDisplayPeriod(holerite).toLowerCase();
      if (period.includes(searchLower)) return true;
      
      // Rechercher dans le salaire
      const salary = holerite.salario_bruto?.toString() || '';
      if (salary.includes(searchLower)) return true;
      
      // Rechercher dans la date de création
      const createdDate = formatDate(holerite.created_at).toLowerCase();
      if (createdDate.includes(searchLower)) return true;
      
      return false;
    });
    
    setFilteredHolerites(filtered);
  }, [searchTerm, holerites]);

  const fetchHolerites = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Fetching holerites for user:', user?.id);

      // D'abord, vérifions si l'utilisateur est connecté
      if (!user?.id) {
               console.log('❌ No user ID found');
       setError('Usuário não conectado');
        return;
      }

      // Vérifions d'abord la structure de la table
      const { data: tableInfo, error: tableError } = await supabase
        .from('holerites')
        .select('*')
        .limit(1);

             if (tableError) {
         console.error('❌ Table structure error:', tableError);
         setError(`Erro de estrutura da tabela: ${tableError.message}`);
         return;
       }

      console.log('✅ Table structure OK, columns:', tableInfo && tableInfo.length > 0 ? Object.keys(tableInfo[0]) : 'No data');

      // Maintenant, récupérons les holerites de l'utilisateur
      const { data, error, count } = await supabase
        .from('holerites')
        .select('id, created_at, salario_bruto, salario_liquido, nome, empresa, structured_data, period, user_id', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      console.log('📊 Query result:', { data, error, count, user_id: user.id });

             if (error) {
         console.error('❌ Query error:', error);
         setError(`Erro ao carregar holerites: ${error.message}`);
       } else {
         console.log('✅ Holerites loaded:', data?.length || 0, 'items');
         setHolerites(data || []);
         setFilteredHolerites(data || []);
       }
         } catch (err) {
       console.error('❌ Exception in fetchHolerites:', err);
       setError(`Erro ao carregar holerites: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
     } finally {
      setIsLoading(false);
    }
  };

  const deleteHolerite = async (id: string) => {
    try {
      // Supprimer les données liées
      await supabase.from('ocr_results').delete().eq('holerite_id', id);
      await supabase.from('analyses').delete().eq('holerite_id', id);
      
      // Supprimer le holerite
      const { error } = await supabase.from('holerites').delete().eq('id', id);
      
             if (error) {
         console.error('Erro ao excluir:', error);
         return false;
       }
      
      // Recharger la liste
      await fetchHolerites();
      return true;
         } catch (err) {
       console.error('Erro ao excluir:', err);
       return false;
     }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const formatUploadDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPeriodFromStructuredData = (structuredData: any): string => {
    if (!structuredData) return 'N/A';
    
    try {
      // Essayer différentes structures possibles
      const period = structuredData.period || 
                    structuredData.periodo || 
                    structuredData.mes_referencia ||
                    structuredData.month_reference;
      
      return period || 'N/A';
    } catch {
      return 'N/A';
    }
  };

  const getDisplayPeriod = (holerite: Holerite): string => {
    // D'abord essayer la colonne period
    if (holerite.period) {
      return holerite.period;
    }
    
    // Ensuite essayer structured_data
    if (holerite.structured_data) {
      const periodFromData = getPeriodFromStructuredData(holerite.structured_data);
      if (periodFromData !== 'N/A') {
        return periodFromData;
      }
    }
    
    // Enfin, utiliser la date de création formatée
    try {
      const date = new Date(holerite.created_at);
      return date.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
                     <p className="text-red-600 mb-4">{error}</p>
           <Button onClick={fetchHolerites} variant="outline">
             Tentar novamente
           </Button>
        </CardContent>
      </Card>
    );
  }

  if (holerites.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
                     <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
           <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum holerite encontrado</h3>
           <p className="text-gray-600 mb-4">Comece fazendo upload do seu primeiro holerite</p>
          <Button 
            onClick={() => router.push('/br/scan-new-pim')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
                         <Upload className="w-4 h-4 mr-2" />
             Fazer Upload de Holerite
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (filteredHolerites.length === 0 && searchTerm.trim()) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
                     <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
           <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
           <p className="text-gray-600 mb-4">Nenhum holerite corresponde à sua pesquisa</p>
           <Button 
             onClick={() => setSearchTerm('')}
             variant="outline"
           >
             Limpar pesquisa
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold text-gray-900">Últimos Holerites</h3>
         <Button 
           onClick={() => router.push('/br/dashboard/historico')}
           variant="outline"
           size="sm"
         >
           Ver todos
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                 <Input
           type="text"
           placeholder="Pesquisar por período, salário ou data..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="pl-10"
         />
      </div>
      
      {filteredHolerites.map((holerite) => (
        <Card key={holerite.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
                             <div className="flex-1">
                 <div className="flex items-center gap-3 mb-3">
                   <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                     Período: {getDisplayPeriod(holerite)}
                   </Badge>
                 </div>
                 
                 <div className="space-y-2">
                   <div className="flex items-center gap-2 text-sm">
                     <Calendar className="h-3 w-3 text-gray-400" />
                     <span className="text-gray-600">
                       <span className="font-medium">Enviado em:</span> {formatUploadDate(holerite.created_at)}
                     </span>
                   </div>
                   
                   <div className="flex items-center gap-2 text-sm">
                     <DollarSign className="h-3 w-3 text-green-500" />
                     <span className="font-medium text-green-700">
                       Salário bruto: {formatCurrency(holerite.salario_bruto)}
                     </span>
                   </div>
                 </div>
               </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/br/dashboard/payslip/${holerite.id}`)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                                           <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                     <AlertDialogDescription>
                       Tem certeza de que deseja excluir este holerite? Esta ação é irreversível.
                     </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                                             <AlertDialogCancel>Cancelar</AlertDialogCancel>
                       <AlertDialogAction
                         onClick={() => deleteHolerite(holerite.id)}
                         className="bg-red-600 hover:bg-red-700"
                       >
                         Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
             {filteredHolerites.length >= 5 && (
         <div className="text-center pt-4">
           <Button 
             onClick={() => router.push('/br/dashboard/historico')}
             variant="outline"
             className="w-full"
           >
             Ver todos os holerites
           </Button>
         </div>
       )}
    </div>
  );
} 