import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

/** Shown for any unknown URL (exported as 404.html for GitHub Pages). */
export default function NotFound() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-5 px-4 text-center">
      <Link href="/" className="transition-opacity hover:opacity-70">
        <Logo className="text-3xl" />
      </Link>
      <p className="font-display text-8xl font-bold">404</p>
      <p className="text-ink-muted">Nothing to play here. This page doesn&apos;t exist.</p>
      <Link href="/" className="btn">
        Back to all games
      </Link>
    </main>
  );
}
