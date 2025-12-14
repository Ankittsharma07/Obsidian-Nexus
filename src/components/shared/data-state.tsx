"use client";

import { createContext, useContext, useState, type ReactNode, Dispatch, SetStateAction } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

type DashboardFilters = {
  search: string;
  status: "ACTIVE" | "AT_RISK" | "DORMANT" | "ARCHIVED" | "ALL";
  industry: string | null;
};

const DashboardFilterContext = createContext<{
  filters: DashboardFilters;
  setFilters: Dispatch<SetStateAction<DashboardFilters>>;
} | null>(null);

export function useDashboardFilters() {
  const value = useContext(DashboardFilterContext);
  if (!value) {
    throw new Error("useDashboardFilters must be used within Providers");
  }
  return value;
}

export function Providers({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<DashboardFilters>({
    search: "",
    status: "ALL",
    industry: null
  });

  return (
    <SessionProvider>
      <DashboardFilterContext.Provider value={{ filters, setFilters }}>
        {children}
        <Toaster />
      </DashboardFilterContext.Provider>
    </SessionProvider>
  );
}
