const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

/**
 * Swaps any gap that hides exactly one page for that page. A "·" standing in
 * for a single number is pure loss. Substitution is 1:1, so the slot budget is
 * unchanged.
 */
const closeLoneGaps = (items: (number | "gap")[]): (number | "gap")[] =>
  items.map((item, i) =>
    item === "gap" && (items[i + 1] as number) - (items[i - 1] as number) === 2
      ? (items[i - 1] as number) + 1
      : item,
  );

/**
 * Page numbers to render, windowed around the current page and capped at
 * `maxSlots` so the row can never outgrow its container. `"gap"` marks an
 * elision. Callers pass a smaller budget on narrow screens — the cap is what
 * makes the control responsive, not the button size.
 *
 * `maxSlots` must be odd and >= 5: the layout is first + gap + an odd centred
 * window + gap + last, so an even budget could not stay symmetrical.
 */
export const pageItems = (
  page: number,
  totalPages: number,
  maxSlots = 7,
): (number | "gap")[] => {
  if (totalPages <= maxSlots) return range(1, totalPages);

  const edge = maxSlots - 2; // first/last runs, which spend one slot on a gap
  const side = (maxSlots - 5) / 2; // neighbours either side in the middle case

  if (page <= maxSlots - 3) {
    return closeLoneGaps([...range(1, edge), "gap", totalPages]);
  }

  if (page >= totalPages - (maxSlots - 4)) {
    return closeLoneGaps([1, "gap", ...range(totalPages - edge + 1, totalPages)]);
  }

  return closeLoneGaps([
    1,
    "gap",
    ...range(page - side, page + side),
    "gap",
    totalPages,
  ]);
};
