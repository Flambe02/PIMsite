import Link from "next/link"
import Image from "next/image"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* (Remove the <header>...</header> block) */}

      {children}

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6 bg-white">
        <div className="flex items-center">
          <Image src="/images/pimentao-logo.png" alt="Logo Pimentão Rouge" width={32} height={32} className="h-8 w-auto mr-2" />
          <p className="text-xs text-gray-500">© 2025 The Pimentão Rouge Company. Admin Panel V1.0.0</p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Serviço
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  )
} 