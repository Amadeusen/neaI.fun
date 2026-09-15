import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function SiteHeader() {
  return (
    <header className="border-b border-black/5 py-5 dark:border-white/10">
      <Container className="flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Playground
        </Link>
        <span className="text-sm text-neutral-500">A hub of tiny experiments</span>
      </Container>
    </header>
  );
}
