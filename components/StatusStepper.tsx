export default function StatusStepper({ steps, current }: { steps: string[]; current: number; }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${i <= current ? "bg-black" : "bg-gray-300"}`} />
          <span className={`text-xs ${i === current ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
          {i < steps.length - 1 && <div className="w-4 h-[1px] bg-gray-300 mx-1" />}
        </div>
      ))}
    </div>
  );
}
