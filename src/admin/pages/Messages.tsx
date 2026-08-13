import { useEffect, useMemo, useState } from "react";
import { LuMail, LuTrash2, LuMailOpen, LuInbox } from "react-icons/lu";
import { LuArrowLeft } from "react-icons/lu";
import { motion } from "motion/react";
import { useSearchParams } from "react-router";
import {
  useAdminMessages,
  useDeleteMessage,
  useMarkMessageRead,
} from "../../hooks/useMessages";
import { useConfirm } from "../../context/ConfirmContext";
import { cn } from "../../lib/utils";
import Select from "../../components/Select";
import Pagination from "../../components/Pagination";

const PER_PAGE = 8;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const Messages = () => {
  const { data: messages = [], isPending, isError } = useAdminMessages();
  const markRead = useMarkMessageRead();
  const del = useDeleteMessage();
  const confirm = useConfirm();
  const [searchParams] = useSearchParams();
  // ?msg=<id> deep-links straight to a message, e.g. from the dashboard.
  const initialMsg = searchParams.get("msg");
  const [selectedId, setSelectedId] = useState<string | null>(() => initialMsg);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [reason, setReason] = useState("All");
  const [page, setPage] = useState(1);

  // Guarded on loaded-and-unread: otherwise this PATCHes redundantly, or 404s
  // on a stale id.
  useEffect(() => {
    if (!initialMsg) return;
    const msg = messages.find((m) => m.id === initialMsg);
    if (msg && !msg.read) markRead.mutate({ id: initialMsg, read: true });
  }, [initialMsg, messages, markRead]);

  const reasons = useMemo(
    () => ["All", ...[...new Set(messages.map((m) => m.reason))].sort()],
    [messages],
  );

  const visible = useMemo(() => {
    return [...messages]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .filter(
        (m) =>
          (filter === "all" || !m.read) &&
          (reason === "All" || m.reason === reason),
      );
  }, [messages, filter, reason]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = visible.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const handleFilter = (f: "all" | "unread") => {
    setFilter(f);
    setPage(1);
  };
  const handleReason = (value: string) => {
    setReason(value);
    setPage(1);
  };

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) markRead.mutate({ id, read: true });
    // On the stacked layout the detail replaces the list, so scroll it into view.
    if (window.matchMedia("(max-width: 62.5em)").matches) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete message",
      description: "This message will be permanently deleted.",
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    del.mutate(id);
    if (selectedId === id) setSelectedId(null);
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 block">
          Inbox
        </span>
        <h1 className="text-5xl max-mobile:text-4xl font-serif font-bold tracking-tight">
          Messages
        </h1>
        <p className="text-foreground/50 mt-2 font-light">
          {messages.length} total · {unread} unread
        </p>
      </header>

      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`px-5 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${
                filter === f
                  ? "bg-gold border-gold text-black"
                  : "border-border text-foreground/50 hover:border-gold/50 hover:text-gold"
              }`}
            >
              {f === "all" ? "All" : `Unread (${unread})`}
            </button>
          ))}
        </div>
        <div className="w-56 max-mobile:w-full">
          <Select
            value={reason}
            onChange={handleReason}
            ariaLabel="Filter by reason"
            options={reasons.map((r) => ({
              value: r,
              label: r === "All" ? "All reasons" : r,
            }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-[380px_1fr] max-tablet:grid-cols-1 gap-8 items-start">
        <div className={cn(selected && "max-tablet:hidden")}>
          <div className="bg-card border border-border divide-y divide-border max-h-[70vh] overflow-y-auto">
            {isPending && (
              <div className="px-6 py-16 text-center text-foreground/40">
                <p className="font-light">Loading messages…</p>
              </div>
            )}
            {isError && !isPending && (
              <div className="px-6 py-16 text-center text-red-500/80">
                <LuInbox size={32} className="mx-auto mb-4 opacity-50" />
                <p className="font-light">Couldn't load messages.</p>
              </div>
            )}
            {!isPending && !isError && visible.length === 0 && (
              <div className="px-6 py-16 text-center text-foreground/40">
                <LuInbox size={32} className="mx-auto mb-4 opacity-50" />
                <p className="font-light">No messages here.</p>
              </div>
            )}
            {paginated.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelect(m.id)}
                className={`w-full text-left px-6 py-5 transition-colors flex gap-3 ${
                  selectedId === m.id ? "bg-gold/5" : "hover:bg-muted/5"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    m.read ? "bg-transparent" : "bg-gold"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p
                      className={`truncate ${
                        m.read ? "font-normal" : "font-bold"
                      }`}
                    >
                      {m.name}
                    </p>
                    <span className="text-[10px] uppercase tracking-widest text-foreground/30 shrink-0">
                      {new Date(m.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-serif truncate">{m.subject}</p>
                  <p className="text-foreground/40 text-xs truncate mt-1">
                    {m.reason}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setPage}
            className="mt-6 justify-center"
          />
        </div>

        <div
          className={cn(
            "bg-card border border-border flex flex-col overflow-hidden tablet:sticky tablet:top-8 tablet:self-start tablet:max-h-[calc(100vh-4rem)] tablet:min-h-150",
            !selected && "max-tablet:hidden",
          )}
        >
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-24 px-8 text-foreground/40">
              <LuMail size={40} className="mb-4 opacity-50" />
              <p className="font-light">Select a message to read it.</p>
            </div>
          ) : (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col min-h-0 flex-1 overflow-hidden"
            >
              <button
                onClick={() => setSelectedId(null)}
                className="tablet:hidden flex items-center gap-2 px-6 pt-6 text-foreground/50 hover:text-gold transition-colors text-[10px] uppercase tracking-widest font-bold group shrink-0"
              >
                <LuArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Back to inbox
              </button>

              <div className="px-8 pt-6 pb-5 max-mobile:px-6 border-b border-border shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
                      {selected.reason}
                    </span>
                    <h2 className="text-2xl font-serif font-bold mt-1 wrap-break-word">
                      {selected.subject}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        markRead.mutate({
                          id: selected.id,
                          read: !selected.read,
                        })
                      }
                      title={selected.read ? "Mark unread" : "Mark read"}
                      className="w-10 h-10 flex items-center justify-center border border-border text-foreground/50 hover:border-gold hover:text-gold transition-all"
                    >
                      <LuMailOpen size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      title="Delete"
                      className="w-10 h-10 flex items-center justify-center border border-border text-foreground/50 hover:border-red-500 hover:text-red-500 transition-all"
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mt-4 text-sm">
                  <div>
                    <span className="text-foreground/40">From: </span>
                    <span className="font-medium">{selected.name}</span>
                  </div>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-gold hover:underline break-all"
                  >
                    {selected.email}
                  </a>
                  <span className="text-foreground/30 text-xs uppercase tracking-widest">
                    {formatDate(selected.createdAt)}
                  </span>
                </div>
              </div>

              <div className="p-8 max-mobile:px-6 overflow-y-auto grow min-h-0">
                <p className="text-foreground/70 text-lg leading-relaxed font-light whitespace-pre-wrap wrap-break-word">
                  {selected.message}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
