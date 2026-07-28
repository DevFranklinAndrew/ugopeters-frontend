import {
  LuFileText,
  LuMail,
  LuUsers,
  LuStar,
  LuArrowRight,
  LuPlus,
} from "react-icons/lu";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useAdminData } from "../context/AdminDataContext";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const Overview = () => {
  const { posts, messages, subscribers } = useAdminData();

  const unread = messages.filter((m) => !m.read).length;
  const featuredCount = posts.filter((p) => p.featured).length;

  const stats = [
    {
      label: "Blog Posts",
      value: posts.length,
      icon: LuFileText,
      to: "/admin/posts",
      hint: `${featuredCount} featured`,
    },
    {
      label: "Messages",
      value: messages.length,
      icon: LuMail,
      to: "/admin/messages",
      hint: `${unread} unread`,
    },
    {
      label: "Subscribers",
      value: subscribers.length,
      icon: LuUsers,
      to: "/admin/subscribers",
      hint: "newsletter list",
    },
    {
      label: "Featured",
      value: featuredCount,
      icon: LuStar,
      to: "/admin/posts",
      hint: "on homepage / blog",
    },
  ];

  const recentMessages = [...messages]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="max-w-6xl">
      <header className="flex items-end justify-between mb-12 max-mobile:flex-col max-mobile:items-start max-mobile:gap-6">
        <div>
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 block">
            Dashboard
          </span>
          <h1 className="text-5xl max-mobile:text-4xl font-serif font-bold tracking-tight">
            Overview
          </h1>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-3 px-6 py-3 bg-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all shadow-lg shadow-gold/10"
        >
          <LuPlus size={16} /> New Post
        </Link>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-4 max-tablet:grid-cols-2 max-small-mobile:grid-cols-1 gap-6 mb-16">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              to={stat.to}
              className="block bg-card border border-border p-8 hover:border-gold/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                  <stat.icon size={20} />
                </div>
                <LuArrowRight
                  size={18}
                  className="text-foreground/20 group-hover:text-gold group-hover:translate-x-1 transition-all"
                />
              </div>
              <p className="text-5xl font-serif font-bold mb-1">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest font-bold text-foreground/60">
                {stat.label}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-foreground/30 mt-2">
                {stat.hint}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent messages */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold">Recent Messages</h2>
          <Link
            to="/admin/messages"
            className="text-gold uppercase tracking-widest text-[10px] font-bold border-b border-gold/30 pb-1 hover:border-gold transition-all"
          >
            View all
          </Link>
        </div>
        <div className="bg-card border border-border divide-y divide-border">
          {recentMessages.map((m) => (
            <Link
              key={m.id}
              to={`/admin/messages?msg=${m.id}`}
              className="flex items-center gap-6 px-6 py-5 hover:bg-muted/5 transition-colors max-mobile:flex-col max-mobile:items-start max-mobile:gap-2"
            >
              {!m.read && (
                <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-serif text-lg truncate">{m.subject}</p>
                <p className="text-foreground/40 text-sm truncate">
                  {m.name} · {m.reason}
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-foreground/30 shrink-0">
                {formatDate(m.createdAt)}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Overview;
