"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/money-found", label: "Money" },
  { href: "/portabilidade", label: "Switch" },
  { href: "/tax-center", label: "Tax" },
  { href: "/provas-e-economias", label: "Provas" },
];

export default function MobileTabBar() {
  const pathname = usePathname() || "";
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t bg-white/95 backdrop-blur">
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = pathname.includes(it.href);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`flex flex-col items-center justify-center py-2 text-xs ${active ? "font-semibold" : "text-muted-foreground"}`}
              >
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


