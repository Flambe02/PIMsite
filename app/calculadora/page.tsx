import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CalculadoraClient from "./CalculadoraClient";

export default async function CalculadoraPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?redirectTo=/calculadora");
  }
  return <CalculadoraClient user={user} />;
}

// Déplacer tout le code React client (état, stepper, upload, etc.) dans CalculadoraClient.tsx 