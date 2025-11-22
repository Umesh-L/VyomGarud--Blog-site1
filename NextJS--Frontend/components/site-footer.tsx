import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Taxonomy } from "@/types/content";

interface SiteFooterProps {
  categories: Taxonomy[];
}

export function SiteFooter({ categories }: SiteFooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-charcoal-soft/80 text-sm text-white/70">
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.6em] text-white/40">VyomGarud Command</p>
          <p className="text-3xl font-semibold text-white">Military-Grade Autonomy</p>
          <p className="max-w-xl text-base leading-relaxed text-white/60">
            VyomGarud engineers design UAV and drone systems with uncompromising reliability, precision manufacturing, and advanced autonomy stacks. This
            log documents the readiness signals stakeholders need to trust every sortie.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.4em] text-white/50">
            <a href="mailto:intel@vyomgarud.in" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white">
              intel@vyomgarud.in
            </a>
            <a href="tel:+91000000000" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white">
              +91 000 000 0000
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/40">Categories</p>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/#category-${category.slug}`}
                className="rounded-full border border-white/10 px-4 py-2 text-white/80 transition hover:-translate-y-0.5 hover:border-white/40 hover:text-white"
              >
                {category.name}
              </Link>
            ))}
            {categories.length === 0 && <p className="text-white/50">No categories published yet.</p>}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/40">Quicklinks</p>
          <div className="flex flex-col gap-3 text-white/70">
            <Link href="/" className="transition hover:text-white">
              Mission Log
            </Link>
            <a href="/#categories" className="transition hover:text-white">
              Platform Families
            </a>
            <a href="/#contact" className="transition hover:text-white">
              Contact Ops
            </a>
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="transition hover:text-white">
              Engineering Notes
            </a>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/5">
        <Container className="flex flex-col gap-3 py-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© {year} VyomGarud Systems. All reconnaissance rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <a href="/privacy" className="transition hover:text-white">
              Privacy
            </a>
            <a href="/terms" className="transition hover:text-white">
              Terms
            </a>
            <a href="mailto:intel@vyomgarud.in" className="transition hover:text-white">
              Secure Channel
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
