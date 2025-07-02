"use client";
import { ReactNode } from "react";
import { GlobalTestButton } from "./GlobalTestButton";

export function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <GlobalTestButton />
    </>
  );
} 