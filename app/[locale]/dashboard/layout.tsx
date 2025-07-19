import OnboardingRedirect from "@/components/OnboardingRedirect"

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
} 