import React from "react";

type FinancialGaugeProps = {
  value: number; // ex: 0.75 for 75%
  title?: string; // ex: "Financial Check-up"
  locale?: string; // 'br', 'fr', 'en'
};

function getGaugeColor(value: number) {
  if (value < 0.5) return "#F87171";    // Red-400 (bad)
  if (value < 0.75) return "#F59E42";   // Orange-400 (medium)
  return "#22C55E";                     // Green-500 (good)
}

function getLabel(value: number, locale: string = 'br') {
  if (value < 0.5) {
    return locale === 'fr' ? 'Faible' : locale === 'en' ? 'Weak' : 'Fraco';
  }
  if (value < 0.75) {
    return locale === 'fr' ? 'Moyen' : locale === 'en' ? 'Fair' : 'Razoável';
  }
  return locale === 'fr' ? 'Bon' : locale === 'en' ? 'Good' : 'Bom';
}

export default function FinancialGauge({ value, title = "Financial Check-up", locale = 'br' }: FinancialGaugeProps) {
  const pct = Math.round(value * 100);
  const color = getGaugeColor(value);
  const label = getLabel(value, locale);

  // Gauge design params
  const size = 148; // px
  const stroke = 13; // px
  const radius = (size - stroke) / 2;
  const arc = 0.75; // 75% donut
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * arc;
  const bgStart = circumference * ((1 - arc) / 2);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="mb-2 text-base font-semibold text-gray-700">{title}</div>
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} style={{ transform: "rotate(-135deg)" }}>
          {/* Background Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeDashoffset={bgStart}
            strokeLinecap="round"
          />
          {/* Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${arcLength * value} ${circumference - arcLength * value}`}
            strokeDashoffset={bgStart}
            strokeLinecap="round"
            style={{ transition: "stroke 0.3s" }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-3xl font-black text-black leading-tight">{pct}%</div>
          <div className="text-base text-gray-400 font-semibold">{label}</div>
        </div>
      </div>
    </div>
  );
} 