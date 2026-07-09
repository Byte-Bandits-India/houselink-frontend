"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { usePageFilter } from "@/contexts/HomeFilterContext";
import { getStates, getCities } from "@/lib/api";
import PropertyTypeSwitch from "./PropertyTypeSwitch";
import TypewriterTitle from "@/components/ui/TypewriterTitle";

export default function PropertiesSearchHeader() {
  const { filters, setFilters } = usePageFilter();

  const [localCity, setLocalCity] = useState(filters.city);
  const [localKeyword, setLocalKeyword] = useState(filters.keyword);
  const [localActiveTab, setLocalActiveTab] = useState(filters.activeTab);
  const [citiesList, setCitiesList] = useState<{ value: string; label: string }[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Load cities list dynamically from API on mount
  useEffect(() => {
    async function loadBackendCities() {
      try {
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
        console.error("Failed to load cities from backend, using default list:", e);
      }
    }
    loadBackendCities();
  }, []);

  // Sync with context changes (e.g., if filtered from sidebar)
  useEffect(() => {
    setLocalCity(filters.city);
    setLocalKeyword(filters.keyword);
    setLocalActiveTab(filters.activeTab);
  }, [filters.city, filters.keyword, filters.activeTab]);

  const handleSearchCommit = () => {
    setFilters({
      ...filters,
      city: localCity,
      keyword: localKeyword,
      activeTab: localActiveTab,
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

  return (
    <div className="w-full bg-gradient-to-r from-primary to-secondary py-5 px-4 md:px-8 shadow-md">
      <div className="container mx-auto flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-4 md:gap-6">
        
        {/* City Select Column */}
        <div className="flex flex-col w-full lg:w-auto min-w-[160px] text-left">
          <label className="text-[11px] uppercase font-bold text-white/70 mb-1.5 tracking-wider">
            City
          </label>
          <div className="relative bg-white rounded-full h-11 px-4 flex items-center shadow-sm border border-transparent focus-within:border-white/20">
            <select
              value={localCity}
              onChange={(e) => setLocalCity(e.target.value)}
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
        <div className="flex flex-col w-full lg:flex-1 text-left">
          <label className="text-[11px] uppercase font-bold text-white/70 mb-1.5 tracking-wider">
            Keyword, Location, Property Name
          </label>
          <div className="relative bg-white rounded-full h-11 px-5 flex items-center shadow-sm w-full">
            <Search size={16} className="text-gray-400 mr-2.5 flex-shrink-0" />
            <div className="relative flex-1 h-full flex items-center">
              <input
                type="text"
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
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
          </div>
        </div>

        {/* Row Container for Property Type Toggle & Search Button */}
        <div className="flex flex-row items-end gap-3 w-full lg:w-auto">
          {/* Property Type Toggle Column */}
          <div className="flex flex-col flex-1 text-left min-w-0">
            <label className="text-[11px] uppercase font-bold text-white/70 mb-1.5 tracking-wider truncate">
              Choose the Property Type
            </label>
            <PropertyTypeSwitch
              activeTab={localActiveTab}
              onChange={handleToggleTab}
              variant="header"
            />
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
    </div>
  );
}
