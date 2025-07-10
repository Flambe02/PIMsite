"use client";
import { FileText, Upload, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PayslipAnalysisSectionProps {
  lastUploadDate: string;
  uploadMethod: "manual" | "auto" | "entry";
  status: "analyzed" | "pending" | "error";
  summary: {
    net: string;
    gross: string;
    taxes: string;
    benefits: string;
  };
  onUpload: () => void;
}

const statusMap = {
  analyzed: { label: "Analisado", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-4 h-4 mr-1" /> },
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-4 h-4 mr-1" /> },
  error: { label: "Erro", color: "bg-red-100 text-red-700", icon: <AlertCircle className="w-4 h-4 mr-1" /> },
};

const methodMap = {
  manual: "Upload Manual",
  auto: "Upload Automático",
  entry: "Entrada Manual",
};

export function PayslipAnalysisSection({
  lastUploadDate,
  uploadMethod,
  status,
  summary,
  onUpload,
}: PayslipAnalysisSectionProps) {
  const statusInfo = statusMap[status];
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-6 h-6 text-emerald-500" />
          <span className="font-bold text-lg">Análise de Holerite</span>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-xs text-gray-500">Último upload: <b>{lastUploadDate}</b></span>
          <span className="text-xs text-gray-500">Método: <b>{methodMap[uploadMethod]}</b></span>
          <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded ${statusInfo.color}`}>
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <div>
            <div className="text-xs text-gray-500">Salário Líquido</div>
            <div className="font-bold text-emerald-700">{summary.net}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Salário Bruto</div>
            <div className="font-bold text-blue-700">{summary.gross}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Impostos</div>
            <div className="font-bold text-yellow-700">{summary.taxes}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Benefícios</div>
            <div className="font-bold text-green-700">{summary.benefits}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 min-w-[180px]">
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold" onClick={onUpload}>
          <Upload className="w-4 h-4 mr-2" /> Upload Novo Holerite
        </Button>
        {status === "error" && (
          <div className="text-xs text-red-600 flex items-center mt-1">
            <AlertCircle className="w-4 h-4 mr-1" /> Erro na análise. Tente reenviar o holerite.
          </div>
        )}
      </div>
    </div>
  );
} 