"use client";
import { useToast } from "@/components/ui/use-toast";
export function GlobalTestButton() {
  const { toast } = useToast();
  return (
    <button
      onClick={() => toast({ title: "Test global", description: "Global button clicked!", variant: "default" })}
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        zIndex: 9999,
        background: 'yellow',
        color: 'black',
        padding: '10px',
        border: '1px solid black',
      }}
    >
      Global Test Click
    </button>
  );
} 