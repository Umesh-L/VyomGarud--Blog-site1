import Image from "next/image";
import Link from "next/link";
import { TagPill } from "@/components/ui/tag-pill";
import { formatDate } from "@/lib/format";
import { getStrapiMedia } from "@/lib/strapi";
import { Post } from "@/types/content";

interface PostCardProps {
  post: Post;
  variant?: "default" | "compact";
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  const cover = post.cover;
  const categories = post.categories ?? [];
  const isCompact = variant === "compact";
  const imageHeightClass = isCompact ? "h-40" : "h-56";
  const paddingClasses = isCompact ? "px-5 py-5" : "px-6 py-6";
  const handle = post.slug ?? String(post.id);

  return (
    <Link href={`/posts/${handle}`} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
      <article
        className={`card-hover-lift accent-glow group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition ${
          isCompact ? "lg:flex-row lg:items-stretch" : ""
        }`}
      >
      {cover && (
        <div className={`relative ${imageHeightClass} w-full overflow-hidden ${isCompact ? "lg:w-1/2" : ""}`}>
          <Image
            src={getStrapiMedia(cover.url)}
            alt={cover.alternativeText ?? post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            priority={!isCompact}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            {categories.slice(0, 2).map((cat) => (
              <TagPill key={cat.slug} label={cat.name} />
            ))}
          </div>
        </div>
      )}

        <div className={`flex flex-1 flex-col gap-4 ${paddingClasses}`}>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
            <span>{post.author?.name ?? "Unknown"}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>
          <div className="space-y-2">
            <h3 className={`font-semibold leading-tight text-white transition group-hover:text-[var(--accent)] ${isCompact ? "text-lg" : "text-xl"}`}>
              {post.title}
            </h3>
            {!isCompact && <p className="text-sm leading-relaxed text-white/70 line-clamp-2">{post.excerpt}</p>}
            {isCompact && <p className="text-xs uppercase tracking-[0.3em] text-white/40">Latest recon</p>}
          </div>
          <div className="mt-auto flex items-center justify-between text-sm font-semibold text-[var(--accent)]">
            <span className="transition group-hover:text-white">View mission →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
