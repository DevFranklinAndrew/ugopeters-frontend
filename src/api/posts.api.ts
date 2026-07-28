import { api } from "../lib/api";
import type { Post } from "../data/post";

/** Query params accepted by `GET /api/posts` (server-side paging + filtering). */
export interface PostListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
}

/** Pagination metadata returned alongside a list of posts. */
export interface PostPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PostListResult {
  posts: Post[];
  pagination: PostPagination;
}

/**
 * The client-supplied fields for create/update. The server owns the derived
 * fields (`slug`, `date`, `readTime`, `author`, and `excerpt` when blank), so
 * they are never sent from the CMS.
 */
export type PostPayload = Pick<Post, "title" | "content" | "category" | "image"> & {
  excerpt?: string;
  featured?: boolean;
};

/** Centralized React Query keys for the posts resource. */
export const postsKeys = {
  all: ["posts"] as const,
  list: (params: PostListParams) => ["posts", "list", params] as const,
  detail: (slug: string) => ["posts", "detail", slug] as const,
  featured: () => ["posts", "featured"] as const,
  admin: () => ["posts", "admin"] as const,
};

interface PostEnvelope {
  data: { post: Post };
}
interface PostListEnvelope {
  data: PostListResult;
}

/** Serializes list params to a query string, dropping undefined/empty values. */
const toQueryString = (params: PostListParams): string => {
  const search = new URLSearchParams();
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.category) search.set("category", params.category);
  if (params.search) search.set("search", params.search);
  if (params.featured !== undefined)
    search.set("featured", String(params.featured));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

export const fetchPosts = async (
  params: PostListParams = {},
): Promise<PostListResult> => {
  const { data } = await api.get<PostListEnvelope>(
    `/posts${toQueryString(params)}`,
  );
  return data.data;
};

export const fetchPostBySlug = async (slug: string): Promise<Post> => {
  const { data } = await api.get<PostEnvelope>(`/posts/${slug}`);
  return data.data.post;
};

export const createPost = async (payload: PostPayload): Promise<Post> => {
  const { data } = await api.post<PostEnvelope>("/posts", payload);
  return data.data.post;
};

export const updatePost = async (
  id: string,
  payload: PostPayload,
): Promise<Post> => {
  const { data } = await api.patch<PostEnvelope>(`/posts/${id}`, payload);
  return data.data.post;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};
