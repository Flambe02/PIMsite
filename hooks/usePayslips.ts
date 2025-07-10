import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Payslip } from '@/types';

export function usePayslips(userId: string | undefined) {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    supabase
      .from("holerites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then((result) => {
        setPayslips(result.data ?? []);
        setLoading(false);
      });
  }, [userId]);

  return { payslips, loading };
} 