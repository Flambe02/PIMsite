"use client";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Recommendation {
  type: "alert" | "tip" | "info";
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  return (
    <div className="mb-8">
      <div className="font-bold text-lg mb-4 flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        Recomendações Personalizadas
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`flex flex-col bg-white rounded-xl shadow p-4 border-l-4 ${
              rec.type === "alert"
                ? "border-yellow-400"
                : rec.type === "tip"
                ? "border-emerald-400"
                : "border-blue-400"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {rec.icon}
              <span className="font-semibold">{rec.message}</span>
            </div>
            {rec.actionLabel && rec.onAction && (
              <Button
                className="mt-2 w-max bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={rec.onAction}
              >
                {rec.actionLabel} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 