"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Search, SlidersHorizontal, X, MapPin, Building, Sparkles, Tag as TagIcon } from "lucide-react";
import { usePageFilter } from "@/contexts/HomeFilterContext";
import {
  getStates,
  getCities,
  getPopularRegions,
  getPropertyCategories,
  getFeatures,
  getFacilities,
} from "@/lib/api";
import TypewriterTitle from "@/components/ui/TypewriterTitle";
import { AnimatePresence, motion } from "framer-motion";
import SearchSuggestions from "@/components/shared/SearchSuggestions";
import SearchFilterModal from "@/components/shared/SearchFilterModal";
import type { SearchTag } from "@/types/components";

function parseKeywordToFilters(
  keyword: string,
  currentFilters: any,
  knownRegions: string[],
  categories: any[],
  features: any[],
  facilities: any[],
) {
  const updates: any = {};
  if (!keyword) return updates;
  const lower = keyword.toLowerCase();

  // 1. Purpose
  if (
    lower.includes("rent") ||
    lower.includes("lease") ||
    lower.includes("rental") ||
    lower.includes("renting")
  ) {
    updates.activeTab = "rent";
  } else if (
    lower.includes("sale") ||
    lower.includes("sell") ||
    lower.includes("selling") ||
    lower.includes("buy") ||
    lower.includes("purchase")
  ) {
    updates.activeTab = "sell";
  }

  // 2. Category (dynamic from API)
  for (const cat of categories) {
    const name = cat.name.toLowerCase();
    let isMatched = false;
    let val = name;

    if (
      name.includes("apartment") &&
      (lower.includes("apartment") || lower.includes("flat"))
    ) {
      isMatched = true;
      val = "apartments";
    } else if (name.includes("villa") && lower.includes("villa")) {
      isMatched = true;
      val = "villas";
    } else if (
      name.includes("house") &&
      (lower.includes("house") || lower.includes("home"))
    ) {
      isMatched = true;
      val = "house";
    } else if (
      (name.includes("plot") || name.includes("land")) &&
      (lower.includes("plot") || lower.includes("land"))
    ) {
      isMatched = true;
      val = "plots";
    } else if (
      name.includes("commercial") &&
      (lower.includes("commercial") ||
        lower.includes("shop") ||
        lower.includes("office") ||
        lower.includes("warehouse") ||
        lower.includes("godown"))
    ) {
      isMatched = true;
      val = "commercial";
    } else if (lower.includes(name)) {
      isMatched = true;
      if (name === "individual house") val = "house";
    }

    if (isMatched) {
      updates.activeCategory = val;
      break;
    }
  }

  // 3. House Type
  if (lower.includes("1 bhk") || lower.includes("1bhk"))
    updates.houseType = "1 BHK";
  else if (lower.includes("2 bhk") || lower.includes("2bhk"))
    updates.houseType = "2 BHK";
  else if (lower.includes("3 bhk") || lower.includes("3bhk"))
    updates.houseType = "3 BHK";
  else if (lower.includes("4 bhk") || lower.includes("4bhk"))
    updates.houseType = "4 BHK";
  else if (
    lower.includes("5 bhk") ||
    lower.includes("5bhk") ||
    lower.includes("5+ bhk") ||
    lower.includes("5+bhk")
  )
    updates.houseType = "5+ BHK";
  else if (lower.includes("1 rk") || lower.includes("1rk"))
    updates.houseType = "1 RK";

  // 4. Location / Region (dynamic from API)
  for (const reg of knownRegions) {
    const regLower = reg.toLowerCase();
    if (lower.includes(regLower)) {
      updates.location = reg;
      break;
    }
  }

  // 5. Amenities (dynamic features & facilities from API)
  const activeAmenitiesList = currentFilters.amenities
    ? currentFilters.amenities.split(",")
    : [];
  let updatedAmenities = [...activeAmenitiesList];
  const allDbAmenities = [...features, ...facilities];

  for (const item of allDbAmenities) {
    const nameLower = item.name.toLowerCase();
    const isMatched =
      lower.includes(nameLower) ||
      (nameLower.includes("swimming pool") &&
        (lower.includes("pool") || lower.includes("swim"))) ||
      (nameLower.includes("internet") && lower.includes("wifi")) ||
      (nameLower.includes("ac") && lower.includes("air cond")) ||
      (nameLower.includes("security") && lower.includes("guard"));

    if (isMatched) {
      if (!updatedAmenities.includes(nameLower)) {
        updatedAmenities.push(nameLower);
      }
    }
  }

  if (updatedAmenities.length > activeAmenitiesList.length) {
    updates.amenities = updatedAmenities.join(",");
  }

  return updates;
}

