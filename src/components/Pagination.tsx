import { LuChevronLeft, LuChevronRight, LuLoaderCircle } from "react-icons/lu";
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
  className?: string;
}

// Buttons shrink a step at the narrowest breakpoint so the row still fits.
const slotClass =
  "w-10 h-10 max-small-mobile:w-8 max-small-mobile:h-8 shrink-0 flex items-center justify-center border transition-all disabled:cursor-not-allowed";

const arrowClass = cn(
  slotClass,
  "border-border text-foreground/50 hover:border-gold hover:text-gold disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground/50",
);

/** Renders nothing when there's only one page. */
const Pagination = ({
  page,
  totalPages,
  onChange,
  disabled,
  loadingPage,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      // Bounded to 7 slots by pageItems, so this only ever scrolls on a very
      // narrow viewport — never the page itself.
      className={cn(
        "flex items-center gap-2 max-small-mobile:gap-1 max-w-full overflow-x-auto",
        className,
      )}
    >
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1 || disabled}
        title="Previous page"
        aria-label="Previous page"
        className={arrowClass}
      >
        <LuChevronLeft size={16} />
      </button>

      {pageItems(page, totalPages).map((item, i) =>
        item === "gap" ? (
          <span
            key={`gap-${i}`}
            aria-hidden="true"
            className="w-4 shrink-0 text-center text-foreground/30 font-bold"
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
              slotClass,
              "font-bold text-sm max-small-mobile:text-xs",
              item === page
                ? "bg-gold text-black border-gold"
                : "border-border text-foreground/50 hover:border-gold hover:text-gold disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground/50",
            )}
          >
            {loadingPage === item && item !== page ? (
              <LuLoaderCircle size={14} className="animate-spin" />
            ) : (
              item
            )}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages || disabled}
        title="Next page"
        aria-label="Next page"
        className={arrowClass}
      >
        <LuChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
