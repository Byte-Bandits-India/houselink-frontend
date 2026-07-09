"use client";

import { Search, Send } from "lucide-react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import SearchSuggestions from "@/components/shared/SearchSuggestions";

interface ActionSearchBarProps {
  keyword: string;
  setKeyword: (val: string) => void;
  placeholderText: string;
  onSearch: () => void;
  onSelectLocation: (location: string) => void;
  setActiveCategory?: (category: string) => void;
  setCity?: (city: string) => void;
  setShowAdvanced?: (val: boolean) => void;
  setSelectedAmenities?: React.Dispatch<React.SetStateAction<string[]>>;
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
  setSelectedAmenities,
}: ActionSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto z-30">
      <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-150 p-1 md:p-1.5 pl-4 md:pl-6 w-full relative focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
        {/* Dynamic transition icon on the left */}
        <div className="w-6 h-6 mr-1 md:mr-2 flex items-center justify-center flex-shrink-0 relative">
          <AnimatePresence mode="popLayout">
            {keyword.trim().length > 0 ? (
              <motion.div
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 15, opacity: 0, scale: 0.8 }}
                initial={{ y: -15, opacity: 0, scale: 0.8 }}
                key="send"
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <Send className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] text-primary" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 15, opacity: 0, scale: 0.8 }}
                initial={{ y: -15, opacity: 0, scale: 0.8 }}
                key="search"
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <Search className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] text-gray-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholderText}
          onFocus={() => setIsFocused(true)}
          className="w-full bg-transparent border-none outline-none text-sm md:text-base text-gray-800 placeholder:text-gray-400 py-2 md:py-2.5"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
              setIsFocused(false);
            }
          }}
        />

        {/* Search button */}
        <Button
          variant="gradient"
          onClick={() => {
            onSearch();
            setIsFocused(false);
          }}
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
              onSelectKeyword={(kw) => setKeyword(kw)}
              onSelectLocation={(loc) => onSelectLocation(loc)}
              onSelectCategory={(cat) => {
                if (setActiveCategory) setActiveCategory(cat);
              }}
              onSelectCity={(cityVal) => {
                if (setCity) setCity(cityVal);
              }}
              onSelectAmenity={(amenityVal) => {
                if (setShowAdvanced) setShowAdvanced(true);
                if (setSelectedAmenities) {
                  setSelectedAmenities((prev) =>
                    prev.includes(amenityVal) ? prev : [...prev, amenityVal]
                  );
                }
              }}
              onSearch={onSearch}
              onClose={() => setIsFocused(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
