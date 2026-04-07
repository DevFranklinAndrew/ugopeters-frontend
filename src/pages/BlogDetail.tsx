import { ArrowLeft, Calendar, Clock, Share2, User } from "lucide-react";
import { motion } from "motion/react";
import { Link, useParams } from "react-router";
import { posts } from "../data/post";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  if (!post)
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

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
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
              <ArrowLeft
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
            <h1 className="text-7xl max-tablet:text-6xl max-mobile:text-5xl max-small-mobile:text-4xl font-serif font-bold mb-12 max-small-tablet:mb-8 tracking-tight leading-[1.1]">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-12 max-mobile:gap-6 text-foreground/40 text-xs uppercase tracking-widest font-bold border-y border-border py-8 max-small-tablet:py-4">
              <div className="flex items-center gap-3">
                <User size={16} className="text-gold" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gold" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-gold" />
                <span>{post.readTime}</span>
              </div>
              <button className="flex items-center gap-3 hover:text-gold transition-colors ml-auto group">
                <Share2 size={16} />
                <span>Share Insight</span>
              </button>
            </div>
          </motion.header>
        </div>
      </section>
      {/* Featured Image */}
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
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
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
              className="text-foreground/70 text-xl max-mobile:text-lg leading-relaxed font-light space-y-8 first-letter:text-7xl first-letter:font-serif first-letter:text-gold first-letter:mr-4 first-letter:float-left"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>

          {/* Footer CTA */}
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
                <form className="flex max-mobile:flex-col gap-4 max-w-2xl">
                  <input
                    type="email"
                    placeholder="Your executive email address"
                    className="grow bg-background border border-border px-6 py-4 focus:border-gold outline-none transition-all text-xl font-serif"
                    required
                  />
                  <button className="bg-gold text-black px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all whitespace-nowrap shadow-xl shadow-gold/10">
                    Subscribe
                  </button>
                </form>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-gold/10 transition-all duration-700" />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
export default BlogDetail;
