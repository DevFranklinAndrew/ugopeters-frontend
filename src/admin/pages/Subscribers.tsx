import { useMemo, useState } from "react";
import { LuSearch, LuTrash2, LuDownload, LuCopy, LuCheck } from "react-icons/lu";
import { motion } from "motion/react";
import {
  useAdminSubscribers,
  useDeleteSubscriber,
} from "../../hooks/useSubscribers";
import { useConfirm } from "../../context/ConfirmContext";
import Select from "../../components/Select";
import Pagination from "../../components/Pagination";

const PER_PAGE = 10;

const PERIOD_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const Subscribers = () => {
  const { data: subscribers = [], isPending, isError } = useAdminSubscribers();
  const del = useDeleteSubscriber();
  const confirm = useConfirm();
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("all");
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(1);
  // Reference "now" captured once (lazy init keeps it out of render purity).
  const [now] = useState(() => Date.now());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const withinPeriod = (iso: string) => {
      if (period === "all") return true;
      const days = Number(period);
      return now - +new Date(iso) <= days * 86_400_000;
    };
    return [...subscribers]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .filter(
        (s) =>
          withinPeriod(s.createdAt) &&
          (!q || s.email.toLowerCase().includes(q)),
      );
  }, [subscribers, query, period, now]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const handleQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const handlePeriod = (value: string) => {
    setPeriod(value);
    setPage(1);
  };

  const exportCsv = () => {
    const rows = [
      ["email", "subscribed_at"],
      ...subscribers.map((s) => [s.email, s.createdAt]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(
      subscribers.map((s) => s.email).join(", "),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (id: string, email: string) => {
    const ok = await confirm({
      title: "Remove subscriber",
      description: `${email} will be removed from the newsletter list.`,
      confirmText: "Remove",
      tone: "danger",
    });
    if (ok) del.mutate(id);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex items-end justify-between mb-12 max-mobile:flex-col max-mobile:items-start max-mobile:gap-6">
        <div>
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 block">
            Newsletter
          </span>
          <h1 className="text-5xl max-mobile:text-4xl font-serif font-bold tracking-tight">
            Subscribers
          </h1>
          <p className="text-foreground/50 mt-2 font-light">
            {subscribers.length} email{subscribers.length !== 1 && "s"} on the
            list.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={copyAll}
            className="inline-flex items-center gap-2 px-5 py-3 border border-border font-bold uppercase tracking-widest text-xs hover:border-gold hover:text-gold transition-all"
          >
            {copied ? <LuCheck size={16} /> : <LuCopy size={16} />}
            {copied ? "Copied" : "Copy all"}
          </button>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all shadow-lg shadow-gold/10"
          >
            <LuDownload size={16} /> Export CSV
          </button>
        </div>
      </header>

      {/* Search + filter */}
      <div className="flex items-end gap-6 mb-8 max-mobile:flex-col max-mobile:items-stretch max-mobile:gap-4">
        <div className="flex items-center gap-3 border-b border-border focus-within:border-gold transition-colors flex-1 max-w-md">
          <LuSearch size={18} className="text-foreground/40" />
          <input
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Search emails..."
            className="w-full bg-transparent py-3 focus:outline-none font-serif text-lg"
          />
        </div>
        <div className="flex flex-col gap-1 max-mobile:w-full">
          <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
            Subscribed
          </label>
          <Select
            value={period}
            onChange={handlePeriod}
            ariaLabel="Filter by period"
            className="min-w-48 max-mobile:w-full"
            options={PERIOD_OPTIONS}
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-card border border-border divide-y divide-border">
        {isPending && (
          <p className="px-6 py-12 text-center text-foreground/40 font-light">
            Loading subscribers…
          </p>
        )}
        {isError && !isPending && (
          <p className="px-6 py-12 text-center text-red-500/80 font-light">
            Couldn't load subscribers.
          </p>
        )}
        {!isPending && !isError && filtered.length === 0 && (
          <p className="px-6 py-12 text-center text-foreground/40 font-light">
            No subscribers found.
          </p>
        )}
        {paginated.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
            className="flex items-center gap-6 px-6 py-4 hover:bg-muted/5 transition-colors"
          >
            <div className="w-10 h-10 shrink-0 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-serif font-bold uppercase">
              {s.email[0]}
            </div>
            <a
              href={`mailto:${s.email}`}
              className="flex-1 min-w-0 truncate font-serif text-lg hover:text-gold transition-colors"
            >
              {s.email}
            </a>
            <span className="text-[10px] uppercase tracking-widest text-foreground/30 shrink-0 max-mobile:hidden">
              {formatDate(s.createdAt)}
            </span>
            <button
              onClick={() => handleDelete(s.id, s.email)}
              title="Remove"
              className="w-10 h-10 flex items-center justify-center border border-border text-foreground/50 hover:border-red-500 hover:text-red-500 transition-all shrink-0"
            >
              <LuTrash2 size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 mt-8 max-mobile:flex-col">
          <p className="text-foreground/40 text-sm font-light">
            Showing {(currentPage - 1) * PER_PAGE + 1}–
            {Math.min(currentPage * PER_PAGE, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default Subscribers;
