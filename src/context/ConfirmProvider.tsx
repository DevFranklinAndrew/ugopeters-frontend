import { useCallback, useRef, useState, type ReactNode } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  ConfirmContext,
  type ConfirmFn,
  type ConfirmOptions,
} from "./ConfirmContext";

/**
 * Provides the imperative `useConfirm()` API, backed by a single themed
 * <ConfirmDialog>. Mount once near the app root. UI state only — this is the
 * kind of state React Context is reserved for (alongside ThemeContext).
 */
export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolverRef = useRef<(value: boolean) => void>(() => {});

  const confirm = useCallback<ConfirmFn>((opts = {}) => {
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  // `options` is intentionally kept after closing so the exit animation still
  // renders its last content.
  const close = (result: boolean) => {
    setOpen(false);
    resolverRef.current(result);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        open={open}
        title={options.title ?? "Are you sure?"}
        description={options.description}
        confirmText={options.confirmText ?? "Confirm"}
        cancelText={options.cancelText ?? "Cancel"}
        tone={options.tone ?? "default"}
        onConfirm={() => close(true)}
        onCancel={() => close(false)}
      />
    </ConfirmContext.Provider>
  );
};
