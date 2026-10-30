import { cn } from "@/lib/utils";

/**
 * The "neaI.fun" wordmark. Size it with a text-* class; the ".fun" part is
 * always drawn in the muted ink color.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-bold tracking-tight", className)}>
      neaI<span className="text-ink-muted">.fun</span>
    </span>
  );
}
