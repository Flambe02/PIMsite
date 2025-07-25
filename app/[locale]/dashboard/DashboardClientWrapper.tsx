"use client";
import DashboardClient from "@/components/dashboard-client";
import { Payslip } from "@/types";

interface User {
  id: string;
  email: string;
  name: string;
}

export default function DashboardClientWrapper() {
  return <DashboardClient />;
} 