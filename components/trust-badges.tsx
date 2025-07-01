import { ShieldCheck, Lock, Award } from "lucide-react"

export function TrustBadges() {
  return (
    <section className="w-full py-4 bg-gray-50 border-y">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">Conforme LGPD</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">Criptografia Bancária</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">ISO 27001</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">4.8</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-4 w-4 ${star === 5 ? "text-gray-300" : "text-yellow-400"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">(2.143 avaliações)</span>
          </div>
        </div>
      </div>
    </section>
  )
}
