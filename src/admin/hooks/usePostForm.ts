import { useState, type ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { Post } from "../../data/post";
import type { PostPayload } from "../../api/posts.api";
import { getApiErrorMessage } from "../../lib/api";
import { useCreatePost, useUpdatePost } from "../../hooks/usePosts";
import { resolvePostImages } from "../lib/postImages";
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
  // Uploading pending images to Cloudinary happens before the mutation runs.
  const [isUploading, setIsUploading] = useState(false);
  const isSaving =
    isUploading || createPost.isPending || updatePost.isPending;

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: existing ? toPostFormValues(existing) : postFormDefaults(),
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
    // Store the cover as a base64 data URL for an instant preview; it's uploaded
    // to Cloudinary (and swapped for its URL) at save time by resolvePostImages.
    const reader = new FileReader();
    reader.onload = () =>
      setValue("image", reader.result as string, { shouldValidate: true });
    reader.readAsDataURL(file);
  };

  const submit = handleSubmit(async (values) => {
    const basePayload: PostPayload = {
      title: values.title,
      content: values.content,
      category: values.category,
      image: values.image,
      featured: values.featured,
      // Optional — omit when blank so the server derives it from the content.
      excerpt: values.excerpt?.trim() || undefined,
      // Free text, stored and displayed verbatim; the server parses it only to
      // derive the sortable publishedAt.
      date: values.date.trim(),
    };

    // Upload any base64 cover/inline images first so the post carries only URLs.
    let payload: PostPayload;
    setIsUploading(true);
    try {
      payload = await resolvePostImages(basePayload);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Image upload failed. Please try again."),
      );
      return;
    } finally {
      setIsUploading(false);
    }

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
