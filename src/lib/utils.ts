import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Indian currency (INR).
 * e.g. 7500000 → "₹75 Lakh"
 */
export function formatPrice(amount: number): string {
  if (amount >= 10_000_000) {
    return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  }
  if (amount >= 100_000) {
    return `₹${(amount / 100_000).toFixed(2)} Lakh`;
  }
  if (amount >= 1_000) {
    return `₹${(amount / 1_000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Convert a number to Indian word format.
 * e.g. 7500000 → "75 Lakh"
 */
export function priceInWords(amount: number): string {
  if (amount >= 10_000_000) {
    const cr = amount / 10_000_000;
    return `${cr % 1 === 0 ? cr : cr.toFixed(2)} Crore`;
  }
  if (amount >= 100_000) {
    const lakh = amount / 100_000;
    return `${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
  }
  if (amount >= 1_000) {
    const k = amount / 1_000;
    return `${k % 1 === 0 ? k : k.toFixed(1)} Thousand`;
  }
  return amount.toString();
}

/**
 * Format a date string or Date object.
 * e.g. "2024-01-15" → "15 Jan 2024"
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }
): string {
  return new Date(date).toLocaleDateString("en-IN", options);
}

/** Truncate text to a max length with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/** Generate a URL-safe slug from a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
