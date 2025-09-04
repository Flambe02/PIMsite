export type ProofItem = {
  id: string;
  title: string;
  value?: number;
  date: string;
  state: "submitted"|"in_progress"|"completed"|"failed";
};

export default function ProofTimeline({ items }: { items: ProofItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.id} className="rounded-2xl p-4 border bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{it.title}</p>
              <p className="text-xs text-muted-foreground">{it.date} — {it.state}</p>
            </div>
            {typeof it.value === "number" && <span className="text-sm font-semibold">R${it.value}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}
