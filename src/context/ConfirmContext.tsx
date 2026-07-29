import { createContext, useContext, type ReactNode } from "react";
import type { ConfirmTone } from "../components/ConfirmDialog";

export interface ConfirmOptions {
  title?: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
}

export type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>;

export const ConfirmContext = createContext<ConfirmFn | undefined>(undefined);

/**
 * Returns an imperative `confirm(options) => Promise<boolean>` — a drop-in,
 * accessible replacement for `window.confirm`. Backed by a single dialog from
 * <ConfirmProvider>, which must be mounted above the caller.
 */
export const useConfirm = (): ConfirmFn => {
  const ctx = useContext(ConfirmContext);
  if (!ctx)
    throw new Error("useConfirm must be used within a ConfirmProvider");
  return ctx;
};
