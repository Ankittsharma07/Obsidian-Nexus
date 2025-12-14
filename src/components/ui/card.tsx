"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel relative overflow-hidden shadow-[0_25px_60px_rgba(6,4,28,0.55)] transition hover:shadow-neon",
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/10" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30" />
      {props.children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-semibold text-xl text-slate-50", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-6 text-sm text-slate-300", className)} {...props} />;
}
