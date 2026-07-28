import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms of no
 * changes. Used to keep the blog search box from firing an API request on every
 * keystroke.
 */
export const useDebouncedValue = <T>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
