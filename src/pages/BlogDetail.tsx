import {
  LuArrowLeft,
  LuArrowRight,
  LuCalendar,
  LuCheck,
  LuClock,
  LuShare2,
  LuUser,
} from "react-icons/lu";
import { motion, useScroll, useSpring } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useParams } from "react-router";
import { usePost, usePostList } from "../hooks/usePosts";
import { useSubscribe } from "../hooks/useSubscribers";
import {
  newsletterSchema,
  type NewsletterFormValues,
} from "../schemas/newsletter.schema";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isPending, isError } = usePost(slug);

  const [copied, setCopied] = useState(false);

  const subscribe = useSubscribe();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubscribe = handleSubmit(({ email }) =>
    subscribe.mutate(email, { onSuccess: () => reset() }),
  );
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Two pools for the "related" strip below; both need `post` to have loaded.
  const categoryQuery = usePostList({ category: post?.category, limit: 7 });
  const recentQuery = usePostList({ limit: 7 });

  if (isPending)
    return (
      <div className="pt-48 pb-32 px-4 text-center">
        <p className="text-2xl font-serif text-foreground/50">
          Loading article…
        </p>
      </div>
    );

  if (isError || !post)
    return (
      <div className="pt-48 pb-32 px-4 text-center">
        <h1 className="text-6xl font-serif font-bold mb-8">
          Article Not Found
        </h1>
        <Link
          to="/blog"
          className="text-gold uppercase tracking-widest text-sm font-bold border-b border-gold/30 pb-1 hover:border-gold transition-all"
        >
          Back to Insights
        </Link>
      </div>
    );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
        return;
      } catch {
        // share sheet dismissed — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  // Same-category posts first, topped up with recent ones.
  const sameCategory = (categoryQuery.data?.posts ?? []).filter(
    (p) => p.slug !== post.slug && p.category === post.category,
  );
  const relatedPosts = [
    ...sameCategory,
    ...(recentQuery.data?.posts ?? []).filter(
      (p) =>
        p.slug !== post.slug && !sameCategory.some((s) => s.slug === p.slug),
    ),
  ].slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Reading progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 h-1 bg-gold origin-left z-50"
      />
      <section className="pt-48 max-tablet:pt-32 max-tablet:pb-24 max-mobile:px-4 pb-32 px-12 bg-muted/5">
        <div className="max-w-4xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-3 text-foreground/40 hover:text-gold transition-colors mb-12 group"
            >
              <LuArrowLeft
                size={18}
                className="group-hover:-translate-x-2 transition-transform"
              />
              <span className="uppercase tracking-[.2rem] text-[10px] font-bold">
                Back to Insights
              </span>
            </Link>
            <div className="flex items-center gap-3 text-gold mb-8 max-small-tablet:mb-4 text-xs uppercase tracking-widest font-bold">
              <span className="px-4 py-1 border border-gold/20 rounded-full">
                {post.category}
              </span>
            </div>
            <h1 className="text-7xl max-tablet:text-6xl max-mobile:text-5xl max-small-mobile:text-4xl font-serif font-bold mb-10 max-small-tablet:mb-6 tracking-tight leading-[1.1]">
              {post.title}
            </h1>
            <p className="text-2xl max-mobile:text-xl text-foreground/60 font-serif italic font-light leading-relaxed mb-12 max-small-tablet:mb-8 max-w-3xl">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-12 max-mobile:gap-6 text-foreground/40 text-xs uppercase tracking-widest font-bold border-y border-border py-8 max-small-tablet:py-4">
              <div className="flex items-center gap-3">
                <LuUser size={16} className="text-gold" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-3">
                <LuCalendar size={16} className="text-gold" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <LuClock size={16} className="text-gold" />
                <span>{post.readTime}</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-3 hover:text-gold transition-colors ml-auto group"
              >
                {copied ? (
                  <>
                    <LuCheck size={16} className="text-gold" />
                    <span className="text-gold">Link Copied</span>
                  </>
                ) : (
                  <>
                    <LuShare2 size={16} />
                    <span>Share Insight</span>
                  </>
                )}
              </button>
            </div>
          </motion.header>
        </div>
      </section>
      <section className="px-12 max-mobile:px-4 -mt-20 max-mobile:-mt-10 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="aspect-21/9 max-medium-mobile:aspect-13/9 overflow-hidden border border-border shadow-2xl"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      <div className="py-32 max-tablet:py-20 max-mobile:pt-10 max-mobile:px-4 px-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className=""
          >
            <div
              className="blog-content text-foreground/70 text-xl max-mobile:text-lg leading-relaxed font-light space-y-8 first-letter:text-7xl first-letter:font-serif first-letter:text-gold first-letter:mr-4 first-letter:float-left"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>

          <footer className="mt-32 max-medium-mobile:mt-24 pt-16 border-t border-border">
            <div className="bg-muted/5 p-16 max-small-tablet:px-6 border-l-4 border-gold relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-4xl font-serif font-bold mb-6 tracking-tight">
                  Enjoyed this insight?
                </h3>
                <p className="text-foreground/50 text-lg mb-10 max-w-2xl font-light leading-relaxed">
                  Ugo Peters regularly shares strategic frameworks and market
                  analysis focused on the African economic landscape. Subscribe
                  to stay updated on new perspectives.
                </p>
                <form onSubmit={onSubscribe} noValidate className="max-w-2xl">
                  <div className="flex max-mobile:flex-col gap-4">
                    <input
                      type="email"
                      placeholder="Your executive email address"
                      {...register("email")}
                      className="grow bg-background border border-border px-6 py-4 focus:border-gold outline-none transition-all text-xl font-serif"
                    />
                    <button
                      type="submit"
                      disabled={subscribe.isPending}
                      className="bg-gold text-black px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all whitespace-nowrap shadow-xl shadow-gold/10 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {subscribe.isPending ? "Subscribing…" : "Subscribe"}
                    </button>
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm font-medium mt-3">
                      {errors.email.message}
                    </p>
                  )}
                </form>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-gold/10 transition-all duration-700" />
            </div>
          </footer>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <section className="pb-32 max-tablet:pb-20 px-12 max-mobile:px-4 bg-muted/5 pt-24 max-tablet:pt-16 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between gap-6 mb-16 max-mobile:mb-10">
              <div>
                <span className="text-gold uppercase text-xs tracking-[.3rem] font-bold mb-4 block">
                  Keep Reading
                </span>
                <h2 className="text-5xl max-mobile:text-4xl font-serif font-bold tracking-tight">
                  More Insights
                </h2>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-3 text-gold uppercase tracking-widest text-[10px] font-bold border-b border-gold/30 pb-1 hover:border-gold transition-all whitespace-nowrap max-mobile:hidden"
              >
                View All <LuArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-10 max-small-tablet:grid-cols-1 max-small-tablet:gap-8">
              {relatedPosts.map((related, idx) => (
                <motion.article
                  key={related.id}
                  title={related.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="group flex flex-col"
                >
                  <Link
                    to={`/blog/${related.slug}`}
                    className="relative aspect-video overflow-hidden border border-border mb-6 block"
                  >
                    <img
                      src={related.image}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className="flex items-center gap-4 mb-3 text-foreground/40 text-[10px] uppercase tracking-widest font-bold">
                    <span className="text-gold">{related.category}</span>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span className="flex items-center gap-2">
                      <LuClock size={12} /> {related.readTime}
                    </span>
                  </div>
                  <Link to={`/blog/${related.slug}`}>
                    <h3 className="text-2xl font-serif font-bold group-hover:text-gold transition-colors tracking-tight leading-tight line-clamp-2">
                      {related.title}
                    </h3>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
export default BlogDetail;
