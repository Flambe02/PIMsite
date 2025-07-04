import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Link from "next/link"
import type { PayslipLine } from "@/types"

export default async function Dashboard() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {},
        remove() {},
      },
    }
  )
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id

  const { data: payslips } = userId
    ? await supabase
        .from("holerites")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
    : { data: [] }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Mes bulletins</h1>

      {(!payslips || payslips.length === 0) && <p>Aucun bulletin pour l'instant.</p>}

      <ul className="space-y-6">
        {payslips?.map((p: any) => (
          <li key={p.id} className="border rounded p-4 shadow-sm bg-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{p.empresa}</p>
                <p className="text-sm text-slate-500">
                  Salário Líquido: R$ {p.salario_liquido?.toFixed(2)}
                </p>
              </div>
              <Link
                href={`/calculadora/${p.id}`}
                className="text-indigo-600 hover:underline text-sm"
              >
                Voir détails →
              </Link>
            </div>

            {/* preview des 3 premières lignes */}
            {p.structured_data && p.structured_data.folha_pagamento?.itens && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2">Détails des lignes :</h4>
                <div className="text-xs text-gray-600">
                  {p.structured_data.folha_pagamento.itens.slice(0, 3).map((item: PayslipLine, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.descricao}</span>
                      <span>R$ {item.venc?.toFixed(2) || item.desc?.toFixed(2) || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
