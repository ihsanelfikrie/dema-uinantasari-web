import { format } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Formats a date string, object, or number into Indonesian date format (e.g. '14 Juli 2026')
 */
export function formatTanggal(date: Date | string | number): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return "-";
    }
    return format(d, "d MMMM yyyy", { locale: id });
  } catch {
    return "-";
  }
}

/**
 * Converts a string into a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}
