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

const ADMIN_LIMIT = 1000;

export const usePostList = (params: PostListParams) =>
  useQuery({
    queryKey: postsKeys.list(params),
    queryFn: () => fetchPosts(params),
    placeholderData: keepPreviousData,
  });

export const useFeaturedPost = () =>
  useQuery({
    queryKey: postsKeys.featured(),
    queryFn: () => fetchPosts({ featured: true, limit: 1 }),
    select: (result) => result.posts[0],
  });

export const usePost = (slug: string | undefined) =>
  useQuery({
    queryKey: postsKeys.detail(slug ?? ""),
    queryFn: () => fetchPostBySlug(slug as string),
    enabled: Boolean(slug),
    retry: false,
  });

/** Fetches every post at once: the backend has no get-by-id endpoint, so
 *  PostView / PostEditor look a single post up from this cached list. */
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
