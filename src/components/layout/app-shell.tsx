"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, User2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Clients", href: "/clients" },
  { label: "Tasks", href: "/tasks" },
  { label: "Settings", href: "/settings" }
];

type AppShellProps = {
  children?: ReactNode;
  user?: { name?: string | null };
  loading?: boolean;
};

export function AppShell({ children, user, loading }: AppShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="mx-auto mt-6 h-16 max-w-6xl rounded-[32px] border border-white/10 bg-white/5 px-4" />
        <div className="px-4 py-10 md:px-10">
          <div className="h-[60vh] rounded-3xl border border-white/5 bg-white/5" />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-transparent">
      <header className="relative mx-auto mt-6 flex max-w-6xl items-center justify-between gap-4 rounded-[32px] border border-white/10 bg-white/5 px-4 py-4 shadow-[0_20px_80px_rgba(5,0,20,0.45)] backdrop-blur-2xl md:px-10">
        <div className="flex items-center gap-4">
          <button
            className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/clients" className="text-lg font-semibold tracking-[0.25em] text-white">
            OBSIDIAN
          </Link>
        </div>
        <nav
          className={cn(
            "flex flex-1 flex-col items-center gap-4 text-sm text-slate-300 md:flex-row md:justify-center",
            open ? "mt-4 md:mt-0" : "hidden md:flex"
          )}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 transition hover:text-white",
                pathname?.startsWith(item.href) && "bg-white/10 text-white"
              )}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 md:flex">
            <User2 className="h-4 w-4" />
            <span>{user?.name ?? "Operator"}</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm text-white hover:bg-white/15"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>
      <div className="px-4 py-10 md:px-10">{children}</div>
    </div>
  );
}
