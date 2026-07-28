import type { ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import type { Post } from "../../data/post";
import type { PostPayload } from "../../api/posts.api";
import { useCreatePost, useUpdatePost } from "../../hooks/usePosts";
import {
  postFormDefaults,
  postSchema,
  toPostFormValues,
  type PostFormValues,
} from "../schemas/post.schema";

/**
 * All the stateful behavior behind the post editor: form setup + validation,
 * the create/update mutations, cover-image upload, and navigation on success.
 * The form component stays purely presentational.
 */
export const usePostForm = (existing?: Post) => {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const isEditing = Boolean(existing);
  const isSaving = createPost.isPending || updatePost.isPending;

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: existing ? toPostFormValues(existing) : postFormDefaults,
  });
  const { control, setValue, handleSubmit } = form;

  const image = useWatch({ control, name: "image" });

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file.");
      return;
    }
    // No upload backend yet — embed the cover as a base64 data URL. Swap this
    // for an upload call returning a URL once the API exists.
    const reader = new FileReader();
    reader.onload = () =>
      setValue("image", reader.result as string, { shouldValidate: true });
    reader.readAsDataURL(file);
  };

  const submit = handleSubmit((values) => {
    const payload: PostPayload = {
      title: values.title,
      content: values.content,
      category: values.category,
      image: values.image,
      featured: values.featured,
      // Optional — omit when blank so the server derives it from the content.
      excerpt: values.excerpt?.trim() || undefined,
    };

    const onSuccess = () => navigate("/admin/posts");
    if (isEditing && existing) {
      updatePost.mutate({ id: existing.id, payload }, { onSuccess });
    } else {
      createPost.mutate(payload, { onSuccess });
    }
  });

  return {
    form,
    submit,
    handleCoverChange,
    image,
    isEditing,
    isSaving,
  };
};
