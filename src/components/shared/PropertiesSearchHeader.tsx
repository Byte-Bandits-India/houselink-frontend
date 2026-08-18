"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { usePageFilter } from "@/contexts/HomeFilterContext";
import { getStates, getCities, getPopularRegions, getPropertyCategories, getFeatures, getFacilities } from "@/lib/api";
import TypewriterTitle from "@/components/ui/TypewriterTitle";
import { AnimatePresence, motion } from "framer-motion";
import SearchSuggestions from "@/components/shared/SearchSuggestions";
import SearchFilterModal from "@/components/shared/SearchFilterModal";

function parseKeywordToFilters(
  keyword: string, 
  currentFilters: any, 
  knownRegions: string[], 
  categories: any[], 
  features: any[], 
  facilities: any[]
) {
  const updates: any = {};
  if (!keyword) return updates;
  const lower = keyword.toLowerCase();

  // 1. Purpose
  if (lower.includes("rent") || lower.includes("lease") || lower.includes("rental") || lower.includes("renting")) {
    updates.activeTab = "rent";
  } else if (lower.includes("sale") || lower.includes("sell") || lower.includes("selling") || lower.includes("buy") || lower.includes("purchase")) {
    updates.activeTab = "sell";
  }

  // 2. Category (dynamic from API)
  for (const cat of categories) {
    const name = cat.name.toLowerCase();
    let isMatched = false;
    let val = name;

    if (name.includes("apartment") && (lower.includes("apartment") || lower.includes("flat"))) {
      isMatched = true;
      val = "apartments";
    } else if (name.includes("villa") && lower.includes("villa")) {
      isMatched = true;
      val = "villas";
    } else if (name.includes("house") && (lower.includes("house") || lower.includes("home"))) {
      isMatched = true;
      val = "house";
    } else if ((name.includes("plot") || name.includes("land")) && (lower.includes("plot") || lower.includes("land"))) {
      isMatched = true;
      val = "plots";
    } else if (name.includes("commercial") && (lower.includes("commercial") || lower.includes("shop") || lower.includes("office") || lower.includes("warehouse") || lower.includes("godown"))) {
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
  if (lower.includes("1 bhk") || lower.includes("1bhk")) updates.houseType = "1 BHK";
  else if (lower.includes("2 bhk") || lower.includes("2bhk")) updates.houseType = "2 BHK";
  else if (lower.includes("3 bhk") || lower.includes("3bhk")) updates.houseType = "3 BHK";
  else if (lower.includes("4 bhk") || lower.includes("4bhk")) updates.houseType = "4 BHK";
  else if (lower.includes("5 bhk") || lower.includes("5bhk") || lower.includes("5+ bhk") || lower.includes("5+bhk")) updates.houseType = "5+ BHK";
  else if (lower.includes("1 rk") || lower.includes("1rk")) updates.houseType = "1 RK";

  // 4. Location / Region (dynamic from API)
  for (const reg of knownRegions) {
    const regLower = reg.toLowerCase();
    if (lower.includes(regLower)) {
      updates.location = reg;
      break;
    }
  }

  // 5. Amenities (dynamic features & facilities from API)
  const activeAmenitiesList = currentFilters.amenities ? currentFilters.amenities.split(",") : [];
  let updatedAmenities = [...activeAmenitiesList];
  const allDbAmenities = [...features, ...facilities];

  for (const item of allDbAmenities) {
    const nameLower = item.name.toLowerCase();
    const isMatched = lower.includes(nameLower) ||
      (nameLower.includes("swimming pool") && (lower.includes("pool") || lower.includes("swim"))) ||
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

  const [localCity, setLocalCity] = useState(filters.city);
  const [localKeyword, setLocalKeyword] = useState(filters.keyword);
  const [localActiveTab, setLocalActiveTab] = useState(filters.activeTab);
  const [citiesList, setCitiesList] = useState<{ value: string; label: string }[]>([]);
  const [popularRegionsList, setPopularRegionsList] = useState<string[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbFeatures, setDbFeatures] = useState<any[]>([]);
  const [dbFacilities, setDbFacilities] = useState<any[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load backend filter metadata dynamically on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        Promise.all([
          getPopularRegions().catch(() => []),
          getPropertyCategories().then(res => res?.success ? res.data : []).catch(() => []),
          getFeatures().then(res => res?.success ? res.data : []).catch(() => []),
          getFacilities().then(res => res?.success ? res.data : []).catch(() => []),
        ]).then(([regions, categories, features, facilities]) => {
          if (Array.isArray(regions)) setPopularRegionsList(regions.map(r => r.name));
          setDbCategories(categories || []);
          setDbFeatures(features || []);
          setDbFacilities(facilities || []);
        });

        const statesRes = await getStates();
        if (statesRes.success && statesRes.data) {
          const tamilNadu = statesRes.data.find(s => s.name.toLowerCase().includes("tamil nadu"));
          const tnId = tamilNadu?.id;
          if (tnId) {
            const citiesRes = await getCities(tnId);
            if (citiesRes.success && citiesRes.data) {
              const list = citiesRes.data.map(c => ({
                value: c.name.toLowerCase(),
                label: c.name
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
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsInputFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync with context changes (e.g., if filtered from sidebar)
  useEffect(() => {
    setLocalCity(filters.city);
    setLocalKeyword(filters.keyword);
    setLocalActiveTab(filters.activeTab);
  }, [filters.city, filters.keyword, filters.activeTab]);

  const handleSearchCommit = () => {
    const parsed = parseKeywordToFilters(
      localKeyword, 
      filters, 
      popularRegionsList, 
      dbCategories, 
      dbFeatures, 
      dbFacilities
    );
    setFilters({
      ...filters,
      city: localCity,
      keyword: localKeyword,
      activeTab: localActiveTab,
      location: "", // Clear conflicting region location on manual search commit
      ...parsed,
    });
    setIsInputFocused(false);
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
    max_price?: string;
    max_area?: string;
    house_type?: string;
  }) => {
    const nextFilters = { ...filters };
    if (overrides) {
      if (overrides.location) {
        nextFilters.location = overrides.location;
        nextFilters.keyword = overrides.location;
        setLocalKeyword(overrides.location);
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
          <div className="relative bg-white rounded-full h-11 px-4 flex items-center shadow-sm border border-transparent focus-within:border-white/20">
            <select
              value={localCity}
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
              {citiesList.filter(o => o.value !== "chennai").map((o) => (
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
        <div ref={containerRef} className="flex flex-col w-full lg:flex-1 text-left relative z-20">
          <label className="text-[11px] uppercase font-bold text-white/70 mb-1.5 tracking-wider">
            Keyword, Location, Property Name
          </label>
          <div className="relative bg-white rounded-full h-11 px-4 sm:px-5 flex items-center shadow-sm w-full">
            <Search size={16} className="text-gray-400 mr-2.5 flex-shrink-0" />
            <div className="relative flex-1 h-full flex items-center">
              <input
                type="text"
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchCommit();
                }}
                className="w-full bg-transparent border-none outline-none text-sm text-gray-800 font-medium py-2 z-10"
              />
              
              {!isInputFocused && !localKeyword && (
                <div className="absolute inset-0 pointer-events-none flex items-center text-left">
                  <TypewriterTitle
                    sequences={[
                      { text: "Premium 4 BHK Luxury Apartments in Manapakkam...", deleteAfter: true },
                      { text: "2 BHK Independent House in Adyar...", deleteAfter: true },
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

            {/* Filter Modal Trigger Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsInputFocused(false);
                setIsFilterModalOpen(true);
              }}
              className="p-1.5 sm:px-3 sm:py-1 rounded-full border border-gray-200 text-gray-600 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ml-2 z-10"
              title="Open Advanced Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="hidden sm:inline text-xs font-bold text-gray-700">Filter</span>
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
                className="absolute left-0 right-0 top-full mt-3 bg-white rounded-2xl p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-150 z-50 overflow-y-auto max-h-[360px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
              >
                <SearchSuggestions
                  query={localKeyword}
                  onSelectKeyword={(kw) => {
                    setLocalKeyword(kw);
                    const parsed = parseKeywordToFilters(
                      kw, 
                      filters, 
                      popularRegionsList, 
                      dbCategories, 
                      dbFeatures, 
                      dbFacilities
                    );
                    setFilters({
                      ...filters,
                      keyword: kw,
                      location: "", // Clear conflicting region location
                      ...parsed,
                    });
                  }}
                  onSelectLocation={(loc) => {
                    setLocalKeyword(loc); // Show the chosen high demand region in the search text input
                    setFilters({
                      ...filters,
                      location: loc,
                      keyword: loc,
                    });
                  }}
                  onSelectCategory={(cat) => {
                    setFilters({
                      ...filters,
                      activeCategory: cat,
                    });
                  }}
                  onSelectCity={(cityVal) => {
                    setLocalCity(cityVal.toLowerCase());
                    setFilters({
                      ...filters,
                      city: cityVal.toLowerCase(),
                    });
                  }}
                  onSelectAmenity={(amenityVal) => {
                    const current = filters.amenities ? filters.amenities.split(",") : [];
                    const updated = current.includes(amenityVal.toLowerCase()) ? current : [...current, amenityVal.toLowerCase()];
                    setFilters({
                      ...filters,
                      amenities: updated.join(","),
                    });
                  }}
                  selectedAmenities={filters.amenities ? filters.amenities.split(",") : []}
                  onSearch={(overrides) => {
                    const nextFilters = { ...filters };
                    if (overrides) {
                      if (overrides.keyword !== undefined) {
                        nextFilters.keyword = overrides.keyword;
                        setLocalKeyword(overrides.keyword);
                        if (overrides.keyword) {
                          const parsed = parseKeywordToFilters(
                            overrides.keyword, 
                            nextFilters, 
                            popularRegionsList, 
                            dbCategories, 
                            dbFeatures, 
                            dbFacilities
                          );
                          Object.assign(nextFilters, parsed);
                        }
                      }
                      if (overrides.location !== undefined) {
                        nextFilters.location = overrides.location;
                        if (overrides.location) {
                          setLocalKeyword(overrides.location);
                          nextFilters.keyword = overrides.location;
                        }
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
                    }
                    setFilters(nextFilters);
                  }}
                  onClose={() => setIsInputFocused(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Row Container for Property Type Toggle & Search Button */}
        <div className="flex flex-row items-end gap-3 w-full lg:w-auto">
          {/* Property Type Toggle Column */}
          <div className="flex flex-col flex-1 text-left min-w-0">
            <label className="text-[11px] uppercase font-bold text-white/70 mb-1.5 tracking-wider truncate">
              Choose the Property Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleToggleTab("sell")}
                className={`rounded-full h-11 px-8 text-sm font-extrabold transition-all duration-200 cursor-pointer ${
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
                className={`rounded-full h-11 px-8 text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                  localActiveTab === "rent"
                    ? "bg-[#DCE5F1] text-primary border border-primary"
                    : "bg-white text-black border border-transparent hover:bg-white/95"
                }`}
              >
                Rent / Lease
              </button>
            </div>
          </div>

          {/* Search Action Column */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handleSearchCommit}
              className="bg-white hover:bg-white/95 text-primary font-extrabold text-xs sm:text-sm rounded-full h-11 px-4 sm:px-6 shadow-[0_4px_12px_rgba(255,255,255,0.15)] transition-all duration-200 active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              Search Property
            </button>
          </div>
        </div>

      </div>

      {/* Advanced Filter Modal */}
      <SearchFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialPurpose={localActiveTab}
        initialKeyword={localKeyword}
        onSearch={handleFilterModalSearch}
      />
    </div>
  );
}
