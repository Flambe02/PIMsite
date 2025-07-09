export interface Holiday {
  date: string; // format YYYY-MM-DD
  name: string;
}

export const nationalHolidays: Holiday[] = [
  { date: "2025-01-01", name: "Ano Novo" },
  { date: "2025-04-18", name: "Sexta-feira Santa" },
  { date: "2025-04-21", name: "Tiradentes" },
  { date: "2025-05-01", name: "Dia do Trabalho" },
  // ... autres feriados
]; 