export default function PropertiesSearchHeader() {
  const { filters, setFilters } = usePageFilter();

  const [localCity, setLocalCity] = useState(filters.city || "");
  const [localKeyword, setLocalKeyword] = useState(filters.keyword || "");
  const [localActiveTab, setLocalActiveTab] = useState(filters.activeTab || "sell");
  const [citiesList, setCitiesList] = useState<
    { value: string; label: string }[]
  >([]);
  const [popularRegionsList, setPopularRegionsList] = useState<string[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbFeatures, setDbFeatures] = useState<any[]>([]);
  const [dbFacilities, setDbFacilities] = useState<any[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTags, setSearchTags] = useState<SearchTag[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load backend filter metadata dynamically on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        Promise.all([
          getPopularRegions().catch(() => []),
          getPropertyCategories({ for: filters.activeTab || "sell" })
            .then((res) => (res?.success ? res.data : []))
            .catch(() => []),
          getFeatures()
            .then((res) => (res?.success ? res.data : []))
            .catch(() => []),
          getFacilities()
            .then((res) => (res?.success ? res.data : []))
            .catch(() => []),
        ]).then(([regions, categories, features, facilities]) => {
          if (Array.isArray(regions))
            setPopularRegionsList(regions.map((r) => r.name));
          setDbCategories(categories || []);
          setDbFeatures(features || []);
          setDbFacilities(facilities || []);
        });

        const statesRes = await getStates();
        if (statesRes.success && statesRes.data) {
          const tamilNadu = statesRes.data.find((s) =>
            s.name.toLowerCase().includes("tamil nadu"),
          );
          const tnId = tamilNadu?.id;
          if (tnId) {
            const citiesRes = await getCities(tnId);
            if (citiesRes.success && citiesRes.data) {
              const list = citiesRes.data.map((c) => ({
                value: c.name.toLowerCase(),
                label: c.name,
              }));
              if (list.length > 0) {
                setCitiesList(list);
              }
            }
          }
        }
      } catch (e) {
        console.error("Failed to load cities/regions from backend:", e);
      }
    }
    loadBackendData();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsInputFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debounceKeywordTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with context changes (e.g., if filtered from sidebar)
  useEffect(() => {
    setLocalCity(filters.city || "");
    setLocalKeyword(filters.keyword || "");
    setLocalActiveTab(filters.activeTab || "sell");
  }, [filters.city, filters.keyword, filters.activeTab]);

  // Compute all active search tags dynamically from context filters + custom user tags
  const activeTags: SearchTag[] = useMemo(() => {
    const list: SearchTag[] = [];

    // 1. Location tags (split comma-separated)
    if (filters.location) {
      const locs = filters.location
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      for (const loc of locs) {
        list.push({
          id: `loc-${loc.toLowerCase()}`,
          label: loc,
          type: "location",
          value: loc,
        });
      }
    }

    // 2. Category tags (split comma-separated)
    if (filters.activeCategory && filters.activeCategory !== "all") {
      const cats = filters.activeCategory
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s && s.toLowerCase() !== "all");
      for (const cat of cats) {
        const catObj = dbCategories.find(
          (c) =>
            c.name.toLowerCase() === cat.toLowerCase() ||
            c.id.toString() === cat,
        );
        const label = catObj
          ? catObj.name
          : cat.charAt(0).toUpperCase() + cat.slice(1);
        list.push({
          id: `cat-${cat.toLowerCase()}`,
          label: label,
          type: "category",
          value: cat,
        });
      }
    }
    // 4. House Type tag
    if (filters.houseType) {
      list.push({
        id: `type-${filters.houseType.toLowerCase()}`,
        label: filters.houseType,
        type: "keyword",
        value: filters.houseType,
      });
    }

    // 5. Amenities tags
    if (filters.amenities) {
      const split = filters.amenities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      for (const item of split) {
        list.push({
          id: `amenity-${item.toLowerCase()}`,
          label: item.charAt(0).toUpperCase() + item.slice(1),
          type: "amenity",
          value: item,
        });
      }
    }

    // 6. User Custom Tags
    for (const st of searchTags) {
      if (
        !list.some(
          (existing) =>
            existing.type === st.type &&
            existing.value.toLowerCase() === st.value.toLowerCase(),
        )
      ) {
        list.push(st);
      }
    }

    return list;
  }, [filters, dbCategories, citiesList, searchTags]);

  const handleAddTag = (tag: SearchTag) => {
    setSearchTags((prev) => {
      const exists = prev.some(
        (t) =>
          t.type === tag.type &&
          t.value.toLowerCase() === tag.value.toLowerCase(),
      );
      if (exists) return prev;
      return [...prev, tag];
    });

    // Also update filter context accordingly (stacking tags)
    const nextFilters = { ...filters };
    if (tag.type === "location") {
      const current = nextFilters.location
        ? nextFilters.location
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      if (!current.some((l) => l.toLowerCase() === tag.value.toLowerCase())) {
        nextFilters.location = [...current, tag.value].join(",");
      }
    } else if (tag.type === "category") {
      const current =
        nextFilters.activeCategory && nextFilters.activeCategory !== "all"
          ? nextFilters.activeCategory
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
      if (!current.some((c) => c.toLowerCase() === tag.value.toLowerCase())) {
        nextFilters.activeCategory = [...current, tag.value].join(",");
      }
    } else if (tag.type === "amenity") {
      const current = nextFilters.amenities
        ? nextFilters.amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      if (!current.some((a) => a.toLowerCase() === tag.value.toLowerCase())) {
        nextFilters.amenities = [...current, tag.value.toLowerCase()].join(",");
      }
    } else if (tag.type === "keyword" && tag.id.startsWith("type-")) {
      nextFilters.houseType = tag.value;
    }

    setFilters(nextFilters);
    setLocalKeyword("");
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tagId: string) => {
    const tag = activeTags.find((t) => t.id === tagId);
    setSearchTags((prev) => prev.filter((t) => t.id !== tagId));

    if (!tag) return;

    const nextFilters = { ...filters };
    if (tag.type === "location") {
      const current = nextFilters.location
        ? nextFilters.location
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      nextFilters.location = current
        .filter((l) => l.toLowerCase() !== tag.value.toLowerCase())
        .join(",");
      if (nextFilters.keyword === tag.value) nextFilters.keyword = "";
    } else if (tag.type === "category") {
      const current =
        nextFilters.activeCategory && nextFilters.activeCategory !== "all"
          ? nextFilters.activeCategory
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
      const updated = current.filter(
        (c) => c.toLowerCase() !== tag.value.toLowerCase(),
      );
    } else if (tag.type === "amenity") {
      const current = nextFilters.amenities
        ? nextFilters.amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      nextFilters.amenities = current
        .filter((a) => a.toLowerCase() !== tag.value.toLowerCase())
        .join(",");
    } else if (tag.id.startsWith("type-")) {
      nextFilters.houseType = "";
    }

    setFilters(nextFilters);
  };

  const handleClearTags = () => {
    setSearchTags([]);
    setLocalKeyword("");
    setFilters({
      ...filters,
      keyword: "",
      location: "",
      activeCategory: "all",
      amenities: "",
      houseType: "",
    });
  };

  // Debounced search commit as user types
  useEffect(() => {
    if (debounceKeywordTimerRef.current) {
      clearTimeout(debounceKeywordTimerRef.current);
    }

    // Only debounce update if localKeyword is non-empty and differs from current committed filters.keyword
    if (localKeyword.trim() && localKeyword !== filters.keyword) {
      debounceKeywordTimerRef.current = setTimeout(() => {
        const parsed = parseKeywordToFilters(
          localKeyword,
          filters,
          popularRegionsList,
          dbCategories,
          dbFeatures,
          dbFacilities,
        );
        setFilters({
          ...filters,
          city: localCity,
          keyword: localKeyword,
          activeTab: localActiveTab,
          ...parsed,
        });
      }, 400);
    }

    return () => {
      if (debounceKeywordTimerRef.current) {
        clearTimeout(debounceKeywordTimerRef.current);
      }
    };
  }, [
    localKeyword,
    localCity,
    localActiveTab,
    popularRegionsList,
    dbCategories,
    dbFeatures,
    dbFacilities,
  ]);

  const handleSearchCommit = () => {
    if (debounceKeywordTimerRef.current) {
      clearTimeout(debounceKeywordTimerRef.current);
    }
    const locTags = activeTags
      .filter((t) => t.type === "location")
      .map((t) => t.value);
    const catTags = activeTags
      .filter((t) => t.type === "category")
      .map((t) => t.value);
    const cityTags = activeTags
      .filter((t) => t.type === "city")
      .map((t) => t.value);
    const purposeTag = activeTags.find((t) => t.type === "purpose")?.value as
      | "sell"
      | "rent"
      | undefined;
    const amenityTags = activeTags
      .filter((t) => t.type === "amenity")
      .map((t) => t.value);
    const kwTags = activeTags
      .filter((t) => t.type === "keyword" && !t.id.startsWith("type-"))
      .map((t) => t.value);

    const fullKw = [localKeyword.trim(), ...kwTags].filter(Boolean).join(" ");

    const parsed = parseKeywordToFilters(
      fullKw,
      filters,
      popularRegionsList,
      dbCategories,
      dbFeatures,
      dbFacilities,
    );

    setFilters({
      ...filters,
      city: cityTags.length > 0 ? cityTags.join(",") : (localCity || ""),
      keyword: fullKw || "",
      location:
        locTags.length > 0 ? locTags.join(",") : (filters.location || ""),
      activeCategory:
        catTags.length > 0
          ? catTags.join(",")
          : (filters.activeCategory || "all"),
      activeTab: purposeTag || localActiveTab || "sell",
      amenities:
        amenityTags.length > 0
          ? amenityTags.join(",")
          : (filters.amenities || ""),
      ...parsed,
    });
    setIsInputFocused(false);
  };

  const handleClearKeyword = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (debounceKeywordTimerRef.current) {
      clearTimeout(debounceKeywordTimerRef.current);
    }
    setLocalKeyword("");
    setSearchTags([]);
    setFilters({
      ...filters,
      keyword: "",
      location: "",
    });
  };

  const handleToggleTab = (tab: "sell" | "rent") => {
    setLocalActiveTab(tab);
    // Auto-commit tab toggle to instantly update search results
    setFilters({
      ...filters,
      activeTab: tab,
    });
  };

  const handleFilterModalSearch = (overrides?: {
    keyword?: string;
    location?: string;
    category?: string;
    city?: string;
    amenities?: string[];
    fromModal?: boolean;
    property_purpose?: "sell" | "rent";
    min_price?: string;
    max_price?: string;
    max_area?: string;
    house_type?: string;
  }) => {
    const nextFilters = { ...filters };
    if (overrides) {
      if (overrides.location) {
        nextFilters.location = overrides.location;
        nextFilters.keyword = overrides.keyword || "";
        setLocalKeyword(overrides.keyword || "");
      } else if (overrides.keyword !== undefined) {
        nextFilters.keyword = overrides.keyword;
        setLocalKeyword(overrides.keyword);
      }
      if (overrides.category !== undefined) {
        nextFilters.activeCategory = overrides.category;
      }
      if (overrides.city !== undefined) {
        nextFilters.city = overrides.city.toLowerCase();
        setLocalCity(overrides.city.toLowerCase());
      }
      if (overrides.property_purpose !== undefined) {
        nextFilters.activeTab = overrides.property_purpose;
        setLocalActiveTab(overrides.property_purpose);
      }
      if (overrides.min_price !== undefined) {
        nextFilters.minPrice = overrides.min_price;
      }
      if (overrides.max_price !== undefined) {
        nextFilters.maxPrice = overrides.max_price;
      }
      if (overrides.max_area !== undefined) {
        nextFilters.maxArea = overrides.max_area;
      }
      if (overrides.house_type !== undefined) {
        nextFilters.houseType = overrides.house_type;
      }
      if (Array.isArray(overrides.amenities)) {
        nextFilters.amenities = overrides.amenities.join(",");
      }
    }
    setFilters(nextFilters);
  };

  return (
    <div className="w-full bg-gradient-to-r from-primary to-secondary py-5 px-4 md:px-8 shadow-md">
      <div className="container mx-auto flex flex-col lg:flex-row items-stretch px-6 lg:items-end justify-between gap-4 md:gap-6">
        {/* City Select Column */}
        <div className="flex flex-col w-full lg:w-auto min-w-[160px] text-left">
          <label className="text-[11px] uppercase font-bold text-white/70 mb-1.5 tracking-wider">
            City
          </label>
          <div className="relative bg-white rounded-full h-12 px-4 flex items-center shadow-sm border border-transparent focus-within:border-white/20">
            <select
              value={localCity || ""}
              onChange={(e) => {
                const val = e.target.value;
                setLocalCity(val);
                setFilters({
                  ...filters,
                  city: val,
                });
              }}
              className="w-full appearance-none bg-transparent border-none outline-none text-sm text-gray-800 font-bold pr-6 cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap"
            >
              <option value="">Chennai</option>
              {citiesList
                .filter((o) => o.value !== "chennai")
                .map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
            </select>
            <ChevronDown
              size={15}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none stroke-[2.5px]"
            />
          </div>
        </div>

        {/* Keyword Search Column */}
        <div
          ref={containerRef}
          className="flex flex-col w-full lg:flex-1 text-left relative z-20"
        >
          <label className="text-[11px] uppercase font-bold text-white/70 mb-1.5 tracking-wider">
            Keyword, Location, Property Name
          </label>
          <div
            onClick={() => {
              setIsInputFocused(true);
              inputRef.current?.focus();
            }}
            className="relative bg-white rounded-full h-12 pl-4 sm:pl-5 pr-1.5 flex items-center shadow-sm w-full cursor-text"
          >
            <Search size={16} className="text-gray-400 mr-2.5 flex-shrink-0" />
            <div className="relative flex-1 h-full flex items-center gap-1.5 min-w-0 flex-wrap overflow-hidden py-1">
              {/* Inline Search Tags */}
              {activeTags.map((tag) => (
                <span
                  key={tag.id}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-2xs shrink-0 select-none z-10 ${
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

              <input
                ref={inputRef}
                type="text"
                value={localKeyword || ""}
                onChange={(e) => setLocalKeyword(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchCommit();
                  } else if (
                    e.key === "Backspace" &&
                    localKeyword === "" &&
                    activeTags.length > 0
                  ) {
                    const lastTag = activeTags[activeTags.length - 1];
                    if (lastTag) handleRemoveTag(lastTag.id);
                  }
                }}
                className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-sm text-gray-800 font-medium py-1 z-10"
              />

              {!isInputFocused && !localKeyword && activeTags.length === 0 && (
                <div className="absolute inset-0 pointer-events-none flex items-center text-left">
                  <TypewriterTitle
                    sequences={[
                      {
                        text: "Premium 4 BHK Luxury Apartments in Manapakkam...",
                        deleteAfter: true,
                      },
                      {
                        text: "2 BHK Independent House in Adyar...",
                        deleteAfter: true,
                      },
                      { text: "Plots in Porur for sale...", deleteAfter: true },
                      { text: "Villas in ECR for rent...", deleteAfter: true },
                    ]}
                    className="p-0 m-0 w-full"
                    textClassName="flex items-center gap-0.5 text-sm text-gray-400/90 font-medium whitespace-nowrap overflow-hidden"
                    cursorClassName="inline-block h-[1.2em] w-[1.5px] bg-gray-400"
                    contentClassName="relative z-10 w-full flex flex-col items-start justify-start text-left"
                    typingSpeed={60}
                    deleteSpeed={30}
                    pauseBeforeDelete={2000}
                    loopDelay={1500}
                  />
                </div>
              )}
            </div>

            {/* Clear Search Button */}
            {(localKeyword || activeTags.length > 0) && (
              <button
                type="button"
                onClick={handleClearKeyword}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer mr-1 z-10 flex-shrink-0"
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={15} className="stroke-[2.5px]" />
              </button>
            )}

            {/* Filter Modal Trigger Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsInputFocused(false);
                setIsFilterModalOpen(true);
              }}
              className="h-9 px-3.5 rounded-full border border-gray-200 text-gray-700 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer mr-1.5 z-10"
              title="Open Advanced Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline text-xs font-bold text-gray-700">
                Filter
              </span>
            </button>

            {/* Search Property Gradient Button */}
            <button
              type="button"
              onClick={handleSearchCommit}
              className="h-9 px-5 sm:px-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:brightness-105 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap z-10 flex-shrink-0 shadow-sm"
            >
              <Search size={14} className="stroke-[2.5px] hidden sm:inline" />
              <span>Search Property</span>
            </button>
          </div>

          {/* Search Suggestions Dropdown Overlay */}
          <AnimatePresence>
            {isInputFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.99 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-3 bg-white rounded-2xl p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-150 z-50 overflow-y-auto max-h-[460px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
              >
                <SearchSuggestions
                  query={localKeyword}
                  tags={activeTags}
                  city={filters.city}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                  onClearTags={handleClearTags}
                  onSelectKeyword={(kw) => {
                    handleAddTag({
                      id: `kw-${kw.toLowerCase()}`,
                      label: kw,
                      type: "keyword",
                      value: kw,
                    });
                  }}
                  onSelectLocation={(loc) => {
                    handleAddTag({
                      id: `loc-${loc.toLowerCase()}`,
                      label: loc,
                      type: "location",
                      value: loc,
                    });
                  }}
                  onSelectCategory={(cat) => {
                    const catObj =
                      dbCategories.find(
                        (c) => c.name.toLowerCase() === cat.toLowerCase(),
                      ) ||
                      dbCategories.find((c) =>
                        c.name.toLowerCase().includes(cat.toLowerCase()),
                      );
                    const catLabel = catObj
                      ? catObj.name
                      : cat.charAt(0).toUpperCase() + cat.slice(1);
                    handleAddTag({
                      id: `cat-${cat.toLowerCase()}`,
                      label: catLabel,
                      type: "category",
                      value: cat,
                    });
                  }}
                  onSelectCity={(cityVal) => {
                    const normalized = cityVal.toLowerCase();
                    setLocalCity(normalized);
                    setFilters({
                      ...filters,
                      city: normalized,
                    });
                    setIsInputFocused(false);
                  }}
                  onSelectAmenity={(amenityVal) => {
                    handleAddTag({
                      id: `amenity-${amenityVal.toLowerCase()}`,
                      label: amenityVal,
                      type: "amenity",
                      value: amenityVal,
                    });
                  }}
                  selectedAmenities={
                    filters.amenities ? filters.amenities.split(",") : []
                  }
                  onSearch={(overrides) => {
                    const nextFilters = { ...filters };
                    if (overrides) {
                      if (overrides.location !== undefined) {
                        nextFilters.location = overrides.location;
                      }
                      if (overrides.category !== undefined) {
                        nextFilters.activeCategory = overrides.category;
                      }
                      if (overrides.city !== undefined) {
                        nextFilters.city = overrides.city.toLowerCase();
                        setLocalCity(overrides.city.toLowerCase());
                      }
                      if (overrides.property_purpose !== undefined) {
                        nextFilters.activeTab = overrides.property_purpose;
                        setLocalActiveTab(overrides.property_purpose);
                      }
                      if (overrides.max_price !== undefined) {
                        nextFilters.maxPrice = overrides.max_price;
                      }
                      if (overrides.max_area !== undefined) {
                        nextFilters.maxArea = overrides.max_area;
                      }
                      if (overrides.house_type !== undefined) {
                        nextFilters.houseType = overrides.house_type;
                      }
                      if (Array.isArray(overrides.amenities)) {
                        nextFilters.amenities = overrides.amenities.join(",");
                      }
                      if (overrides.keyword !== undefined) {
                        nextFilters.keyword = overrides.keyword;
                        setLocalKeyword(overrides.keyword);
                      } else {
                        nextFilters.keyword = "";
                        setLocalKeyword("");
                      }
                    }
                    setFilters(nextFilters);
                    setIsInputFocused(false);
                  }}
                  onClose={() => setIsInputFocused(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Property Type Toggle Column */}
        <div className="flex flex-col w-full lg:w-auto text-left min-w-0">
          <label className="text-[11px] uppercase font-bold text-white/70 mb-1.5 tracking-wider truncate">
            Property For
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleToggleTab("sell")}
              className={`rounded-full h-12 px-6 sm:px-8 text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                localActiveTab === "sell"
                  ? "bg-[#DCE5F1] text-primary border border-primary"
                  : "bg-white text-black border border-transparent hover:bg-white/95"
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => handleToggleTab("rent")}
              className={`rounded-full h-12 px-6 sm:px-8 text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                localActiveTab === "rent"
                  ? "bg-[#DCE5F1] text-primary border border-primary"
                  : "bg-white text-black border border-transparent hover:bg-white/95"
              }`}
            >
              Rent / Lease
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Tags Row below inputs */}
      {activeTags.length > 0 && (
        <div className="container mx-auto px-6 mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 mr-1 flex items-center gap-1">
            <Sparkles size={12} className="text-white/90" />
            Active Filters ({activeTags.length}):
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {activeTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-800 shadow-sm border border-white/40 transition-all"
              >
                {tag.type === "location" && (
                  <MapPin size={12} className="text-blue-600 stroke-[2.5px]" />
                )}
                {tag.type === "category" && (
                  <Building
                    size={12}
                    className="text-purple-600 stroke-[2.5px]"
                  />
                )}
                {tag.type === "amenity" && (
                  <Sparkles
                    size={12}
                    className="text-emerald-600 stroke-[2.5px]"
                  />
                )}
                {tag.type === "city" && (
                  <MapPin
                    size={12}
                    className="text-amber-600 stroke-[2.5px]"
                  />
                )}
                {tag.type === "purpose" && (
                  <TagIcon size={12} className="text-rose-600 stroke-[2.5px]" />
                )}
                <span>{tag.label}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="hover:bg-gray-100 hover:text-red-600 rounded-full p-0.5 ml-0.5 cursor-pointer text-gray-400 transition-colors"
                  title="Remove filter"
                >
                  <X size={12} className="stroke-[2.5px]" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={handleClearTags}
              className="text-xs font-bold text-white/90 hover:text-white underline underline-offset-2 ml-1 cursor-pointer transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Advanced Filter Modal */}
      <SearchFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialPurpose={localActiveTab}
        initialKeyword={localKeyword}
        initialLocation={filters.location || localKeyword}
        onSearch={handleFilterModalSearch}
      />
    </div>
  );
}
