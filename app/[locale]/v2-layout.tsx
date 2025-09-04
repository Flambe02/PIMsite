import type { ReactNode } from "react";
import MobileTabBar from "@/components/MobileTabBar";

export default function V2Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex-1 pb-16">{children}</div>
      <div className="h-16" />
      <MobileTabBar />
    </>
  );
}
