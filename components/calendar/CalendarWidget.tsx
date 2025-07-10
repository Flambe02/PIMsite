"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { nationalHolidays } from "@/lib/calendar/holidays";

export interface UserVacation {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  label?: string;
}
export interface Deadline {
  date: string; // YYYY-MM-DD
  label: string;
  type: "holerite" | "fiscal";
}

interface CalendarWidgetProps {
  vacations: UserVacation[];
  deadlines: Deadline[];
}

export function CalendarWidget({ vacations, deadlines }: CalendarWidgetProps) {
  const [value, setValue] = useState<Date | Date[] | null>(new Date());

  // Regroupe tous les événements
  const events = [
    ...nationalHolidays.map(h => ({ ...h, type: "feriado" })),
    ...vacations.flatMap(v => {
      const days = [];
      const d = new Date(v.start);
      const end = new Date(v.end);
      while (d <= end) {
        days.push({ date: d.toISOString().slice(0, 10), name: v.label || "Férias", type: "vacation" });
        d.setDate(d.getDate() + 1);
      }
      return days;
    }),
    ...deadlines.map(d => ({ date: d.date, name: d.label, type: d.type })),
  ];

  function tileContent({ date, view }: { date: Date; view: string }) {
    if (view !== "month") return null;
    const iso = date.toISOString().slice(0, 10);
    const found = events.find(e => e.date === iso);
    if (!found) return null;
    return (
      <span
        className={
          found.type === "feriado"
            ? "bg-red-200 text-red-700 px-1 rounded text-xs"
            : found.type === "vacation"
            ? "bg-blue-200 text-blue-700 px-1 rounded text-xs"
            : "bg-emerald-200 text-emerald-700 px-1 rounded text-xs"
        }
      >
        {found.type === "feriado"
          ? "F"
          : found.type === "vacation"
          ? "V"
          : "D"}
      </span>
    );
  }

  const handleChange = (newValue: Date | Date[] | null) => {
    setValue(newValue);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Calendário</h2>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Calendar value={value as any} onChange={handleChange as any} tileContent={tileContent} />
      <div className="flex gap-2 mt-4 text-xs">
        <span className="bg-red-200 text-red-700 px-2 py-1 rounded">Feriado</span>
        <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded">Férias</span>
        <span className="bg-emerald-200 text-emerald-700 px-2 py-1 rounded">Deadline</span>
      </div>
    </div>
  );
} 