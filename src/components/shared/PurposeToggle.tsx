"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { PurposeToggleProps } from "@/types/components";

export default function PurposeToggle({
  value,
  onChange,
  sellLabel = "Sell",
  rentLabel = "Rent/Lease",
}: PurposeToggleProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onChange("sell")}
        className={cn(
          "px-6 py-2 rounded-[50px] text-sm font-bold border transition-colors duration-200",
          value === "sell"
            ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent"
            : "bg-white border-gray-300 text-ink hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:border-transparent"
        )}
      >
        {sellLabel}
      </Button>
      <Button
        onClick={() => onChange("rent")}
        className={cn(
          "px-6 py-2 rounded-[50px] text-sm font-bold border transition-colors duration-200",
          value === "rent"
            ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent"
            : "bg-white border-gray-300 text-ink hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:border-transparent"
        )}
      >
        {rentLabel}
      </Button>
    </div>
  );
}
