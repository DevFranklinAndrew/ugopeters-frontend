import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  LuArrowRight,
  LuCalendar,
  LuClock,
  LuLoaderCircle,
  LuSearch,
} from "react-icons/lu";
import { Link } from "react-router";
import { CATEGORIES } from "../data/categories";
import { useFeaturedPost, usePostList } from "../hooks/usePosts";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { cn } from "../lib/utils";
import Pagination from "../components/Pagination";
import Select from "../components/Select";

const POSTS_PER_PAGE = 6;
const categories = ["All", ...CATEGORIES];

const Blog = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  // Debounced so typing doesn't fire a request per keystroke.
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  const { data: featuredPost } = useFeaturedPost();

  const isFiltering = query.trim() !== "" || category !== "All";

  const listQuery = usePostList({
    page: currentPage,
    limit: POSTS_PER_PAGE,
    category: category === "All" ? undefined : category,
    search: debouncedQuery || undefined,
  });

  const posts = listQuery.data?.posts ?? [];
  const total = listQuery.data?.pagination.total ?? 0;
  const totalPages = listQuery.data?.pagination.totalPages ?? 1;
  const page = listQuery.data?.pagination.page ?? currentPage;

  // While the typed term is ahead of the debounced one no request has fired
  // yet; counting that as busy shows the spinner on the first keystroke rather
  // than 300ms later.
  const isSearchPending = query.trim() !== debouncedQuery;
  // A refetch behind results already on screen. `isPending` is the first load
  // only, which renders as full-panel text instead.
  const isRefreshing =
    (listQuery.isFetching && !listQuery.isPending) || isSearchPending;

  // The featured post owns the hero, so it's kept out of the grid — except
  // while filtering, where it appears as an ordinary result.
  const currentPosts = isFiltering ? posts : posts.filter((p) => !p.featured);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    setTimeout(() => {
      const el = document.getElementById("currentPosts");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  // Search and filter changes reset to page 1.
  const handleQuery = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };
  const handleCategory = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };
  return (
    <div className="flex flex-col">
      <section className="pt-48 pb-32 max-medium-tablet:pt-32 max-medium-tablet:pb-20 px-12 bg-muted/5 max-mobile:px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold uppercase text-xs tracking-[.3rem] font-bold mb-6 block">
              Insights
            </span>
            <h1 className="text-8xl max-tablet:text-7xl max-mobile:text-6xl max-small-mobile:text-5xl font-serif font-bold leading-[1.1] mb-8 tracking-tight">
              Thought <br />
              <span className="text-gold">Leadership</span>
            </h1>
            <p className="text-foreground/60 text-2xl max-w-2xl leading-relaxed font-light max-small-tablet:text-lg">
              Strategic perspectives on real estate, business innovation, and
              leadership within the African market.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-32 px-12 max-tablet:py-24 max-mobile:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end gap-8 mb-24 max-small-tablet:mb-16 max-mobile:flex-col max-mobile:items-stretch max-mobile:gap-6">
            <div className="flex items-center gap-4 border-b border-border focus-within:border-gold transition-colors flex-1">
              {/* The icon doubles as the search's own progress indicator. */}
              {isRefreshing ? (
                <LuLoaderCircle
                  size={22}
                  className="text-gold shrink-0 animate-spin"
                />
              ) : (
                <LuSearch size={22} className="text-foreground/40 shrink-0" />
              )}
              <input
                value={query}
                onChange={(e) => handleQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-transparent py-4 focus:outline-none font-serif text-xl"
              />
            </div>
            <div className="flex flex-col gap-2 w-64 max-mobile:w-full">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                Category
              </label>
              <Select
                value={category}
                onChange={handleCategory}
                ariaLabel="Filter by category"
                options={categories.map((c) => ({
                  value: c,
                  label: c === "All" ? "All categories" : c,
                }))}
              />
            </div>
          </div>

          {/* Stays mounted — a live region must exist before it can announce.
              Only its contents toggle. */}
          <p
            aria-live="polite"
            className="-mt-16 max-small-tablet:-mt-10 mb-16 max-small-tablet:mb-10 h-5 flex items-center gap-3 text-[10px] uppercase tracking-[.2rem] font-bold text-foreground/40"
          >
            {isRefreshing ? (
              <>
                <LuLoaderCircle size={14} className="text-gold animate-spin" />
                Searching…
              </>
            ) : (
              isFiltering &&
              !listQuery.isPending &&
              !listQuery.isError && (
                <>
                  {total} article{total !== 1 && "s"} found
                </>
              )
            )}
          </p>

          {featuredPost && !isFiltering && (
            <motion.article
              title={featuredPost.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="group"
            >
              <div className="grid grid-cols-2 max-medium-tablet:grid-cols-1 gap-16 max-mobile:gap-8 items-center">
                <div className="relative aspect-video overflow-hidden border border-border">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-gold text-black text-[10px] font-bold uppercase tracking-widest shadow-xl">
                      Featured Insight
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-6 max-medium-mobile:gap-3 mb-6 text-foreground/40 text-xs uppercase tracking-widest font-bold">
                    <span className="text-gold">{featuredPost.category}</span>
                    <span className="w-1 h-1 bg-border rounded-full max-medium-mobile:hidden" />
                    <span className="flex items-center gap-2">
                      <LuCalendar size={14} /> {featuredPost.date}
                    </span>
                    <span className="w-1 h-1 bg-border rounded-full max-medium-mobile:hidden" />
                    <span className="flex items-center gap-2">
                      <LuClock size={14} /> {featuredPost.readTime}
                    </span>
                  </div>
                  <Link to={`/blog/${featuredPost.slug}`}>
                    <h2 className="text-5xl max-medium-mobile:text-4xl font-serif font-bold mb-6 group-hover:text-gold transition-colors tracking-tight leading-tight line-clamp-2">
                      {featuredPost.title}
                    </h2>
                  </Link>
                  <p className="text-foreground/50 line-clamp-4 text-lg leading-relaxed font-light mb-10 max-w-2xl">
                    {featuredPost.excerpt}
                  </p>
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-4 px-8 py-4 border border-gold/30 text-gold font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-black transition-all"
                  >
                    Read Full Article
                    <LuArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </motion.article>
          )}
          <div className="mb-32 max-small-tablet:mb-24" id="currentPosts" />

          {listQuery.isPending && (
            <div className="text-center py-24">
              <p className="text-xl font-serif text-foreground/50">
                Loading insights…
              </p>
            </div>
          )}
          {listQuery.isError && !listQuery.isPending && (
            <div className="text-center py-24">
              <p className="text-2xl font-serif text-foreground/60 mb-4">
                Couldn’t load articles
              </p>
              <p className="text-foreground/40 font-light">
                Please refresh the page or try again shortly.
              </p>
            </div>
          )}

          {/* Stale results go inert while refreshing, so a stray click can't
              open a card that's about to be replaced. */}
          <div
            aria-busy={isRefreshing || listQuery.isPending}
            className={cn(
              "grid grid-cols-2 gap-16 max-small-tablet:gap-8 max-mobile:grid-cols-1 transition-opacity duration-200",
              isRefreshing && "opacity-40 pointer-events-none",
            )}
          >
            <AnimatePresence>
              {currentPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  title={post.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden mb-8 border border-border">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center gap-4 mb-4 text-foreground/40 text-[10px] uppercase tracking-widest font-bold">
                    <span className="text-gold">{post.category}</span>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span>{post.date}</span>
                  </div>
                  <Link to={`/blog/${post.slug}`} className="block">
                    <h3 className="text-3xl max-medium-mobile:text-2xl font-serif font-bold mb-4 group-hover:text-gold transition-colors tracking-tight leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-foreground/50 text-lg leading-relaxed font-light mb-8 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                    <span className="text-foreground/30 text-[10px] uppercase tracking-widest flex items-center gap-2 font-bold">
                      <LuClock size={14} /> {post.readTime}
                    </span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-gold uppercase tracking-widest text-[10px] font-bold border-b border-gold/30 pb-1 hover:border-gold transition-all"
                    >
                      Read Article
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {!listQuery.isPending &&
            !listQuery.isError &&
            !isRefreshing &&
            currentPosts.length === 0 && (
              <div className="text-center py-24">
                <p className="text-3xl font-serif text-foreground/60 mb-4">
                  No articles found
                </p>
                <p className="text-foreground/40 font-light">
                  Try a different search term or category.
                </p>
              </div>
            )}

          {totalPages > 1 && (
            <div className="mt-32 max-small-tablet:mt-20 flex flex-col items-center gap-8">
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={handlePageChange}
                disabled={isRefreshing}
                size="lg"
              />
              <p className="text-foreground/30 text-[10px] uppercase tracking-[.2rem] font-bold">
                Page {page} of {totalPages}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
export default Blog;
