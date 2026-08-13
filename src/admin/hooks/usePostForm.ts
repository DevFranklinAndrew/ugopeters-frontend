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

/** Holds everything stateful behind the post editor, so PostEditorForm can stay
 *  presentational. */
export const usePostForm = (existing?: Post) => {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const isEditing = Boolean(existing);
  // Images upload before the mutation runs, so saving spans both.
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
    // Base64 for an instant preview; resolvePostImages swaps it for a Cloudinary
    // URL at save time.
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
      // Omitted when blank, so the server derives it from the content.
      excerpt: values.excerpt?.trim() || undefined,
      // `date` is deliberately absent: the CMS doesn't edit it, so the server
      // dates new posts and an edit leaves the existing date alone.
    };

    // Resolved first, so the request carries URLs rather than megabytes of base64.
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
