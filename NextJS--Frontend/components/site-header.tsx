import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { Taxonomy } from "@/types/content";

interface SiteHeaderProps {
  categories: Taxonomy[];
}

export function SiteHeader({ categories }: SiteHeaderProps) {
  const categoryShortcuts = categories.slice(0, 8);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-charcoal/90 backdrop-blur-xl">
      <Container className="flex flex-wrap items-center gap-3 py-4">
        <Link href="/" className="group flex items-center gap-3 text-lg font-semibold tracking-tight">
          <span className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white/5 transition group-hover:-translate-y-0.5">
            <Image
              src="/icons/VYOMGARUD.jpg"
              alt="VyomGuard insignia"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
            <span className="pointer-events-none absolute inset-0 rounded-2xl border border-white/20" />
          </span>
          <div>
            <p className="text-base font-black uppercase tracking-[0.45em] text-white">VYOMGUARD</p>
            <p className="-mt-0.5 text-xs font-medium uppercase tracking-[0.4em] text-white/70">UAV/Drone Systems</p>
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/70 [scrollbar-width:none]" aria-label="Category shortcuts">
            {categoryShortcuts.map((category) => (
              <Link
                key={category.slug}
                href={`/#category-${category.slug}`}
                className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-white/80 transition hover:border-white/40 hover:text-white"
              >
                <span className="truncate">{category.name}</span>
                {typeof category.postCount === "number" && (
                  <span className="text-[0.55rem] text-white/40">{category.postCount}</span>
                )}
              </Link>
            ))}
            <div className="flex-shrink-0">
              <ThemeToggle variant="compact" />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
