"use client";
type Props = { title: string; estValue?: number; estTime?: string; ctaLabel?: string; onClick?: () => void; subtitle?: string; };
export default function ActionCard({ title, estValue, estTime, ctaLabel = "Continuar", onClick, subtitle }: Props) {
  return (
    <div className="rounded-2xl p-4 border shadow-sm bg-white">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {typeof estValue === "number" && <span className="text-sm">+R${estValue}</span>}
      </div>
      {estTime && <p className="text-xs mt-1 text-muted-foreground">{estTime}</p>}
      <button onClick={onClick} className="mt-3 w-full rounded-xl border py-2 text-sm hover:bg-muted/50">{ctaLabel}</button>
    </div>
  );
}