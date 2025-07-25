import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import UploadHolerite from "@/app/[locale]/calculadora/upload-holerite";
import { useRouter, useParams } from "next/navigation";
import PayslipAnalysisResult from "@/components/PayslipAnalysisResult";

export default function Step3Payslip({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : (Array.isArray(params?.locale) ? params.locale[0] : 'br');
  const [result, setResult] = useState<any>(null);

  const handleResult = (res: any) => {
    setResult(res);
  };

  if (result) {
    return (
      <div className="w-full max-w-md md:max-w-2xl mx-auto flex flex-col gap-6 items-center p-4 md:p-8">
        <PayslipAnalysisResult result={result} />
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-full shadow transition text-lg w-full md:w-auto mt-4"
          onClick={() => router.push(`/${locale}/dashboard`)}
        >
          Ir para o Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md md:max-w-2xl mx-auto flex flex-col gap-6 p-4 md:p-8">
      <UploadHolerite onResult={handleResult} />
      <div className="flex gap-4 mt-6">
        <Button variant="outline" onClick={onBack} className="w-full">
          Anterior
        </Button>
      </div>
    </div>
  );
} 