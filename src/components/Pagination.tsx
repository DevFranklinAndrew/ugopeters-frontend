import { LuChevronLeft, LuChevronRight, LuLoaderCircle } from "react-icons/lu";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { pageItems } from "../lib/pagination";
import { cn } from "../lib/utils";

interface PaginationProps {
  /** Current page (1-based). */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** Blocks every control, e.g. mid-fetch so clicks can't stack up. */
  disabled?: boolean;
  /** Page being fetched; shows a spinner in its slot. */
  loadingPage?: number;
  /** `lg` is the public blog's larger, zero-padded treatment. */
  size?: "sm" | "lg";
  className?: string;
}

// Matches --breakpoint-small-mobile (30em) in index.css. Keep the two in sync.
const NARROW = "(max-width: 30em)";

const SIZES = {
  sm: {
    slot: "w-10 h-10 max-small-mobile:w-8 max-small-mobile:h-8",
    text: "font-bold text-sm max-small-mobile:text-xs",
    gap: "gap-2 max-small-mobile:gap-1",
    elision: "w-4",
    chevron: 16,
    spinner: 14,
  },
  lg: {
    slot: "w-12 h-12 max-small-mobile:w-9 max-small-mobile:h-9",
    text: "text-[10px] max-small-mobile:text-[9px] font-bold uppercase tracking-widest",
    gap: "gap-3 max-small-mobile:gap-1.5",
    elision: "w-6 max-small-mobile:w-4",
    chevron: 20,
    spinner: 14,
  },
} as const;

/** Renders nothing when there's only one page. */
const Pagination = ({
  page,
  totalPages,
  onChange,
  disabled,
  loadingPage,
  size = "sm",
  className,
}: PaginationProps) => {
  // The slot budget is what makes this responsive — shrinking the buttons
  // alone still left every number on screen.
  const maxSlots = useMediaQuery(NARROW) ? 5 : 7;

  if (totalPages <= 1) return null;

  const s = SIZES[size];
  const base = cn(s.slot, "shrink-0 flex items-center justify-center border transition-all disabled:cursor-not-allowed");
  const idle =
    "border-border text-foreground/50 hover:border-gold hover:text-gold disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground/50";
  const label = (n: number) => (size === "lg" ? n.toString().padStart(2, "0") : n);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center max-w-full overflow-x-auto", s.gap, className)}
    >
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1 || disabled}
        title="Previous page"
        aria-label="Previous page"
        className={cn(base, idle)}
      >
        <LuChevronLeft size={s.chevron} />
      </button>

      {pageItems(page, totalPages, maxSlots).map((item, i) =>
        item === "gap" ? (
          <span
            key={`gap-${i}`}
            aria-hidden="true"
            className={cn(s.elision, "shrink-0 text-center text-foreground/30 font-bold")}
          >
            ·
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            disabled={disabled}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              base,
              s.text,
              item === page ? "bg-gold text-black border-gold" : idle,
            )}
          >
            {loadingPage === item && item !== page ? (
              <LuLoaderCircle size={s.spinner} className="animate-spin" />
            ) : (
              label(item)
            )}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages || disabled}
        title="Next page"
        aria-label="Next page"
        className={cn(base, idle)}
      >
        <LuChevronRight size={s.chevron} />
      </button>
    </nav>
  );
};

export default Pagination;
