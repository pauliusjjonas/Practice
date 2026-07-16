import type { ReactNode } from "react";
import { Lightbulb, TriangleAlert, Info } from "lucide-react";

interface CalloutProps {
  variant?: "tip" | "warning" | "info";
  children: ReactNode;
}

const VARIANTS = {
  tip: {
    icon: Lightbulb,
    label: "Tip",
    classes: "border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]",
  },
  warning: {
    icon: TriangleAlert,
    label: "Watch out",
    classes: "border-[var(--color-warning)]/40 bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
  },
  info: {
    icon: Info,
    label: "Good to know",
    classes: "border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]",
  },
} as const;

export function Callout({ variant = "info", children }: CalloutProps) {
  const { icon: Icon, label, classes } = VARIANTS[variant];
  return (
    <div className={`my-4 flex gap-3 rounded-lg border px-4 py-3 ${classes}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="text-sm leading-relaxed text-[var(--color-text)]">
        <p className="mb-1 font-semibold">{label}</p>
        {children}
      </div>
    </div>
  );
}
