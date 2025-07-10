import { useMemo, useState } from "react";
import { educationContents } from "@/lib/education/content";

export function useEducationContent() {
  const [category, setCategory] = useState<string | null>(null);
  const filtered = useMemo(
    () => (category ? educationContents.filter(c => c.category === category) : educationContents),
    [category]
  );
  return { contents: filtered, setCategory, category };
} 