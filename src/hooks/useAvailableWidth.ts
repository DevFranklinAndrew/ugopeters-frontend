import { useEffect, useState, type RefObject } from "react";

/**
 * Live width available to `ref` inside its parent, minus whatever its siblings
 * already occupy.
 *
 * Observes the parent rather than the element itself: the element sits in
 * shrink-to-fit contexts (a centred flex column, a justify-between row), so its
 * own width is a function of its content — measuring it would feed the next
 * render back into the measurement.
 */
export const useAvailableWidth = (
  ref: RefObject<HTMLElement | null>,
): number => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!parent) return;

    // ResizeObserver fires once on observe, which seeds the first measurement
    // without a setState in this effect body.
    const observer = new ResizeObserver(() => {
      const own = el.getBoundingClientRect();

      const taken = Array.from(parent.children)
        .filter((child) => child !== el)
        .reduce((sum, child) => {
          const rect = child.getBoundingClientRect();
          // Only siblings sharing a line compete for horizontal space. In a
          // stacked column they sit above or below and take none — subtracting
          // them there would badly understate the room available.
          const sharesLine = rect.top < own.bottom && rect.bottom > own.top;
          return sharesLine ? sum + rect.width : sum;
        }, 0);

      setWidth(Math.max(0, parent.clientWidth - taken));
    });

    observer.observe(parent);
    return () => observer.disconnect();
  }, [ref]);

  return width;
};
