"use client";

import { Search, Send, SlidersHorizontal, X, MapPin, Building, Sparkles, Tag as TagIcon } from "lucide-react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import SearchSuggestions from "@/components/shared/SearchSuggestions";
import type { SearchTag } from "@/types/components";

interface ActionSearchBarProps {
  keyword: string;
  setKeyword: (val: string) => void;
  placeholderText: string;
  onSearch: (overrides?: {
    keyword?: string;
    location?: string;
    category?: string;
    city?: string;
    amenities?: string[];
    fromModal?: boolean;
    property_purpose?: "sell" | "rent";
    max_price?: string;
    max_area?: string;
    house_type?: string;
  }) => void;
  onSelectLocation: (location: string) => void;
  setActiveCategory?: (category: string) => void;
  setCity?: (city: string) => void;
  setShowAdvanced?: (val: boolean) => void;
  selectedAmenities?: string[];
  setSelectedAmenities?: React.Dispatch<React.SetStateAction<string[]>>;
  onOpenFilter?: () => void;
}

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, y: 15, scale: 0.98, height: 0 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      height: "auto",
      transition: {
        height: { duration: 0.35, ease: "easeOut" },
        staggerChildren: 0.04,
        delayChildren: 0.05,
        duration: 0.25,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: 15,
      scale: 0.98,
      height: 0,
      transition: {
        height: { duration: 0.25, ease: "easeIn" },
        opacity: { duration: 0.2 },
        duration: 0.2,
        ease: "easeIn",
      },
    },
  } as Variants,
};

