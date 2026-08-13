import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { LuTriangleAlert } from "react-icons/lu";
import { cn } from "../lib/utils";

export type ConfirmTone = "default" | "danger";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmText: string;
  cancelText: string;
  tone: ConfirmTone;
  onConfirm: () => void;
  onCancel: () => void;
}

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Usually driven through `useConfirm()` rather than rendered directly. */
const ConfirmDialog = ({
  open,
  title,
  description,
  confirmText,
  cancelText,
  tone,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Focus the (safe) cancel button so an accidental Enter doesn't confirm.
    const focusTimer = window.setTimeout(() => cancelRef.current?.focus(), 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const nodes = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
        );
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onCancel]);

  const isDanger = tone === "danger";

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onCancel}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card border border-border shadow-2xl shadow-black/20 p-8 max-mobile:p-6"
          >
            <div className="flex items-start gap-4">
              {isDanger && (
                <span className="shrink-0 w-11 h-11 flex items-center justify-center border border-red-500/30 bg-red-500/5 text-red-500">
                  <LuTriangleAlert size={22} />
                </span>
              )}
              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="text-2xl font-serif font-bold tracking-tight"
                >
                  {title}
                </h2>
                {description && (
                  <p
                    id={descId}
                    className="text-foreground/60 mt-2 font-light leading-relaxed"
                  >
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                ref={cancelRef}
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-border font-bold uppercase tracking-widest text-xs hover:border-gold hover:text-gold transition-all"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={cn(
                  "px-6 py-3 font-bold uppercase tracking-widest text-xs transition-all shadow-lg",
                  isDanger
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20"
                    : "bg-gold text-black hover:bg-gold-light shadow-gold/10",
                )}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ConfirmDialog;
