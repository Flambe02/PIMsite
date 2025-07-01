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
      <div className="relative" style={{ height, width }}>
        <Image src="/images/pimentao-logo.png" alt="Logo PIM" fill className="object-contain" priority />
      </div>
      <span className="font-bold text-xl">PIM</span>
    </Link>
  )
}
