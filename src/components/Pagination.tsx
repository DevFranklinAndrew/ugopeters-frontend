import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { cn } from "../lib/utils";

interface PaginationProps {
  /** Current page (1-based). */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

/**
 * Compact numbered pagination used across the admin tables. Renders nothing
 * when there's a single page.
 */
const Pagination = ({ page, totalPages, onChange, className }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        title="Previous page"
        className="w-10 h-10 flex items-center justify-center border border-border text-foreground/50 hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground/50"
      >
        <LuChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={cn(
            "w-10 h-10 flex items-center justify-center border font-bold text-sm transition-all",
            n === page
              ? "bg-gold text-black border-gold"
              : "border-border text-foreground/50 hover:border-gold hover:text-gold",
          )}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        title="Next page"
        className="w-10 h-10 flex items-center justify-center border border-border text-foreground/50 hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground/50"
      >
        <LuChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
