import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Rediriger vers la page d'accueil qui gère la sélection de locale
  redirect('/');
} 