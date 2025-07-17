import Image from "next/image"
import Link from "next/link"

type LogoProps = { size?: 'small' | 'default' | 'large' };

export function Logo({ size = "default" }: LogoProps) {
  const dimensions = {
    small: { height: 24, width: 24 },
    default: { height: 32, width: 32 },
    large: { height: 48, width: 48 },
  }

  const { height, width } = dimensions[size] || dimensions.default

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative rounded-full overflow-hidden" style={{ height, width }}>
        <div className="absolute inset-0 rounded-full" style={{
          background: "radial-gradient(circle, #fff 60%, #eaf6f0 80%, #1a2e22 100%)",
          zIndex: 1
        }} />
        <Image src="/images/pimentao-logo.png" alt="Logo PIM" fill className="object-contain relative z-10" priority />
      </div>
      <span className="font-bold text-xl text-white">PIM</span>
    </Link>
  )
}
