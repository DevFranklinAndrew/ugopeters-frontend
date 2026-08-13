import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query. useSyncExternalStore rather than
 * useState+useEffect, which would setState during the effect and trip
 * react-hooks/set-state-in-effect. Server snapshot is false.
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
};
