"use client";

import type { PropertyTypeSwitchProps } from "@/types/components";

export default function PropertyTypeSwitch({
  activeTab,
  onChange,
  variant = "header",
}: PropertyTypeSwitchProps) {
  if (variant === "sidebar") {
    return (
      <div className="flex bg-gray-50 border border-gray-200 rounded-full p-1 w-full items-center">
        <button
          type="button"
          onClick={() => onChange("sell")}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === "sell"
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <i className={`fi text-[12px] leading-none ${activeTab === "sell" ? "fi-ss-house-chimney text-white" : "fi-rr-house-chimney text-gray-600"}`}></i>
          <span>Buy</span>
        </button>
        <button
          type="button"
          onClick={() => onChange("rent")}
          className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === "rent"
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <i className={`fi text-[12px] leading-none ${activeTab === "rent" ? "fi-ss-house-chimney text-white" : "fi-rr-house-chimney text-gray-600"}`}></i>
          <span>Rent / Lease</span>
        </button>
      </div>
    );
  }

  // Header default variant
  return (
    <div className="flex bg-white rounded-full h-11 items-center w-full lg:min-w-[280px] border border-gray-150 shadow-sm">
      <button
        type="button"
        onClick={() => onChange("sell")}
        className={`flex-1 h-full flex items-center justify-center gap-2 text-sm font-bold rounded-full transition-all duration-200 cursor-pointer ${
          activeTab === "sell"
            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
            : "text-gray-700 hover:text-black hover:bg-gray-50/50"
        }`}
      >
        <i className={`fi text-[15px] leading-none ${activeTab === "sell" ? "fi-ss-house-chimney text-white" : "fi-rr-house-chimney text-gray-700"}`}></i>
        <span>Buy</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("rent")}
        className={`flex-1 h-full flex items-center justify-center gap-2 text-sm font-bold rounded-full transition-all duration-200 cursor-pointer ${
          activeTab === "rent"
            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
            : "text-gray-700 hover:text-black hover:bg-gray-50/50"
        }`}
      >
        <i className={`fi text-[15px] leading-none ${activeTab === "rent" ? "fi-ss-house-chimney text-white" : "fi-rr-house-chimney text-gray-700"}`}></i>
        <span>Rent / Lease</span>
      </button>
    </div>
  );
}
