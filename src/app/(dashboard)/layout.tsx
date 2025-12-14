import { ReactNode, Suspense } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AppShell loading />}>
      <DashboardGate>{children}</DashboardGate>
    </Suspense>
  );
}

async function DashboardGate({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return <AppShell user={session.user}>{children}</AppShell>;
}
