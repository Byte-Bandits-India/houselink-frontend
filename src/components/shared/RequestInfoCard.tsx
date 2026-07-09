"use client";

import { Tag } from "lucide-react";
import { Button } from "../ui/button";

interface RequestInfoCardProps {
  priceFormatted: string;
  categoryName: string;
  ownerType: string;
  property: any;
  compact?: boolean;
}

export default function RequestInfoCard({
  priceFormatted,
  categoryName,
  ownerType,
}: RequestInfoCardProps) {
  const handleEnquireClick = () => {
    const el = document.getElementById("enquiry-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs text-left min-w-[240px]">
      {/* Header: Title + Price */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-bold text-gray-900 text-sm">Request Info</h3>
        <span className="font-black text-gray-900 text-base leading-none whitespace-nowrap">
          {priceFormatted}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="flex items-center gap-1 text-[11px] text-gray-600 font-semibold">
          <Tag size={11} className="text-gray-400 stroke-[2.5px]" />
          {categoryName}
        </span>
        <span className="text-[11px] text-[#163D75] font-bold">{ownerType}</span>
      </div>

      {/* Button — scrolls to the enquiry form below */}
      <Button
        type="button"
        variant="gradient"
        onClick={handleEnquireClick}
        className="w-full font-extrabold text-sm py-2.5 px-4 rounded-xl shadow transition-all duration-200 active:scale-[0.98] cursor-pointer text-center"
      >
        Enquire About the Property
      </Button>
    </div>
  );
}
