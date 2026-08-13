import { useState } from "react";
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuSearch,
  LuStar,
  LuEye,
  LuExternalLink,
  LuLoaderCircle,
} from "react-icons/lu";
import { motion } from "motion/react";
import { Link } from "react-router";
import { usePostList, useDeletePost } from "../../hooks/usePosts";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useConfirm } from "../../context/ConfirmContext";
import { CATEGORIES } from "../../data/categories";
import { cn } from "../../lib/utils";
import Pagination from "../../components/Pagination";
import Select from "../../components/Select";

const POSTS_PER_PAGE = 8;
const categories = ["All", ...CATEGORIES];

const Posts = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  // Debounced so typing doesn't fire a request per keystroke.
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  // Search, filter and paging all happen server-side; the query key is the
  // params, so changing any of them refetches.
  const { data, isPending, isFetching, isError } = usePostList({
    page,
    limit: POSTS_PER_PAGE,
    category: category === "All" ? undefined : category,
    search: debouncedQuery || undefined,
  });
  const deletePost = useDeletePost();
  const confirm = useConfirm();

  const posts = data?.posts ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;
  const currentPage = data?.pagination.page ?? page;

  // While the typed term is ahead of the debounced one no request has fired
  // yet; counting that as busy shows the spinner on the first keystroke rather
  // than 300ms later.
  const isSearchPending = query.trim() !== debouncedQuery;
  // A refetch behind results already on screen. `isPending` is the first load
  // only, which the list renders as full-panel text instead.
  const isRefreshing = (isFetching && !isPending) || isSearchPending;

  // Search and filter changes reset to page 1.
  const handleQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const handleCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleDelete = async (id: string, title: string) => {
    const ok = await confirm({
      title: "Delete post",
      description: `“${title}” will be permanently deleted. This cannot be undone.`,
      confirmText: "Delete",
      tone: "danger",
    });
    if (ok) deletePost.mutate(id);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex items-end justify-between mb-12 max-mobile:flex-col max-mobile:items-start max-mobile:gap-6">
        <div>
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 block">
            Content
          </span>
          <h1 className="text-5xl max-mobile:text-4xl font-serif font-bold tracking-tight">
            Blog Posts
          </h1>
          <p className="text-foreground/50 mt-2 font-light flex items-center gap-2">
            {total} article{total !== 1 && "s"}
            {debouncedQuery || category !== "All" ? " matched." : " published."}
            {/* Stays mounted — a live region must exist before it can announce.
                Only its contents toggle. */}
            <span
              aria-live="polite"
              className="inline-flex items-center gap-2 text-gold text-sm"
            >
              {isRefreshing && (
                <>
                  <LuLoaderCircle size={14} className="animate-spin" />
                  Loading…
                </>
              )}
            </span>
          </p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-3 px-6 py-3 bg-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all shadow-lg shadow-gold/10"
        >
          <LuPlus size={16} /> New Post
        </Link>
      </header>

      <div className="flex items-end gap-6 mb-8 max-mobile:flex-col max-mobile:items-stretch max-mobile:gap-4">
        <div className="flex items-center gap-3 border-b border-border focus-within:border-gold transition-colors flex-1 max-w-md">
          {/* The icon doubles as the search's own progress indicator. */}
          {isRefreshing ? (
            <LuLoaderCircle size={18} className="text-gold animate-spin" />
          ) : (
            <LuSearch size={18} className="text-foreground/40" />
          )}
          <input
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full bg-transparent py-3 focus:outline-none font-serif text-lg"
          />
        </div>
        <div className="flex flex-col gap-1 max-mobile:w-full">
          <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
            Filter by category
          </label>
          <Select
            value={category}
            onChange={handleCategory}
            ariaLabel="Filter by category"
            className="min-w-48 max-mobile:w-full"
            options={categories.map((c) => ({
              value: c,
              label: c === "All" ? "All categories" : c,
            }))}
          />
        </div>
      </div>

      {/* Stale rows go inert while refreshing, so a stray click can't act on a
          row that's about to be replaced. */}
      <div
        aria-busy={isRefreshing || isPending}
        className={cn(
          "bg-card border border-border divide-y divide-border transition-opacity duration-200",
          isRefreshing && "opacity-40 pointer-events-none",
        )}
      >
        {isPending && (
          <p className="px-6 py-12 text-center text-foreground/40 font-light flex items-center justify-center gap-3">
            <LuLoaderCircle size={16} className="animate-spin text-gold" />
            Loading posts…
          </p>
        )}
        {isError && !isPending && (
          <p className="px-6 py-12 text-center text-red-500/80 font-light">
            Couldn’t load posts. Please try again.
          </p>
        )}
        {!isPending && !isError && posts.length === 0 && (
          <p className="px-6 py-12 text-center text-foreground/40 font-light">
            No posts found.
          </p>
        )}
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
            className="flex items-center gap-6 px-6 py-5 hover:bg-muted/5 transition-colors max-small-tablet:flex-col max-small-tablet:items-start max-small-tablet:gap-4"
          >
            <div className="w-16 h-16 shrink-0 overflow-hidden border border-border bg-muted/10">
              {post.image && (
                <img
                  src={post.image}
                  alt=""
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            <div className="min-w-0 w-full flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
                  {post.category}
                </span>
                {post.featured && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                    <LuStar size={12} className="text-gold" /> Featured
                  </span>
                )}
              </div>
              <Link
                to={`/admin/posts/${post.id}`}
                className="font-serif text-xl truncate block hover:text-gold transition-colors"
                title={post.title}
              >
                {post.title}
              </Link>
              <p className="text-foreground/40 text-sm truncate">
                {post.date} · {post.readTime} · {post.author}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/admin/posts/${post.id}`}
                title="View in dashboard"
                className="w-10 h-10 flex items-center justify-center border border-border text-foreground/50 hover:border-gold hover:text-gold transition-all"
              >
                <LuEye size={16} />
              </Link>
              <Link
                to={`/blog/${post.slug}`}
                target="_blank"
                title="View on site"
                className="w-10 h-10 flex items-center justify-center border border-border text-foreground/50 hover:border-gold hover:text-gold transition-all"
              >
                <LuExternalLink size={16} />
              </Link>
              <Link
                to={`/admin/posts/${post.id}/edit`}
                title="Edit"
                className="w-10 h-10 flex items-center justify-center border border-border text-foreground/50 hover:border-gold hover:text-gold transition-all"
              >
                <LuPencil size={16} />
              </Link>
              <button
                onClick={() => handleDelete(post.id, post.title)}
                disabled={deletePost.isPending}
                title="Delete"
                className="w-10 h-10 flex items-center justify-center border border-border text-foreground/50 hover:border-red-500 hover:text-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-foreground/50"
              >
                {deletePost.isPending && deletePost.variables === post.id ? (
                  <LuLoaderCircle size={16} className="animate-spin" />
                ) : (
                  <LuTrash2 size={16} />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 mt-8 max-mobile:flex-col">
          <p className="text-foreground/40 text-sm font-light">
            Showing {(currentPage - 1) * POSTS_PER_PAGE + 1}–
            {Math.min(currentPage * POSTS_PER_PAGE, total)} of {total}
          </p>
          {/* Disabled mid-fetch, or stacked clicks overshoot the target page.
              `page` is the requested page, `currentPage` the confirmed one, so
              they differ exactly while the next page is in flight. */}
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setPage}
            disabled={isRefreshing}
            loadingPage={isRefreshing ? page : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default Posts;
