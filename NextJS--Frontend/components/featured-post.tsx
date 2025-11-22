import Image from "next/image";
import Link from "next/link";
import { TagPill } from "@/components/ui/tag-pill";
import { formatDate } from "@/lib/format";
import { getStrapiMedia } from "@/lib/strapi";
import { Post } from "@/types/content";

interface FeaturedPostProps {
  post: Post;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  if (!post) return null;

  return (
    <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-r from-[#101826] via-[#0a0f17] to-[#131b29] text-white shadow-2xl reveal-up">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-10 lg:p-14">
          <p className="text-xs uppercase tracking-[0.5em] text-white/60">Featured Briefing</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-white lg:text-4xl">
            {post.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/80">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {post.categories?.map((category) => (
              <TagPill key={category.slug} label={category.name} />
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-white/70">
            <span>{post.author?.name ?? "Mission Control"}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            {post.readingTime && (
              <>
                <span>•</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>
          <Link
            href={`/posts/${post.slug}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-black transition hover:-translate-y-0.5"
          >
            Continue briefing →
          </Link>
        </div>
        {post.cover && (
          <div className="relative min-h-[320px] overflow-hidden">
            <Image
              src={getStrapiMedia(post.cover.url)}
              alt={post.cover.alternativeText ?? post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
          </div>
        )}
      </div>
    </section>
  );
}
