export type ActionKind = "switch_vr"|"health_plan"|"irrf_adjust"|"das"|"iss"|"fator_r"|"bank_fees";
export type SavingsAction = { id: string; kind: ActionKind; estValue: number; estTime: string; title: string; subtitle?: string; };
