"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, Plus, Eye, ArrowRight, DollarSign, Target } from "lucide-react";
import useInvestimentos from "@/hooks/useInvestimentos";
import { useState, useEffect } from "react";

interface DashInvestimentosBlockProps {
  userId: string | null;
  holeriteData?: any;
}

export default function DashInvestimentosBlock({ userId, holeriteData }: DashInvestimentosBlockProps) {
  const [employmentStatus, setEmploymentStatus] = useState<string>("CLT");
  const { data: investimentos = [], isLoading } = useInvestimentos(userId, holeriteData?.raw);

  // Determine employment status from holerite data
  useEffect(() => {
    if (holeriteData?.raw?.profile_type) {
      setEmploymentStatus(holeriteData.raw.profile_type);
    }
  }, [holeriteData]);

  const totalAmount = investimentos.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const avgYield = investimentos.length > 0 
    ? investimentos.reduce((sum, inv) => sum + (inv.yield_pct || 0), 0) / investimentos.length 
    : 0;

  const statusColors: Record<string, string> = {
    PJ: "bg-blue-100 text-blue-800",
    CLT: "bg-green-100 text-green-800",
    ESTAGIARIO: "bg-purple-100 text-purple-800"
  };

  if (isLoading) {
    return (
      <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <CardHeader className="p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
      <CardHeader className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Investissements & Retraite
              </CardTitle>
              <p className="text-gray-600">
                Portefeuille et planification financière
              </p>
            </div>
          </div>
          <Badge className={`${statusColors[employmentStatus] || "bg-gray-100 text-gray-800"} px-3 py-1 text-xs font-medium shadow-sm`}>
            {employmentStatus}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        {investimentos.length > 0 ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-sm text-emerald-600 font-medium">Total Investi</div>
                </div>
                <div className="text-2xl font-bold text-emerald-900">
                  R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Rendement Moyen</div>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {avgYield.toFixed(1)}%
                </div>
              </motion.div>
            </div>

            {/* Investment List */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 mb-4">Vos Investissements</h4>
              {investimentos.slice(0, 3).map((inv, index) => (
                <motion.div
                  key={`investment-${inv.id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl border border-emerald-100"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {inv.asset_class === 'previdencia' ? 'Retraite Privée' : inv.asset_class}
                    </div>
                    <div className="text-sm text-gray-600">
                      R$ {Number(inv.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      {inv.yield_pct && ` • ${inv.yield_pct.toFixed(1)}%`}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                    <Eye className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" size="sm" className="flex-1 py-3 border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
              <Button variant="outline" size="sm" className="flex-1 py-3 border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200">
                <ArrowRight className="w-4 h-4 mr-2" />
                Voir Détails
              </Button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Aucun investissement détecté
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Commencez à investir pour garantir votre avenir financier
            </p>
            <div className="flex gap-3">
              <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Premier Investissement
              </Button>
              <Button variant="outline" className="flex-1 border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50">
                <ArrowRight className="w-4 h-4 mr-2" />
                En Savoir Plus
              </Button>
            </div>
          </motion.div>
        )}

        {/* Quick Tips */}
        {investimentos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mt-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm">
                <div className="font-semibold text-amber-800 mb-1">Conseil PIM</div>
                <div className="text-amber-700">
                  Considérez diversifier vos investissements pour réduire les risques et maximiser les gains.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
} 