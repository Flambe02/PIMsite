import { Logo } from "@/components/logo"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function CountryGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {children}
    </div>
  )
} 