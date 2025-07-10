"use client";

export default function PayslipPreview({ url }: { url: string }) {
  if (!url) return null;
  return (
    <div className="bg-slate-50 p-4 rounded shadow-inner">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Pré-visualização do holerite"
        className="max-h-[550px] object-contain mx-auto"
      />
    </div>
  );
} 