import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-[var(--background)]/70 py-5 backdrop-blur-md dark:border-white/10">
      <Container className="flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          Playground
        </Link>
        <span className="text-sm text-neutral-500">A hub of tiny experiments</span>
      </Container>
    </header>
  );
}
