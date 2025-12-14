"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-purple-500/20 text-purple-200 border-purple-500/30",
        secondary: "bg-indigo-500/20 text-indigo-100 border-indigo-500/30",
        destructive: "bg-rose-500/20 text-rose-200 border-rose-500/40",
        success: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
