import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  LuArrowRight,
  LuCalendar,
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuSearch,
} from "react-icons/lu";
import { Link } from "react-router";
import { posts } from "../data/post";
import { cn } from "../lib/utils";
import Select from "../components/Select";

const POSTS_PER_PAGE = 6;
const Blog = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const featuredPost = useMemo(() => posts.find((p) => p.featured), []);

  const categories = useMemo(
    () => ["All", ...[...new Set(posts.map((p) => p.category))].sort()],
    [],
  );

  // The featured post is only highlighted in the default view; once the reader
  // searches or filters, it joins the grid as a normal (searchable) result.
  const isFiltering = query.trim() !== "" || category !== "All";

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtering = q !== "" || category !== "All";
    const source = filtering ? posts : posts.filter((p) => !p.featured);
    return source.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchesCategory = category === "All" || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
  );
  const page = Math.min(currentPage, totalPages);

  const currentPosts = useMemo(() => {
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [page, filteredPosts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    setTimeout(() => {
      const el = document.getElementById("currentPosts");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  // Reset to the first page whenever the search or filter changes.
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
      {/* Hero Section */}
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

      {/* Blog Content */}
      <section className="py-32 px-12 max-tablet:py-24 max-mobile:px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search + Filter */}
          <div className="flex items-end gap-8 mb-24 max-small-tablet:mb-16 max-mobile:flex-col max-mobile:items-stretch max-mobile:gap-6">
            <div className="flex items-center gap-4 border-b border-border focus-within:border-gold transition-colors flex-1">
              <LuSearch size={22} className="text-foreground/40 shrink-0" />
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

          {/* Featured Post - default view only */}
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
          {/* Regular Posts Grid */}
          <div className="grid grid-cols-2 gap-16 max-small-tablet:gap-8 max-mobile:grid-cols-1">
            <AnimatePresence>
              {currentPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  title={post.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  // exit={{ opacity: 0, y: -30 }}
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

          {/* Empty state */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-24">
              <p className="text-3xl font-serif text-foreground/60 mb-4">
                No articles found
              </p>
              <p className="text-foreground/40 font-light">
                Try a different search term or category.
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-32 flex flex-col items-center gap-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="w-12 h-12 flex items-center justify-center border border-border text-foreground/40 hover:border-gold hover:text-gold disabled:opacity-20 disabled:hover:border-border disabled:hover:text-foreground/40 transition-all"
                >
                  <LuChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={cn(
                          "w-12 h-12 flex items-center justify-center border text-[10px] font-bold uppercase tracking-widest transition-all",
                          page === pageNum
                            ? "bg-gold border-gold text-black"
                            : "border-border text-foreground/40 hover:border-gold/50 hover:text-gold",
                        )}
                      >
                        {pageNum.toString().padStart(2, "0")}
                      </button>
                    ),
                  )}
                </div>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="w-12 h-12 flex items-center justify-center border border-border text-foreground/40 hover:border-gold hover:text-gold disabled:opacity-20 disabled:hover:border-border disabled:hover:text-foreground/40 transition-all"
                >
                  <LuChevronRight size={20} />
                </button>
              </div>

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
