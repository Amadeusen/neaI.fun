import { Container } from "@/components/ui/Container";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-black/5 py-6 text-sm text-neutral-500 dark:border-white/10">
      <Container>Built with Next.js. New games ship as self-contained modules.</Container>
    </footer>
  );
}
