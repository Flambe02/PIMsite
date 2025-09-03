type Props = { 
  title: string; 
  estValue?: number; 
  estTime?: string; 
  ctaLabel?: string; 
};

export function ActionCard({ title, estValue, estTime, ctaLabel }: Props) {
  return (
    <div className="rounded-2xl p-4 border shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        {typeof estValue === "number" && <span className="text-sm">+R${estValue}</span>}
      </div>
      {estTime && <p className="text-sm mt-1">{estTime}</p>}
      {ctaLabel && <button className="w-full mt-3 rounded-xl border py-2 text-sm">{ctaLabel}</button>}
    </div>
  );
}
