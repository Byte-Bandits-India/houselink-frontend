import React from "react";
import { cn } from "@/lib/utils";

/**
 * Convert a numeric value (number or string) into Indian English words.
 * e.g. 2500000 → "Twenty Five Lakh Rupees"
 */
export function convertNumberToWords(
  num: number | string | null | undefined,
  suffix = "Rupees"
): string {
  if (num === null || num === undefined || num === "") return "";
  const cleanStr = typeof num === "string" ? num.replace(/[^0-9]/g, "") : String(num);
  const value = parseInt(cleanStr, 10);
  if (isNaN(value) || value <= 0) return "";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function helper(n: number): string {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + helper(n % 100) : "");
  }

  let temp = value;
  let str = "";

  const crore = Math.floor(temp / 10000000);
  temp %= 10000000;

  const lakh = Math.floor(temp / 100000);
  temp %= 100000;

  const thousand = Math.floor(temp / 1000);
  temp %= 1000;

  if (crore > 0) {
    str += helper(crore) + " Crore ";
  }
  if (lakh > 0) {
    str += helper(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    str += helper(thousand) + " Thousand ";
  }
  if (temp > 0) {
    str += helper(temp);
  }

  const trimmed = str.trim();
  if (!trimmed) return "";
  return suffix ? `${trimmed} ${suffix}`.trim() : trimmed;
}

/**
 * Format a numeric value into compact Indian currency representation.
 * e.g. 5000000 → "₹50 Lakh", 15000000 → "₹1.5 Cr", 50000 → "₹50 K"
 */
export function formatPriceCompact(
  val: string | number | null | undefined
): string {
  if (val === null || val === undefined || val === "") return "";
  const cleanStr = typeof val === "string" ? val.replace(/[^0-9]/g, "") : String(val);
  const num = parseInt(cleanStr, 10);
  if (isNaN(num) || num <= 0) return "";

  if (num >= 10000000) {
    const cr = num / 10000000;
    return `₹${cr % 1 === 0 ? cr : Number(cr.toFixed(2))} Cr`;
  }
  if (num >= 100000) {
    const lakh = num / 100000;
    return `₹${lakh % 1 === 0 ? lakh : Number(lakh.toFixed(2))} Lakh`;
  }
  if (num >= 1000) {
    const k = num / 1000;
    return `₹${k % 1 === 0 ? k : Number(k.toFixed(1))} K`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

export interface PriceInWordsProps {
  amount?: number | string | null;
  variant?: "full" | "compact" | "badge";
  className?: string;
  prefix?: string;
  suffix?: string;
}

/**
 * Reusable component to render price amount into Indian English text or formatted badges.
 */
export default function PriceInWords({
  amount,
  variant = "full",
  className,
  prefix = "",
  suffix = "Rupees",
}: PriceInWordsProps) {
  if (amount === null || amount === undefined || amount === "") return null;

  if (variant === "compact") {
    const formatted = formatPriceCompact(amount);
    if (!formatted) return null;
    return <span className={className}>{prefix}{formatted}</span>;
  }

  if (variant === "badge") {
    const formatted = formatPriceCompact(amount);
    if (!formatted) return null;
    return (
      <span
        className={cn(
          "text-[11px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full animate-in fade-in duration-150 select-none",
          className
        )}
      >
        {prefix}{formatted}
      </span>
    );
  }

  const words = convertNumberToWords(amount, suffix);
  if (!words) return null;

  return (
    <p
      className={cn(
        "text-[11px] text-primary/85 font-medium px-1 italic leading-tight select-none",
        className
      )}
    >
      {prefix}{words}
    </p>
  );
}

export { PriceInWords as ConvertNumberToWords };
