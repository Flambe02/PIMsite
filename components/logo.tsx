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
      <div className="relative rounded-full overflow-hidden bg-emerald-500 flex items-center justify-center" style={{ height, width }}>
        <svg width={width * 0.6} height={height * 0.6} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white"/>
          <path d="M12 18L13.09 14.26L20 13L13.09 12.74L12 6L10.91 12.74L4 13L10.91 14.26L12 18Z" fill="white"/>
        </svg>
      </div>
      <span className="font-bold text-xl text-white">PIM</span>
    </Link>
  )
}
