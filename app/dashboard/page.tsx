import { redirect } from 'next/navigation';

export default function DashboardRedirect() {
  // Rediriger vers le dashboard brésilien par défaut
  redirect('/br/dashboard');
} 