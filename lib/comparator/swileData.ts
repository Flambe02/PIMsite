export type BenefitType = "VR" | "VA" | "VT" | "Saúde" | "Previdência";

export interface SwileMarketData {
  type: BenefitType;
  label: string;
  menor: number;
  media: number;
  maior: number;
  unit: string;
}

export const swileMarket2025: SwileMarketData[] = [
  { type: "VR", label: "Vale Refeição", menor: 400, media: 650, maior: 1200, unit: "R$/mês" },
  { type: "VA", label: "Vale Alimentação", menor: 300, media: 500, maior: 900, unit: "R$/mês" },
  { type: "VT", label: "Vale Transporte", menor: 150, media: 250, maior: 400, unit: "R$/mês" },
  { type: "Saúde", label: "Plano de Saúde", menor: 0, media: 350, maior: 800, unit: "R$/mês" },
  { type: "Previdência", label: "Previdência Privada", menor: 0, media: 200, maior: 600, unit: "R$/mês" },
]; 