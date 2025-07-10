import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// La page reçoit les "params" de l'URL, qui contiennent l'ID du bulletin.
export default async function PayslipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { id } = await params

  // On récupère le bulletin spécifique ET ses lignes de gains/déductions associées en une seule requête !
  const { data: payslip, error } = await supabase
    .from('payslips')
    .select(`
      *,
      payslip_items (
        id,
        type,
        description,
        amount
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id) // Sécurité : on vérifie que le bulletin appartient bien à l'utilisateur connecté
    .single()

  if (error || !payslip) {
    console.error("Bulletin non trouvé ou erreur:", error)
    redirect('/dashboard') // Redirige si le bulletin n'existe pas ou n'est pas accessible
  }

  const earnings = payslip.payslip_items.filter((item: { type: string }) => item.type === 'earning');
  const deductions = payslip.payslip_items.filter((item: { type: string }) => item.type === 'deduction');

  return (
    <div className="p-4 md:p-8">
      <Link href="/dashboard" className="text-indigo-600 hover:underline mb-6 inline-block">&larr; Retour au Tableau de Bord</Link>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Détail du Bulletin du {new Date(payslip.created_at).toLocaleDateString('fr-FR')}</h1>
        
        {/* Grille pour les informations principales */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 border-b pb-4">
          <div><p className="text-sm text-gray-500">Salaire Brut</p><p className="font-semibold">{payslip.gross_salary?.toLocaleString('fr-FR', { style: 'currency', currency: 'BRL' })}</p></div>
          <div><p className="text-sm text-gray-500">Salaire Net</p><p className="font-semibold">{payslip.net_salary?.toLocaleString('fr-FR', { style: 'currency', currency: 'BRL' })}</p></div>
          <div><p className="text-sm text-gray-500">Base INSS</p><p className="font-semibold">{payslip.inss_base?.toLocaleString('fr-FR', { style: 'currency', currency: 'BRL' })}</p></div>
          <div><p className="text-sm text-gray-500">Base FGTS</p><p className="font-semibold">{payslip.fgts_base?.toLocaleString('fr-FR', { style: 'currency', currency: 'BRL' })}</p></div>
        </div>

        {/* Grille pour les gains et déductions */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-3 text-green-700">Gains</h2>
            <ul className="space-y-2">
              {earnings.map((item: { id: string; description: string; amount: number }) => (
                <li key={item.id} className="flex justify-between"><span>{item.description}</span><span>{item.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'BRL' })}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-700">Déductions</h2>
            <ul className="space-y-2">
              {deductions.map((item: { id: string; description: string; amount: number }) => (
                <li key={item.id} className="flex justify-between"><span>{item.description}</span><span>{item.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'BRL' })}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 