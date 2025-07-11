import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HoleriteDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = params;
  // On récupère le holerite spécifique
  const { data: holerite, error } = await supabase
    .from('holerites')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !holerite) {
    console.error('Holerite non trouvé ou erreur:', error);
    redirect('/dashboard');
  }

  // Extraction des données structurées si présentes
  const data = holerite.structured_data || {};

  return (
    <div className="p-4 md:p-8">
      <Link href="/dashboard" className="text-indigo-600 hover:underline mb-6 inline-block">&larr; Retour au Tableau de Bord</Link>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Détail du Holerite du {holerite.created_at ? new Date(holerite.created_at).toLocaleDateString('fr-FR') : ''}</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 border-b pb-4">
          <div><p className="text-sm text-gray-500">Employé</p><p className="font-semibold">{data.employee_name || holerite.nome || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Entreprise</p><p className="font-semibold">{data.company_name || holerite.empresa || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Profil</p><p className="font-semibold">{data.profile_type || holerite.perfil || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Salaire Brut</p><p className="font-semibold">{data.gross_salary?.toLocaleString('fr-FR', { style: 'currency', currency: 'BRL' }) || holerite.salario_bruto || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Salaire Net</p><p className="font-semibold">{data.net_salary?.toLocaleString('fr-FR', { style: 'currency', currency: 'BRL' }) || holerite.salario_liquido || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Période</p><p className="font-semibold">{data.period || '-'}</p></div>
        </div>
        {/* Affichage brut du JSON pour debug */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Données brutes</h2>
          <pre className="bg-gray-100 rounded p-4 text-xs overflow-x-auto max-h-96">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
} 