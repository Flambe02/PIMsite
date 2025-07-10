"use client";

import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Payslip } from "@/types";

interface PayslipHistoryProps {
  payslips: Payslip[];
}

export function PayslipHistory({ payslips }: PayslipHistoryProps) {
  if (!payslips.length) return null;
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Histórico de Holerites
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payslips.map((payslip) => (
            <div key={payslip.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">
                    {payslip.nome || "Holerite"} - {payslip.empresa || "Empresa"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payslip.created_at ? new Date(payslip.created_at).toLocaleDateString() : "Data não disponível"}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {payslip.salario_liquido ? `R$ ${payslip.salario_liquido}` : "Valor não disponível"}
                </div>
                <div className="text-sm text-gray-500">{payslip.metodo || "Upload"}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 