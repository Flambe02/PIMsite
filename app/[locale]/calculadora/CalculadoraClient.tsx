"use client";
import Dynamic from "next/dynamic";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UploadCloud, FileText, Edit, CheckCircle, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PayslipPreview from "@/components/payslip-preview";
import AnalysisDisplay from "@/components/AnalysisDisplay";
import { useToast } from "@/components/ui/use-toast";
import { useId } from "react";

const initialFields = {
  nome: "",
  empresa: "",
  salario_bruto: "",
  salario_liquido: "",
  inss: "",
  irrf: "",
  data_pagamento: "",
  raw_text: "",
};

const CalculadoraClient = Dynamic(() => import("./CalculadoraClient"), {
  loading: () => <div className="py-12 text-center text-emerald-900">Chargement de la calculatrice...</div>,
  ssr: false
});

export default function CalculadoraClientWrapper(props: any) {
  return <CalculadoraClient {...props} />;
} 