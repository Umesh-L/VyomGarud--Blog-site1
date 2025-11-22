import Link from "next/link";
import { CategoryCarousel } from "@/components/category-carousel";
import { PostCardGrid } from "@/components/post-card-grid";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxHero } from "@/components/parallax-hero";
import { SearchBar } from "@/components/search-bar";
import { MissionDynamics } from "@/components/mission-dynamics";
import { getPosts } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getPosts();
  if (process.env.NODE_ENV !== "production") {
    console.log("[HomePage] posts fetched:", posts.length);
  }
  const allCategories = Array.from(
    new Map(
      posts
        .flatMap((post) => post.categories ?? [])
        .map((category) => [category.slug, category])
    ).values()
  );
  const heroStories = posts.slice(0, 3);
  const categorySections = allCategories
    .map((category) => ({
      category,
      posts: posts.filter((post) => post.categories?.some((cat) => cat.slug === category.slug)),
    }))
    .filter((section) => section.posts.length > 0);

  return (
    <main>
      <ParallaxHero>
        <section className="hero-shell">
          <div className="hero-content px-4">
            <p className="reveal-up text-sm uppercase tracking-[0.5em]">VyomGarud · Systems Log</p>
            <h1 className="reveal-up reveal-delay-1 mt-6 text-5xl font-semibold leading-tight text-shimmer">
              Precision Autonomous Flight Briefings
            </h1>
            <p className="reveal-up reveal-delay-2 mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-on-dark-muted">
              Reliability data, mission readiness updates, and autonomy breakthroughs from VyomGarud's UAV engineers—built for leaders who demand
              military-grade confidence.
            </p>
            <div className="mt-8">
              <SearchBar posts={posts} />
            </div>
            <a href="#featured" className="scroll-indicator" aria-label="Scroll for more" />
          </div>
        </section>
      </ParallaxHero>

      <ScrollReveal>
        <MissionDynamics />
      </ScrollReveal>

      <Container className="space-y-16 py-16" id="categories">
        {heroStories.length > 0 && (
          <ScrollReveal>
            <section id="featured">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Featured dispatches</h2>
                <Link href="/" className="text-sm font-semibold text-[var(--accent)]">
                  View all →
                </Link>
              </div>
              <PostCardGrid posts={heroStories} />
            </section>
          </ScrollReveal>
        )}

        {categorySections.map((section, index) => (
          <ScrollReveal key={section.category.slug} delay={index * 80}>
            <CategoryCarousel
              title={section.category.name}
              slug={section.category.slug}
              posts={section.posts}
              anchorId={`category-${section.category.slug}`}
            />
          </ScrollReveal>
        ))}
      </Container>
    </main>
  );
}
