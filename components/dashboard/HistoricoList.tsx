"use client";

import { useState, useCallback } from 'react';
import { useUserHolerites, Holerite } from '@/hooks/useUserHolerites';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Trash2, Calendar, DollarSign, User, Building, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface HistoricoListProps {
  className?: string;
}

export function HistoricoList({ className }: HistoricoListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  
  const {
    holerites,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    fetchHolerites,
    deleteHolerite,
  } = useUserHolerites(10);

  // Debounce pour la recherche
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (term: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setIsSearching(true);
          fetchHolerites(1, term).finally(() => setIsSearching(false));
        }, 500);
      };
    })(),
    [fetchHolerites]
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handlePageChange = (page: number) => {
    fetchHolerites(page, searchTerm);
  };

  const handleDelete = async (holerite: Holerite) => {
    const success = await deleteHolerite(holerite.id);
    if (success) {
      toast({
        title: "Holerite excluído",
        description: "O holerite foi excluído com sucesso.",
      });
    } else {
      toast({
        title: "Erro",
        description: "Erro ao excluir o holerite.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar holerites: {error}</p>
            <Button 
              onClick={() => fetchHolerites(1, searchTerm)}
              className="mt-4"
            >
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header avec recherche */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Holerites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por mês, ano ou valor..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
              data-testid="search-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des holerites */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Holerites ({totalCount})</h3>
              {isSearching && <p className="text-sm text-gray-500">Buscando...</p>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : holerites.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum holerite encontrado</p>
              {searchTerm && (
                <p className="text-sm text-gray-400 mt-2">
                  Tente ajustar os termos de busca
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês/Ano</TableHead>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Salário Bruto</TableHead>
                      <TableHead>Data de Carregamento</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holerites.map((holerite) => (
                      <TableRow key={holerite.id} data-testid={`holerite-row-${holerite.id}`}>
                        <TableCell>
                          <Badge variant="outline">
                            {holerite.period || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            {holerite.nome || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            {holerite.empresa || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="font-medium">
                              {formatCurrency(holerite.salario_bruto)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">
                            {formatDate(holerite.created_at)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                data-testid={`delete-button-${holerite.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir este holerite? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(holerite)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {holerites.map((holerite) => (
                  <Card key={holerite.id} data-testid={`holerite-card-${holerite.id}`}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {holerite.period || 'N/A'}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <User className="h-4 w-4" />
                            {holerite.nome || 'N/A'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building className="h-4 w-4" />
                            {holerite.empresa || 'N/A'}
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              data-testid={`delete-button-${holerite.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este holerite? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(holerite)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="font-medium">
                            {formatCurrency(holerite.salario_bruto)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          Carregado em: {formatDate(holerite.created_at)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="mt-6">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Página {currentPage} de {totalPages} ({totalCount} holerites)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  data-testid="first-page-button"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  data-testid="prev-page-button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 py-1 text-sm">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  data-testid="next-page-button"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  data-testid="last-page-button"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 