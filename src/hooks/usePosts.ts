import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "../lib/api";
import {
  createPost,
  deletePost,
  fetchPostBySlug,
  fetchPosts,
  postsKeys,
  updatePost,
  type PostListParams,
  type PostPayload,
} from "../api/posts.api";

/** Fetch all posts once (admin) — the CMS list, and the source for by-id lookups. */
const ADMIN_LIMIT = 1000;

/** Paginated/filterable list for the public blog grid. */
export const usePostList = (params: PostListParams) =>
  useQuery({
    queryKey: postsKeys.list(params),
    queryFn: () => fetchPosts(params),
    placeholderData: keepPreviousData,
  });

/** The single featured post for the blog hero. */
export const useFeaturedPost = () =>
  useQuery({
    queryKey: postsKeys.featured(),
    queryFn: () => fetchPosts({ featured: true, limit: 1 }),
    select: (result) => result.posts[0],
  });

/** A single post by slug for the public BlogDetail page. */
export const usePost = (slug: string | undefined) =>
  useQuery({
    queryKey: postsKeys.detail(slug ?? ""),
    queryFn: () => fetchPostBySlug(slug as string),
    enabled: Boolean(slug),
    retry: false,
  });

/**
 * All posts for the admin dashboard. The backend has no get-by-id endpoint, so
 * PostView / PostEditor derive a single post from this cached list by `id`
 * (as the old in-memory `getPost` did).
 */
export const useAdminPosts = () =>
  useQuery({
    queryKey: postsKeys.admin(),
    queryFn: () => fetchPosts({ limit: ADMIN_LIMIT }),
    select: (result) => result.posts,
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PostPayload) => createPost(payload),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all });
      toast.success(`Published “${post.title}”.`);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PostPayload }) =>
      updatePost(id, payload),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all });
      toast.success(`Saved changes to “${post.title}”.`);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all });
      toast.success("Post deleted.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};
