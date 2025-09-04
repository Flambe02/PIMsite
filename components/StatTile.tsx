export default function StatTile({ title, value, hint }: { title: string; value: string; hint?: string; }) {
  return (
    <div className="rounded-2xl p-4 border bg-white">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      {hint && <p className="text-xs mt-1 text-muted-foreground">{hint}</p>}
    </div>
  );
}
