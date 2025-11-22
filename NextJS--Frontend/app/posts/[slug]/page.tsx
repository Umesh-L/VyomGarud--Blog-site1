import Link from "next/link";
import Image from "next/image";
import { ArticleMeta } from "@/components/article-meta";
import { RichText } from "@/components/rich-text";
import { Container } from "@/components/ui/container";
import { TagPill } from "@/components/ui/tag-pill";
import { formatDate } from "@/lib/format";
import { getPostByHandle, getStrapiMedia } from "@/lib/strapi";

export const dynamic = "force-dynamic";

interface PageParams {
  params: { slug: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: PageParams) {
  const post = await getPostByHandle(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PageParams) {
  const post = await getPostByHandle(params.slug);

  if (!post) {
    return (
      <Container>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white">
          <p className="text-lg font-semibold">Mission log not found</p>
          <p className="mt-2 text-sm text-white/70">
            Verify the entry exists and is published in Strapi Command.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <main>
      <Container className="space-y-12">
        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white/80 transition hover:-translate-y-0.5 hover:border-white/40"
          >
            <span aria-hidden="true">←</span>
            Back to main page
          </Link>
        </div>
        <section className="space-y-6 text-center">
          <div className="flex justify-center gap-3">
            {post.categories?.map((category) => (
              <TagPill key={category.slug} label={category.name} />
            ))}
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-white">
            {post.title}
          </h1>
          <p className="text-lg text-white/70">{post.excerpt}</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-white/60">
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
        </section>

        {post.cover && (
          <div className="overflow-hidden rounded-4xl border border-white/10 shadow-2xl">
            <Image
              src={getStrapiMedia(post.cover.url)}
              alt={post.cover.alternativeText ?? post.title}
              width={1600}
              height={900}
              className="h-auto w-full object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <RichText content={post.content} />
          <div className="space-y-6">
            <ArticleMeta
              author={post.author}
              publishedAt={post.publishedAt}
              readingTime={post.readingTime}
              tags={post.tags}
            />
            <div className="vyom-card p-6">
              <p className="text-lg font-semibold text-white">Distribute intel</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                {[
                  { label: "Twitter", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${SITE_URL}/posts/${post.slug}`)}` },
                  { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${SITE_URL}/posts/${post.slug}`)}` },
                  { label: "Copy link", href: `${SITE_URL}/posts/${post.slug}` },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:-translate-y-0.5 hover:border-white/40"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
