'use client';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDashboard from '@/components/mobile/MobileDashboard';

function DesktopDashboard() {
  return <div style={{ padding: 32, fontSize: 24 }}>Dashboard Desktop (placeholder)</div>;
}

export default function DashboardPage() {
  const isMobile = useIsMobile();
  if (isMobile === undefined) return <div>Chargement...</div>;
  return isMobile ? <MobileDashboard /> : <DesktopDashboard />;
} 