import { useMemo } from "react";
import { swileMarket2025, SwileMarketData, BenefitType } from "@/lib/comparator/swileData";

export interface UserProfile {
  contractType: "CLT" | "PJ" | "Estágio";
  sector: string;
  level: "Júnior" | "Pleno" | "Sênior";
  benefits: Partial<Record<BenefitType, number>>;
}

export function useBenefitComparison(profile: UserProfile) {
  return useMemo(() => {
    return swileMarket2025.map((market) => {
      const userValue = profile.benefits[market.type] ?? 0;
      return {
        ...market,
        userValue,
        diffToMedia: userValue - market.media,
      };
    });
  }, [profile]);
} 