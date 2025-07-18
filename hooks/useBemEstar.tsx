import { useEffect, useState, useCallback } from "react";
import { useSupabase } from "@/components/supabase-provider";

export type BemEstarType =
  | "conges"
  | "pass_gym"
  | "sante"
  | "sante_mentale"
  | "equilibre_wt"
  | "psychologie"
  | "carte_culture";

export interface BemEstarEntry {
  id: string;
  user_id: string;
  type: BemEstarType;
  status_value: string;
  comment: string;
  action_link: string;
  metadata: any;
  updated_at: string;
}

export interface BemEstarInput {
  type: BemEstarType;
  status_value: string;
  comment: string;
  action_link: string;
  metadata?: any;
}

interface UseBemEstarReturn {
  data: BemEstarEntry[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  upsertEntry: (input: BemEstarInput) => Promise<void>;
}

/**
 * Hook to fetch and manage bem_estar table for current user.
 */
export default function useBemEstar(userId: string | null): UseBemEstarReturn {
  const { supabase } = useSupabase();
  const [data, setData] = useState<BemEstarEntry[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("bem_estar")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setData(data as BemEstarEntry[]);
      setError(null);
    }
    setLoading(false);
  }, [supabase, userId]);

  const upsertEntry = useCallback(
    async (input: BemEstarInput) => {
      if (!userId) return;
      const { error } = await supabase.from("bem_estar").upsert(
        {
          user_id: userId,
          type: input.type,
          status_value: input.status_value,
          comment: input.comment,
          action_link: input.action_link,
          metadata: input.metadata ?? {},
        },
        { onConflict: "user_id,type" }
      );
      if (error) {
        setError(error.message);
      } else {
        await fetchData();
      }
    },
    [supabase, userId, fetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData, upsertEntry };
} 