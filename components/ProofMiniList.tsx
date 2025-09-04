"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";

export interface ProofItem {
  id: string;
  title: string;
  value?: number;
  date: string;
  state: "submitted" | "in_progress" | "completed" | "failed";
  type?: "vr_switch" | "health_plan" | "irrf_adjust" | "das_payment" | "iss_payment";
}

interface ProofMiniListProps {
  items: ProofItem[];
  totalRealized: number;
  maxItems?: number;
  showViewAll?: boolean;
  locale?: string;
}

export default function ProofMiniList({ 
  items, 
  totalRealized, 
  maxItems = 3, 
  showViewAll = true,
  locale = "pt-BR"
}: ProofMiniListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const displayItems = isExpanded ? items : items.slice(0, maxItems);
  const hasMore = items.length > maxItems;

  const getStateIcon = (state: ProofItem["state"]) => {
    switch (state) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStateText = (state: ProofItem["state"]) => {
    switch (state) {
      case "completed":
        return "Concluído";
      case "in_progress":
        return "Em andamento";
      case "failed":
        return "Falhou";
      default:
        return "Enviado";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-4 text-center">
        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Nenhuma prova enviada ainda</p>
        <p className="text-xs text-gray-500 mt-1">
          Suas ações aparecerão aqui quando forem enviadas
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header com total */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Provas & Economias</h3>
          <p className="text-xs text-gray-600">
            Total realizado: <span className="font-semibold text-green-600">
              {formatCurrency(totalRealized)}
            </span>
          </p>
        </div>
        {showViewAll && (
          <Link 
            href={`/${locale}/provas-e-economias`}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Ver todas
          </Link>
        )}
      </div>

      {/* Liste des preuves */}
      <div className="space-y-2">
        {displayItems.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200"
          >
            <div className="flex items-center gap-3">
              {getStateIcon(item.state)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">
                  {item.date} • {getStateText(item.state)}
                </p>
              </div>
            </div>
            {item.value && (
              <span className="text-sm font-semibold text-green-600">
                +{formatCurrency(item.value)}
              </span>
            )}
          </div>
        ))}

        {/* Bouton pour voir plus */}
        {hasMore && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full text-xs text-gray-600 hover:text-gray-800 py-2 border-t border-gray-200"
          >
            Ver mais {items.length - maxItems} provas
          </button>
        )}

        {/* Bouton pour voir moins */}
        {hasMore && isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="w-full text-xs text-gray-600 hover:text-gray-800 py-2 border-t border-gray-200"
          >
            Ver menos
          </button>
        )}
      </div>
    </div>
  );
}
