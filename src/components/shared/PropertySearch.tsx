"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All" },
  { id: "plots", name: "Plots" },
  { id: "apartments", name: "Apartments" },
  { id: "villas", name: "Villas" },
  { id: "house", name: "Individual House" },
  { id: "commercial", name: "Commercial Property" },
];

const cities = [
  { value: "chennai", label: "Chennai" },
  { value: "bangalore", label: "Bangalore" },
  { value: "mumbai", label: "Mumbai" },
  { value: "hyderabad", label: "Hyderabad" },
];

const propertyCategories = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
];

/* ── Reusable field wrapper ── */
function Field({
  label,
  divider = true,
  children,
  className,
}: {
  label: string;
  divider?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center px-4 py-2",
        divider && "border-r border-gray-200",
        className
      )}
    >
      <p className="text-[16px] font-medium text-black tracking-wide mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}

/* ── Native select styled to match ── */
function NativeSelect({
  options,
  placeholder,
}: {
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        defaultValue=""
        className="w-full appearance-none bg-transparent border-none outline-none text-sm text-gray-800 font-medium pr-5 cursor-pointer"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}

export default function PropertySearch() {
  const [activeTab, setActiveTab] = useState("sell");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="w-full max-w-[1240px] mx-auto mb-10 relative z-20 -mt-24">

      {/* ── Tabs ── */}
      <div className="flex justify-center">
        {[
          { key: "sell", label: "For Sale" },
          { key: "rent", label: "Rent / Lease" },
        ].map(({ key, label }, i) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "min-w-[130px] px-8 py-4 text-[15px] font-bold transition-all duration-200 backdrop-blur-lg",
              i === 0 ? "rounded-tl-xl" : "rounded-tr-xl",
              activeTab === key
                ? "bg-white text-[#153e75] shadow-[0_-2px_8px_rgba(0,0,0,0.06)]"
                : "bg-white/5 text-white hover:border-2 hover:border-white/50 hover:bg-white/20"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Search Card ── */}
      <div className="bg-white rounded-2xl rounded-tr-2xl shadow-[rgb(38,57,77)_0px_20px_30px_-10px] px-5 py-6">

        {/* Main form row */}
        <div className="flex flex-wrap items-stretch gap-y-2">

          {/* City */}
          <Field label="City" className="flex-[1_1_120px]">
            <NativeSelect options={cities} placeholder="Select City" />
          </Field>

          {/* Keyword */}
          <Field label="Keyword" className="flex-[1.5_1_160px]">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search for keyword"
              className="bg-transparent border-none outline-none text-base text-black placeholder:text-black font-medium py-0.5"
            />
          </Field>

          {/* Location */}
          <Field label="Location" className="flex-[2_1_200px]">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="bg-transparent border-none outline-none text-sm text-black placeholder:text-black font-medium py-0.5"
            />
          </Field>

          {/* Category */}
          <Field label="Category" divider={false} className="flex-[1.2_1_140px]">
            <NativeSelect options={propertyCategories} placeholder="Select Category" />
          </Field>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pl-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                "flex items-center gap-1.5 px-4 h-[42px] border rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap",
                showAdvanced
                  ? "border-[#153e75] text-[#153e75] bg-[#eaf0fb]"
                  : "border-gray-300 text-gray-600 bg-white hover:border-[#153e75] hover:text-[#153e75]"
              )}
            >
              <SlidersHorizontal size={14} />
              Advanced
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-6 h-[42px] bg-[#153e75] hover:bg-[#1a4d8f] text-white text-sm font-semibold rounded-lg shadow-[0_4px_12px_rgba(21,62,117,0.3)] transition-colors duration-200 whitespace-nowrap"
            >
              <Search size={14} />
              Search
            </button>
          </div>
        </div>

        {/* ── Advanced Filters ── */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5 mt-4 border-t border-gray-100">

            {/* Price Range */}
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">
                Price Range
              </p>
              <input
                type="range"
                min={0}
                max={10000000}
                className="w-full accent-[#153e75]"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>₹0</span>
                <span>₹1 Cr+</span>
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">
                Bedrooms
              </p>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#153e75] transition-colors">
                <option value="">All</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} Bedroom{n > 1 ? "s" : ""}
                  </option>
                ))}
                <option value="5+">5+ Bedrooms</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">
                Bathrooms
              </p>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#153e75] transition-colors">
                <option value="">All</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} Bathroom{n > 1 ? "s" : ""}
                  </option>
                ))}
                <option value="5+">5+ Bathrooms</option>
              </select>
            </div>

          </div>
        )}
      </div>

      {/* ── Category Nav ── */}
      <div className="flex justify-center gap-7 mt-9 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "pb-1.5 text-[15px] font-medium border-b-[2.5px] transition-all duration-200 whitespace-nowrap",
              activeCategory === cat.id
                ? "border-[#153e75] text-[#153e75] font-semibold"
                : "border-transparent text-gray-500 hover:text-[#153e75] hover:border-[#153e75]/30"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

    </div>
  );
}