"use client";
import DashboardClient from "../../components/dashboard-client";
import { Payslip } from "../../types";

interface User {
  id: string;
  email: string;
  name: string;
}

export default function DashboardClientWrapper({ user, payslips }: { user: unknown, payslips: unknown[] }) {
  // Vérification de type sûre
  const typedUser = user as User;
  const typedPayslips = payslips as Payslip[];
  
  return <DashboardClient user={typedUser} payslips={typedPayslips} />;
} 