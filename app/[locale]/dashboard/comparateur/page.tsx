"use client"

import { useTranslations } from '@/hooks/useTranslations';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, TrendingUp, TrendingDown, Minus, CheckCircle, XCircle } from "lucide-react";
import BenefitComparatorClientWrapper from "@/components/comparator/BenefitComparatorClientWrapper";
import { UserProfile } from "@/hooks/useBenefitComparison";

const userProfile: UserProfile = {
  contractType: "CLT",
  sector: "Tech",
  level: "Pleno",
  benefits: {
    VR: 800,
    VA: 400,
    VT: 200,
    Saúde: 350,
    Previdência: 0,
  },
};

export default function ComparateurPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params?.locale as string;
  const country = locale?.toLowerCase() || 'br';
  let countrySection = null;
  // Section de pays temporairement désactivée
  
  return (
    <div className="py-10 px-4">
      <BenefitComparatorClientWrapper profile={userProfile} />
    </div>
  );
} 