export default function ActionSearchBar({
  keyword,
  setKeyword,
  placeholderText,
  onSearch,
  onSelectLocation,
  setActiveCategory,
  setCity,
  setShowAdvanced,
  selectedAmenities,
  setSelectedAmenities,
  onOpenFilter,
}: ActionSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTags, setSearchTags] = useState<SearchTag[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddTag = (tag: SearchTag) => {
    setSearchTags((prev) => {
      const filtered = prev.filter(
        (t) => !(t.type === tag.type && t.value.toLowerCase() === tag.value.toLowerCase())
      );
      return [...filtered, tag];
    });
    setKeyword("");
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tagId: string) => {
    setSearchTags((prev) => prev.filter((t) => t.id !== tagId));
  };

  const handleClearTags = () => {
    setSearchTags([]);
  };

  const handleCommitSearch = () => {
    setIsFocused(false);
    const locTags = searchTags
      .filter((t) => t.type === "location")
      .map((t) => t.value);
    const catTags = searchTags
      .filter((t) => t.type === "category")
      .map((t) => t.value);
    const cityTags = searchTags
      .filter((t) => t.type === "city")
      .map((t) => t.value);
    const purposeTag = searchTags.find((t) => t.type === "purpose")?.value as
      | "sell"
      | "rent"
      | undefined;
    const amenityTags = searchTags
      .filter((t) => t.type === "amenity")
      .map((t) => t.value);
    const kwTags = searchTags
      .filter((t) => t.type === "keyword")
      .map((t) => t.value);

    const fullKw = [keyword.trim(), ...kwTags].filter(Boolean).join(" ");

    onSearch({
      keyword: fullKw || undefined,
      location: locTags.length > 0 ? locTags.join(",") : undefined,
      category: catTags.length > 0 ? catTags.join(",") : undefined,
      city: cityTags.length > 0 ? cityTags.join(",") : undefined,
      property_purpose: purposeTag,
      amenities: amenityTags.length > 0 ? amenityTags : undefined,
    });
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto z-30">
      <div
        onClick={() => {
          setIsFocused(true);
          inputRef.current?.focus();
        }}
        className="flex items-center bg-white rounded-full shadow-lg border border-gray-150 p-1 md:p-1.5 pl-3.5 md:pl-5 w-full relative focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 cursor-text"
      >
        {/* Dynamic transition icon on the left */}
        <div className="w-5 h-5 mr-1.5 md:mr-2 flex items-center justify-center flex-shrink-0 relative pointer-events-none">
          <AnimatePresence mode="popLayout">
            {keyword.trim().length > 0 || searchTags.length > 0 ? (
              <motion.div
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 15, opacity: 0, scale: 0.8 }}
                initial={{ y: -15, opacity: 0, scale: 0.8 }}
                key="send"
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <Send className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] text-primary" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 15, opacity: 0, scale: 0.8 }}
                initial={{ y: -15, opacity: 0, scale: 0.8 }}
                key="search"
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <Search className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] text-gray-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Inline Tags container */}
        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0 py-1">
          {searchTags.map((tag) => (
            <span
              key={tag.id}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-2xs shrink-0 select-none ${
                tag.type === "location"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : tag.type === "category"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : tag.type === "amenity"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : tag.type === "city"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {tag.type === "location" && <MapPin size={10} />}
              {tag.type === "category" && <Building size={10} />}
              {tag.type === "amenity" && <Sparkles size={10} />}
              {tag.type === "purpose" && <TagIcon size={10} />}
              <span>{tag.label}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(tag.id);
                }}
                className="hover:opacity-75 rounded-full p-0.5 ml-0.5 cursor-pointer"
                title="Remove"
              >
                <X size={11} className="stroke-[2.5px]" />
              </button>
            </span>
          ))}

          {/* Input area */}
          <input
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={searchTags.length === 0 ? placeholderText : "Add keyword, location, or amenities..."}
            onFocus={() => setIsFocused(true)}
            className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm md:text-base text-gray-800 placeholder:text-gray-400 py-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCommitSearch();
              } else if (e.key === "Backspace" && keyword === "" && searchTags.length > 0) {
                setSearchTags((prev) => prev.slice(0, -1));
              }
            }}
          />
        </div>

        {/* Filter button */}
        {onOpenFilter && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenFilter();
            }}
            className="p-2 md:px-3.5 md:py-2 rounded-full border border-gray-200 text-gray-600 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-1.5 ml-1 flex-shrink-0 cursor-pointer"
            title="Open Filters"
          >
            <SlidersHorizontal className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            <span className="hidden lg:inline text-xs font-semibold">Filter</span>
          </button>
        )}

        {/* Search button */}
        <Button
          variant="gradient"
          onClick={handleCommitSearch}
          className="px-4 md:px-8 h-10 md:h-12 rounded-full font-bold text-sm md:text-base shadow-sm whitespace-nowrap ml-1 md:ml-2"
        >
          <span className="md:hidden">
            <Search size={18} />
          </span>
          <span className="hidden md:inline">Search</span>
        </Button>
      </div>

      {/* Action Suggestions Dropdown Overlay */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial="hidden"
            animate="show"
            exit="exit"
            variants={ANIMATION_VARIANTS.container}
            className="absolute left-0 right-0 top-full mt-3 bg-white rounded-2xl md:rounded-[32px] p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-150 z-50 overflow-y-auto max-h-[75vh] md:max-h-[480px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
          >
            <SearchSuggestions
              query={keyword}
              tags={searchTags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              onClearTags={handleClearTags}
              onSelectKeyword={(kw) => setKeyword(kw)}
              onSelectLocation={(loc) => onSelectLocation(loc)}
              onSelectCategory={(cat) => {
                setKeyword(cat.charAt(0).toUpperCase() + cat.slice(1));
                if (setActiveCategory) setActiveCategory(cat);
              }}
              onSelectCity={(cityVal) => {
                if (setCity) setCity(cityVal);
              }}
              onSelectAmenity={(amenityVal) => {
                setKeyword(amenityVal);
                if (setShowAdvanced) setShowAdvanced(true);
                if (setSelectedAmenities) {
                  setSelectedAmenities((prev) =>
                    prev.includes(amenityVal) ? prev : [...prev, amenityVal]
                  );
                }
              }}
              selectedAmenities={selectedAmenities}
              onSearch={(overrides) => {
                onSearch(overrides);
                setIsFocused(false);
              }}
              onClose={() => setIsFocused(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
