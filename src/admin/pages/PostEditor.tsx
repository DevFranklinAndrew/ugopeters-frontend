import { Link, useParams } from "react-router";
import { useAdminPosts } from "../../hooks/usePosts";
import PostEditorForm from "../components/PostEditorForm";

const BackToPosts = () => (
  <Link
    to="/admin/posts"
    className="text-gold uppercase tracking-widest text-xs font-bold border-b border-gold/30 pb-1 hover:border-gold"
  >
    Back to posts
  </Link>
);

/** Absorbs the loading / not-found states so the form can assume a valid post.
 *  The `key` resets form state when switching between posts. */
const PostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { data: posts, isPending } = useAdminPosts();

  if (isEditing && isPending) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-foreground/40 font-light">Loading post…</p>
      </div>
    );
  }

  const existing = isEditing ? posts?.find((p) => p.id === id) : undefined;

  if (isEditing && !existing) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-6">Post not found</h1>
        <BackToPosts />
      </div>
    );
  }

  return <PostEditorForm key={existing?.id ?? "new"} existing={existing} />;
};

export default PostEditor;
