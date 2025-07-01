import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function BrazilPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/brazil-background.jpg"
          alt="Rio de Janeiro landscape"
          fill
          className="object-cover brightness-75"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex">
        <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row">
          {/* Main Content */}
          <div className="flex-1 text-white">
            <div className="max-w-3xl">
              <div className="uppercase text-sm font-light tracking-wider mb-4">
                EASILY MANAGE EMPLOYMENT AND PAYROLL IN
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-white/20 backdrop-blur-sm">
                  <Image src="/images/brazil-flag.png" alt="Brazil flag" width={40} height={40} />
                </div>
                <h1 className="text-6xl font-bold">Brazil</h1>
              </div>

              <p className="text-xl mb-10 leading-relaxed">
                Make employment in Brazil easy. Let us handle payroll, benefits, taxes, compliance, and even stock
                options for your team in Brazil, all in one easy-to-use platform.
              </p>

              <div className="mb-16">
                <Link href="/contato">
                  <Button className="bg-black hover:bg-gray-900 text-white rounded-full px-8 py-6 text-lg flex items-center gap-2 group">
                    Book a demo
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                <p className="text-sm opacity-80">Services available in this country:</p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full bg-black/30 backdrop-blur-sm border-white/30 hover:bg-black/50 text-white flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    Employer of Record Product
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full bg-black/30 backdrop-blur-sm border-white/30 hover:bg-black/50 text-white flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    Contractor Management
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full bg-black/30 backdrop-blur-sm border-white/30 hover:bg-black/50 text-white flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    Payroll
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:w-80 mt-10 md:mt-0">
            <Card className="bg-white p-8 rounded-xl">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12H22"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-gray-500 text-sm">Capital City</div>
                  <div className="text-xl font-medium">Brasília</div>
                </div>

                <div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12H22"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-gray-500 text-sm">Currency</div>
                  <div className="text-xl font-medium">Real</div>
                  <div className="text-gray-500">(R$, BRL)</div>
                </div>

                <div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12H22"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-gray-500 text-sm">Languages</div>
                  <div className="text-xl font-medium">Portuguese</div>
                </div>

                <div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-gray-500 text-sm">Population size</div>
                  <div className="text-xl font-medium">212,586,000</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
