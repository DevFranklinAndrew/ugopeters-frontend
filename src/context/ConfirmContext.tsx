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

/** An accessible, awaitable stand-in for `window.confirm`. */
export const useConfirm = (): ConfirmFn => {
  const ctx = useContext(ConfirmContext);
  if (!ctx)
    throw new Error("useConfirm must be used within a ConfirmProvider");
  return ctx;
};
