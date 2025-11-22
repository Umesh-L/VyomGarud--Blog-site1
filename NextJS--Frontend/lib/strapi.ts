import qs from "qs";
import { estimateReadingTime } from "@/lib/format";
import {
  Author,
  Post,
  StrapiAuthorAttributes,
  StrapiAuthorRelation,
  StrapiEntity,
  StrapiListResponse,
  StrapiMedia,
  StrapiMediaRelation,
  StrapiPostAttributes,
  StrapiTaxonomyAttributes,
  StrapiTaxonomyRelation,
  Taxonomy,
} from "@/types/content";

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

interface FetchParams {
  populate?: string | string[] | Record<string, unknown>;
  sort?: string[];
  filters?: Record<string, unknown>;
  pagination?: { page?: number; pageSize?: number };
}

async function strapiFetch<T>(path: string, params?: FetchParams): Promise<T> {
  const query = params
    ? qs.stringify(
        {
          populate: params.populate,
          sort: params.sort,
          filters: params.filters,
          pagination: params.pagination,
        },
        { encodeValuesOnly: true }
      )
    : "";

  const url = `${STRAPI_BASE}${path}${query ? `?${query}` : ""}`;

  if (process.env.NODE_ENV !== "production") {
    console.log(`[strapiFetch] GET ${url}`);
  }

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Strapi request failed: ${res.status}`);
  }

  const payload = (await res.json()) as T;

  if (process.env.NODE_ENV !== "production") {
    console.log(`[strapiFetch] Response for ${path}:`, JSON.stringify(payload, null, 2));
  }

  return payload;
}

function mapMedia(media?: StrapiMediaRelation | null): StrapiMedia | undefined {
  if (!media) return undefined;
  const payload =
    typeof media.data === "object" && media.data !== null && "attributes" in media.data
      ? media.data.attributes
      : (media.data as StrapiMedia | undefined) ?? (media as unknown as StrapiMedia);
  if (!payload?.url) return undefined;
  return {
    url: payload.url,
    width: payload.width,
    height: payload.height,
    alternativeText: payload.alternativeText,
  };
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

function unwrapEntity<T>(entity?: StrapiEntity<T> | null): (T & { id?: number }) | undefined {
  if (!entity) return undefined;
  const attributes = entity.attributes ?? ((entity as unknown) as T);
  if (!attributes) return undefined;
  return { ...attributes, id: entity.id };
}

function getPublishedPostCount(attr?: StrapiTaxonomyAttributes & { id?: number }) {
  const collection = attr?.posts && "data" in attr.posts ? attr.posts.data : undefined;
  if (!Array.isArray(collection)) return 0;
  return collection.reduce((count, post) => {
    const postAttr = unwrapEntity<StrapiPostAttributes>(post);
    return postAttr?.statuss === "published" ? count + 1 : count;
  }, 0);
}

function toTaxonomy(attr?: (StrapiTaxonomyAttributes & { id?: number }) | null): Taxonomy | null {
  if (!attr?.name) return null;
  const slug = attr.slug ?? slugify(attr.name);
  const fallbackId = slug.split("").reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0);
  const publishedCount = getPublishedPostCount(attr);
  return {
    id: attr.id ?? fallbackId,
    name: attr.name,
    slug,
    postCount: publishedCount > 0 ? publishedCount : undefined,
  } satisfies Taxonomy;
}

function mapTaxonomy(collection?: StrapiTaxonomyRelation | null): Taxonomy[] {
  const items: StrapiEntity<StrapiTaxonomyAttributes>[] = Array.isArray(collection)
    ? (collection as StrapiEntity<StrapiTaxonomyAttributes>[])
    : collection?.data ?? [];
  return items
    .map((item) => toTaxonomy(unwrapEntity<StrapiTaxonomyAttributes>(item)))
    .filter((taxonomy): taxonomy is Taxonomy => Boolean(taxonomy));
}

function mapAuthor(author?: StrapiAuthorRelation | null): Author | undefined {
  if (!author) return undefined;
  const entity =
    typeof author === "object" && author !== null && "data" in author
      ? (author.data as StrapiEntity<StrapiAuthorAttributes> | undefined)
      : (author as unknown as StrapiEntity<StrapiAuthorAttributes>);
  const attr = unwrapEntity<StrapiAuthorAttributes>(entity);
  if (!attr?.name) return undefined;
  return {
    id: attr.id ?? 0,
    name: attr.name,
    role: attr.role,
    bio: attr.bio,
    avatar: mapMedia(attr.avatar) ?? null,
  };
}

function mapPost(entry?: StrapiEntity<StrapiPostAttributes> | null): Post | null {
  const attr = unwrapEntity<StrapiPostAttributes>(entry);
  if (!attr?.title) return null;
  const content = attr.content ?? "";
  const publishedAt = attr.publishedAt ?? attr.publishedat ?? new Date().toISOString();
  const fallbackId = attr.id ?? Math.floor(Math.random() * 1_000_000);
  const providedSlug = attr.slug?.trim();
  const slugFallback = attr.id ? String(attr.id) : slugify(`${attr.title ?? `post-${fallbackId}`}-${fallbackId}`);
  const slug = providedSlug && providedSlug.length > 0 ? providedSlug : slugFallback;
  return {
    id: fallbackId,
    title: attr.title,
    slug,
    excerpt: attr.excerpt ?? content.slice(0, 140),
    content,
    publishedAt,
    status: attr.statuss,
    readingTime: estimateReadingTime(content),
    cover: mapMedia(attr.cover) ?? null,
    author: mapAuthor(attr.author) ?? null,
    categories: mapTaxonomy(attr.categories),
    tags: mapTaxonomy(attr.tags),
  };
}

export async function getPosts(): Promise<Post[]> {
  const data = await strapiFetch<StrapiListResponse<StrapiPostAttributes>>("/api/posts", {
    populate: "*",
    sort: ["publishedAt:desc"],
    filters: { statuss: { $eq: "published" } },
  });
  return (data.data ?? []).map(mapPost).filter((post): post is Post => Boolean(post));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const data = await strapiFetch<StrapiListResponse<StrapiPostAttributes>>("/api/posts", {
    populate: "*",
    filters: {
      slug: { $eq: slug },
      statuss: { $eq: "published" },
    },
  });

  const entry = data.data?.[0];
  return entry ? mapPost(entry) ?? undefined : undefined;
}

export async function getPostById(id: number): Promise<Post | undefined> {
  const data = await strapiFetch<StrapiListResponse<StrapiPostAttributes>>("/api/posts", {
    populate: "*",
    filters: {
      id: { $eq: id },
      statuss: { $eq: "published" },
    },
  });
  const entry = data.data?.[0];
  return entry ? mapPost(entry) ?? undefined : undefined;
}

export async function getPostByHandle(handle: string): Promise<Post | undefined> {
  const postBySlug = await getPostBySlug(handle);
  if (postBySlug) return postBySlug;

  const numericHandle = Number(handle);
  if (!Number.isNaN(numericHandle)) {
    return getPostById(numericHandle);
  }

  const suffixMatch = handle.match(/-(\d+)$/);
  if (suffixMatch) {
    return getPostById(Number(suffixMatch[1]));
  }

  return undefined;
}

export async function getLatestPost(): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts[0];
}

export async function getCategories(): Promise<Taxonomy[]> {
  const data = await strapiFetch<StrapiListResponse<StrapiTaxonomyAttributes>>("/api/categories", {
    populate: {
      posts: {
        fields: ["statuss"],
      },
    },
    sort: ["name:asc"],
  });

  return (data.data ?? [])
    .map((entry) => {
      const taxonomy = toTaxonomy(unwrapEntity<StrapiTaxonomyAttributes>(entry));
      if (!taxonomy) return null;
      if (typeof taxonomy.postCount === "number" && taxonomy.postCount <= 0) {
        return null;
      }
      return taxonomy;
    })
    .filter((category): category is Taxonomy => Boolean(category));
}

export function getStrapiMedia(path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${STRAPI_BASE}${path}`;
}
