import {
  LuArrowLeft,
  LuCalendar,
  LuClock,
  LuExternalLink,
  LuPencil,
  LuStar,
  LuUser,
} from "react-icons/lu";
import { Link, useParams } from "react-router";
import { useAdminPosts } from "../../hooks/usePosts";

const PostView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: posts, isPending } = useAdminPosts();
  const post = posts?.find((p) => p.id === id);

  if (isPending) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-foreground/40 font-light">Loading post…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-6">Post not found</h1>
        <Link
          to="/admin/posts"
          className="text-gold uppercase tracking-widest text-xs font-bold border-b border-gold/30 pb-1 hover:border-gold"
        >
          Back to posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Top bar: back + actions */}
      <div className="flex items-center justify-between gap-4 mb-12 max-mobile:flex-col max-mobile:items-start">
        <Link
          to="/admin/posts"
          className="inline-flex items-center gap-2 text-foreground/40 hover:text-gold transition-colors group text-xs uppercase tracking-widest font-bold"
        >
          <LuArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to posts
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={`/blog/${post.slug}`}
            target="_blank"
            title="View on site"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground/60 font-bold uppercase tracking-widest text-[10px] hover:border-gold hover:text-gold transition-all"
          >
            <LuExternalLink size={14} /> View on site
          </Link>
          <Link
            to={`/admin/posts/${post.id}/edit`}
            title="Edit post"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-black font-bold uppercase tracking-widest text-[10px] hover:bg-gold-light transition-all"
          >
            <LuPencil size={14} /> Edit
          </Link>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-6 text-xs uppercase tracking-widest font-bold">
        <span className="px-4 py-1 border border-gold/20 rounded-full text-gold">
          {post.category}
        </span>
        {post.featured && (
          <span className="inline-flex items-center gap-1 text-foreground/40">
            <LuStar size={12} className="text-gold" /> Featured
          </span>
        )}
      </div>

      <h1 className="text-6xl max-tablet:text-5xl max-mobile:text-4xl font-serif font-bold mb-8 tracking-tight leading-[1.1]">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-8 max-mobile:gap-4 text-foreground/40 text-xs uppercase tracking-widest font-bold border-y border-border py-6 mb-12">
        <div className="flex items-center gap-2">
          <LuUser size={15} className="text-gold" />
          <span>{post.author}</span>
        </div>
        <div className="flex items-center gap-2">
          <LuCalendar size={15} className="text-gold" />
          <span>{post.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <LuClock size={15} className="text-gold" />
          <span>{post.readTime}</span>
        </div>
      </div>

      {/* Cover image */}
      {post.image && (
        <div className="aspect-video overflow-hidden border border-border mb-12">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Excerpt */}
      <p className="text-foreground/60 text-xl font-serif italic leading-relaxed mb-12">
        {post.excerpt}
      </p>

      {/* Content */}
      <div
        className="blog-content text-foreground/70 text-lg leading-relaxed font-light space-y-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default PostView;
