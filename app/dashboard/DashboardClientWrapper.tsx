"use client";
import DashboardClient from "../../components/dashboard-client";

export default function DashboardClientWrapper({ user, payslips }: { user: any, payslips: any[] }) {
  return <DashboardClient user={user} payslips={payslips} />;
} 