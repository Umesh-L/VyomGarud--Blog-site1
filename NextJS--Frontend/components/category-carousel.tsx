"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { formatDate } from "@/lib/format";
import { getStrapiMedia } from "@/lib/strapi";
import { Post } from "@/types/content";

interface CategoryCarouselProps {
  title: string;
  slug: string;
  posts: Post[];
  anchorId?: string;
}

export function CategoryCarousel({ title, slug, posts, anchorId }: CategoryCarouselProps) {
  const visiblePosts = useMemo(() => posts.slice(0, 8), [posts]);

  return (
    <section className="space-y-5" id={anchorId ?? `category-${slug}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-white/50">Category</p>
          <h2 className="text-3xl font-semibold text-white">{title}</h2>
        </div>
        <Link
          href={`/#category-${slug}`}
          className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:border-white/40"
        >
          More
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 pt-2 [scrollbar-width:thin]" style={{ scrollbarColor: "var(--accent) transparent" }}>
        {visiblePosts.map((post) => {
          const handle = post.slug ?? String(post.id);
          return (
          <Link
            key={post.id}
            href={`/posts/${handle}`}
            className="group min-w-[280px] max-w-[360px] snap-start overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_70px_rgba(0,0,0,0.45)] transition hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <div className="relative h-[360px] w-full">
              {post.cover && (
                <Image
                  src={getStrapiMedia(post.cover.url)}
                  alt={post.cover.alternativeText ?? post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, 360px"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition duration-500 group-hover:from-black/60" />
              <div className="absolute inset-0 z-10 flex flex-col justify-end gap-3 p-6 text-on-dark">
                <time className="text-xs font-semibold uppercase tracking-[0.4em] text-on-dark-subtle" dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                <p className="text-lg font-semibold leading-tight line-clamp-3">
                  {post.title || "Untitled mission"}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-on-dark">
                  <span>Read</span>
                  <span aria-hidden="true" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-base">
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
}
