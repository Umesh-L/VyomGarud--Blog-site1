import Image from "next/image";
import { formatDate } from "@/lib/format";
import { getStrapiMedia } from "@/lib/strapi";
import { Author, Taxonomy } from "@/types/content";

interface ArticleMetaProps {
  author?: Author | null;
  publishedAt: string;
  readingTime?: number;
  tags?: Taxonomy[];
}

export function ArticleMeta({ author, publishedAt, readingTime, tags }: ArticleMetaProps) {
  return (
    <div className="vyom-card p-6 text-white">
      <div className="flex items-center gap-4">
        {author?.avatar?.url ? (
          <Image
            src={getStrapiMedia(author.avatar.url)}
            alt={author?.name ?? "Author"}
            width={56}
            height={56}
            className="rounded-2xl object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)] text-xl font-semibold text-black">
            {(author?.name ?? "?").charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm text-white/60">Systems Lead</p>
          <p className="text-lg font-semibold text-white">{author?.name ?? "VyomGarud Command"}</p>
          {author?.role && <p className="text-sm text-white/60">{author.role}</p>}
        </div>
      </div>
      <div className="mt-6 grid gap-3 text-sm text-white/60">
        <div className="flex items-center justify-between">
          <span>Published</span>
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        </div>
        {readingTime && (
          <div className="flex items-center justify-between">
            <span>Reading time</span>
            <span>{readingTime} min</span>
          </div>
        )}
      </div>
      {tags && tags.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag.slug} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
