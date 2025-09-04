import type { ReactNode } from "react";
import MobileTabBar from "@/components/MobileTabBar";

export default function CoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <div className="flex-1 pb-16">{children}</div>
      <div className="h-16" />
      <MobileTabBar />
    </div>
  );
}


