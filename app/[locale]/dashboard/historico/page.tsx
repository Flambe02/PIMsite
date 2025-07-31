import { Metadata } from 'next';
import { HistoricoList } from '@/components/dashboard/HistoricoList';

export const metadata: Metadata = {
  title: 'Histórico e Documentos | PIM',
  description: 'Visualize e gerencie seu histórico de holerites',
};

export default function HistoricoPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Histórico e Documentos
        </h1>
        <p className="text-gray-600">
          Visualize e gerencie todos os seus holerites carregados
        </p>
      </div>
      
      <HistoricoList />
    </div>
  );
} 