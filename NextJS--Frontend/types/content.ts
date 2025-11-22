export interface StrapiMedia {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface StrapiMediaRelation {
  data?: {
    id?: number;
    attributes?: StrapiMedia | null;
  } | StrapiMedia | null;
}

export interface Author {
  id: number;
  name: string;
  role?: string;
  avatar?: StrapiMedia | null;
  bio?: string;
}

export interface Taxonomy {
  id: number;
  name: string;
  slug: string;
  postCount?: number;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readingTime?: number;
  status?: "draft" | "published";
  cover?: StrapiMedia | null;
  author?: Author | null;
  categories?: Taxonomy[];
  tags?: Taxonomy[];
}

export interface StrapiEntity<T> {
  id?: number;
  documentId?: string;
  attributes?: T | null;
  [key: string]: unknown;
}

export interface StrapiListResponse<T> {
  data: Array<StrapiEntity<T>>;
  meta?: unknown;
}

export interface StrapiRelationList<T> {
  data?: Array<StrapiEntity<T>> | null;
}

export interface StrapiRelationSingle<T> {
  data?: StrapiEntity<T> | null;
}

export interface StrapiAuthorAttributes {
  name: string;
  role?: string;
  bio?: string;
  avatar?: StrapiMediaRelation;
}

export type StrapiAuthorRelation =
  | StrapiRelationSingle<StrapiAuthorAttributes>
  | StrapiEntity<StrapiAuthorAttributes>
  | null;

export interface StrapiTaxonomyAttributes {
  name: string;
  slug?: string;
  posts?: StrapiRelationList<StrapiPostAttributes>;
}

export type StrapiTaxonomyRelation =
  | StrapiRelationList<StrapiTaxonomyAttributes>
  | Array<StrapiEntity<StrapiTaxonomyAttributes>>
  | null;

export interface StrapiPostAttributes {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  publishedAt?: string;
  publishedat?: string;
  statuss?: "draft" | "published";
  cover?: StrapiMediaRelation;
  author?: StrapiAuthorRelation;
  categories?: StrapiTaxonomyRelation;
  tags?: StrapiTaxonomyRelation;
}
