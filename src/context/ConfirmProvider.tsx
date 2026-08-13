import { useCallback, useRef, useState, type ReactNode } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  ConfirmContext,
  type ConfirmFn,
  type ConfirmOptions,
} from "./ConfirmContext";

/** Backs `useConfirm()` with a single dialog. Mount once near the app root. */
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

  // `options` is deliberately left set, so the exit animation keeps its content.
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
