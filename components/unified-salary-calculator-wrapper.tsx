"use client"

import dynamic from "next/dynamic"

const UnifiedSalaryCalculator = dynamic(
  () => import("./unified-salary-calculator").then(m => ({ default: m.UnifiedSalaryCalculator })),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: false
  }
)

interface UnifiedSalaryCalculatorWrapperProps {
  mode?: 'basic' | 'enhanced'
}

export default function UnifiedSalaryCalculatorWrapper({ mode = 'basic' }: UnifiedSalaryCalculatorWrapperProps) {
  return <UnifiedSalaryCalculator mode={mode} />
}
