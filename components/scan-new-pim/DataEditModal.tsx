"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, X, User, Plus, Trash2, Calculator, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: any;
  onSave: (editedData: any, customFields: any[]) => Promise<void>;
  country: string;
}

interface CustomField {
  id: string;
  title: string;
  value: string | number;
}

export const DataEditModal: React.FC<DataEditModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  country
}) => {
  const [editedData, setEditedData] = useState<any>({});
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isAutoCalculating, setIsAutoCalculating] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialiser les données éditées quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setEditedData(initialData);
      setIsAutoCalculating(true);
      
      // Parse existing period if it exists
      if (initialData.period || initialData.periodo) {
        const periodValue = initialData.period || initialData.periodo;
        const parts = periodValue.split('/');
        if (parts.length === 2) {
          setSelectedMonth(parts[0].toLowerCase());
          setSelectedYear(parts[1]);
        }
      }
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field: string, value: string | number | any[]) => {
    setEditedData((prev: any) => ({
      ...prev,
      [field]: value
    }));

    // Recalculer automatiquement les descontos si activé
    if (isAutoCalculating && field !== 'descontos') {
      recalculateDescontos();
    }
  };

  const recalculateDescontos = () => {
    let totalDescontos = 0;

    // Somme des impostos
    if (editedData.impostos && Array.isArray(editedData.impostos)) {
      totalDescontos += editedData.impostos.reduce((sum: number, item: any) => {
        return sum + (item.valor || item.value || 0);
      }, 0);
    }

    // Mettre à jour les descontos
    setEditedData((prev: any) => ({
      ...prev,
      descontos: totalDescontos
    }));
  };

  const addCustomField = () => {
    const newField: CustomField = {
      id: `custom_${Date.now()}`,
      title: '',
      value: ''
    };
    setCustomFields([...customFields, newField]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update period field with combined month/year
      if (selectedMonth && selectedYear) {
        const periodValue = `${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}/${selectedYear}`;
        setEditedData((prev: any) => ({
          ...prev,
          period: periodValue,
          periodo: periodValue
        }));
      }
      
      await onSave(editedData, customFields);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isFieldEdited = (field: string) => {
    return editedData[field] !== initialData[field];
  };

  const getFieldType = (field: string, value: any) => {
    // Gestion spéciale pour les tableaux d'objets complexes
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      return 'complex_array';
    }
    
    if (field.includes('salary') || field.includes('salario') || field.includes('valor') || field.includes('amount')) {
      return 'number';
    }
    if (field === 'statut' || field === 'profile_type') {
      return 'select';
    }
    if (field === 'period' || field === 'periodo') {
      return 'period_select';
    }
    if (field === 'descontos') {
      return 'auto_calculated';
    }
    return 'text';
  };

  const getSelectOptions = (field: string) => {
    if (field === 'statut' || field === 'profile_type') {
      return [
        { value: 'CLT', label: 'CLT' },
        { value: 'PJ', label: 'PJ' },
        { value: 'Autônomo', label: 'Autônomo' },
        { value: 'Estagiário', label: 'Estagiário' }
      ];
    }
    return [];
  };

  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      employee_name: 'Nome do Funcionário',
      company_name: 'Nome da Empresa',
      position: 'Cargo',
      period: 'Período',
      salary_bruto: 'Salário Bruto',
      salary_liquido: 'Salário Líquido',
      statut: 'Tipo de Contrato',
      profile_type: 'Tipo de Perfil',
      gross_salary: 'Salário Bruto',
      net_salary: 'Salário Líquido',
      total_earnings: 'Total de Vencimentos',
      total_deductions: 'Total de Descontos',
      impostos: 'Impostos',
      descontos: 'Descontos'
    };
    return labels[field] || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatComplexArray = (value: any[]): string => {
    if (!Array.isArray(value) || value.length === 0) return 'Nenhum item';
    
    return value.map(item => {
      if (typeof item === 'object' && item !== null) {
        // Gestion des formats différents
        const label = item.label || item.nome || item.description || 'Item';
        const valor = item.value || item.valor || item.amount || 0;
        
        // Formater les valeurs numériques
        const formattedValor = typeof valor === 'number' 
          ? `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          : valor;
          
        return `${label}: ${formattedValor}`;
      }
      return String(item);
    }).join(', ');
  };

  // Générer les options de mois
  const generateMonthOptions = () => {
    const months = [
      { value: 'janeiro', label: 'Janeiro' },
      { value: 'fevereiro', label: 'Fevereiro' },
      { value: 'março', label: 'Março' },
      { value: 'abril', label: 'Abril' },
      { value: 'maio', label: 'Maio' },
      { value: 'junho', label: 'Junho' },
      { value: 'julho', label: 'Julho' },
      { value: 'agosto', label: 'Agosto' },
      { value: 'setembro', label: 'Setembro' },
      { value: 'outubro', label: 'Outubro' },
      { value: 'novembro', label: 'Novembro' },
      { value: 'dezembro', label: 'Dezembro' }
    ];
    return months;
  };

  // Générer les options d'années
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
    return years.map(year => ({
      value: year.toString(),
      label: year.toString()
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Edit3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Editar Dados Extraídos</h2>
                <p className="text-sm text-gray-500">Corrija ou adicione informações extraídas do holerite</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Fields */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Básicos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(initialData).map(([field, value]) => {
                  if (value === null || value === undefined || value === '') return null;
                  
                  const fieldType = getFieldType(field, value);
                  const isEdited = isFieldEdited(field);
                  
                  // Ignorer les champs complexes et les champs supprimés
                  if (fieldType === 'complex_array' || field === 'credito' || field === 'outros' || field === 'beneficios' || field === 'seguros') return null;
                  
                  return (
                    <div key={field} className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        {getFieldLabel(field)}
                        {isEdited && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <User className="w-3 h-3 mr-1" />
                            Modificado
                          </span>
                        )}
                      </Label>
                      
                      {fieldType === 'period_select' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={selectedMonth}
                            onValueChange={setSelectedMonth}
                          >
                            <SelectTrigger className={isEdited ? 'border-blue-500 bg-blue-50' : ''}>
                              <SelectValue placeholder="Mês" />
                            </SelectTrigger>
                            <SelectContent>
                              {generateMonthOptions().map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={selectedYear}
                            onValueChange={setSelectedYear}
                          >
                            <SelectTrigger className={isEdited ? 'border-blue-500 bg-blue-50' : ''}>
                              <SelectValue placeholder="Ano" />
                            </SelectTrigger>
                            <SelectContent>
                              {generateYearOptions().map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : fieldType === 'auto_calculated' ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={editedData[field] || 0}
                              onChange={(e) => handleInputChange(field, parseFloat(e.target.value) || 0)}
                              className={isEdited ? 'border-blue-500 bg-blue-50' : ''}
                              placeholder="0.00"
                              step="0.01"
                              readOnly={isAutoCalculating}
                            />
                            <button
                              onClick={() => setIsAutoCalculating(!isAutoCalculating)}
                              className={`p-2 rounded-lg transition-colors ${
                                isAutoCalculating 
                                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={isAutoCalculating ? 'Cálculo automático ativo' : 'Cálculo manual'}
                            >
                              <Calculator className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center space-x-1">
                            <Calculator className="w-3 h-3" />
                            <span>
                              {isAutoCalculating 
                                ? 'Calculado automaticamente (soma de impostos)'
                                : 'Edição manual ativada'
                              }
                            </span>
                          </div>
                        </div>
                      ) : fieldType === 'select' ? (
                        <Select
                          value={editedData[field] || ''}
                          onValueChange={(value) => handleInputChange(field, value)}
                        >
                          <SelectTrigger className={isEdited ? 'border-blue-500 bg-blue-50' : ''}>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {getSelectOptions(field).map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : fieldType === 'number' ? (
                        <Input
                          type="number"
                          value={editedData[field] || ''}
                          onChange={(e) => handleInputChange(field, parseFloat(e.target.value) || 0)}
                          className={isEdited ? 'border-blue-500 bg-blue-50' : ''}
                          placeholder="0.00"
                          step="0.01"
                        />
                      ) : (
                        <Input
                          type="text"
                          value={editedData[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          className={isEdited ? 'border-blue-500 bg-blue-50' : ''}
                          placeholder="Digite o valor..."
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Fields - Impostos */}
            {initialData.impostos && Array.isArray(initialData.impostos) && initialData.impostos.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="text-red-600 mr-2">💰</span>
                  Impostos
                </h3>
                <div className="space-y-3">
                  {initialData.impostos.map((item: any, index: number) => {
                    const itemKey = `imposto_${index}`;
                    const label = item.nome || item.label || `Imposto ${index + 1}`;
                    const currentValue = editedData.impostos?.[index]?.valor || editedData.impostos?.[index]?.value || item.valor || item.value || 0;
                    
                    return (
                      <div key={itemKey} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-red-700">{label}</Label>
                        </div>
                        <div className="w-32">
                          <Input
                            type="number"
                            value={currentValue}
                            onChange={(e) => {
                              const newValue = parseFloat(e.target.value) || 0;
                              const newImpostos = [...(editedData.impostos || initialData.impostos)];
                              newImpostos[index] = { ...item, valor: newValue, value: newValue };
                              handleInputChange('impostos', newImpostos);
                            }}
                            className="text-right"
                            placeholder="0.00"
                            step="0.01"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newImpostos = (editedData.impostos || initialData.impostos).filter((_: any, i: number) => i !== index);
                            handleInputChange('impostos', newImpostos);
                          }}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => {
                      const newImpostos = [...(editedData.impostos || initialData.impostos), { nome: 'Novo Imposto', valor: 0 }];
                      handleInputChange('impostos', newImpostos);
                    }}
                    className="w-full p-2 border-2 border-dashed border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Adicionar Imposto
                  </button>
                </div>
              </div>
            )}

            {/* Empty Arrays - Add if they don't exist */}
            {(!initialData.impostos || !Array.isArray(initialData.impostos) || initialData.impostos.length === 0) && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="text-red-600 mr-2">💰</span>
                  Impostos
                </h3>
                <button
                  onClick={() => {
                    handleInputChange('impostos', [{ nome: 'INSS', valor: 0 }]);
                  }}
                  className="w-full p-2 border-2 border-dashed border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Adicionar Primeiro Imposto
                </button>
              </div>
            )}

            {/* Custom Fields */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Campos Personalizados</h3>
              <div className="space-y-3">
                {customFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={field.title}
                        onChange={(e) => {
                          const updatedFields = customFields.map(f => 
                            f.id === field.id ? { ...f, title: e.target.value } : f
                          );
                          setCustomFields(updatedFields);
                        }}
                        placeholder="Título do campo"
                        className="mb-2"
                      />
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => {
                          const updatedFields = customFields.map(f => 
                            f.id === field.id ? { ...f, value: parseFloat(e.target.value) || 0 } : f
                          );
                          setCustomFields(updatedFields);
                        }}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <button
                      onClick={() => removeCustomField(field.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addCustomField}
                  className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Adicionar Campo
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar e Reanalisar'
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 