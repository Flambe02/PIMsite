'use client'
import { useRouter } from 'next/navigation'

export default function CTAImproveScore({ href }: { href: string }) {
  const router = useRouter();
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
      <div className="text-emerald-900 font-semibold">Melhore seu score com simulações</div>
      <button
        onClick={() => router.push(href)}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
      >
        Simular agora
      </button>
    </div>
  );
}


