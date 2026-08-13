/**
 * Page numbers to render, windowed around the current page. Caps the row at 7
 * slots however many pages exist — rendering them all overflowed the viewport
 * on mobile. `"gap"` marks an elision.
 */
export const pageItems = (
  page: number,
  totalPages: number,
): (number | "gap")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (page <= 4) return [1, 2, 3, 4, 5, "gap", totalPages];
  if (page >= totalPages - 3) {
    return [1, "gap", ...[4, 3, 2, 1, 0].map((n) => totalPages - n)];
  }
  return [1, "gap", page - 1, page, page + 1, "gap", totalPages];
};
