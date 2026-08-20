"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, MapPin, Building, X, Home, Flame, Loader2 } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  getPopularProperties,
  getPopularRegions,
  getSearches,
  deleteSearchHistory,
  getSearchSuggestions,
} from "@/lib/api";
import type {
  PopularPropertyApiItem,
  PopularRegionApiItem,
  SearchApiItem,
  SearchSuggestionsData,
  SuggestionProperty,
  SuggestionLocation,
} from "@/lib/api";
import type { SearchSuggestionsProps } from "@/types/components";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const STATIC_CITIES = ["Chennai", "Bangalore", "Mumbai", "Hyderabad"];

export default function SearchSuggestions({
  query = "",
  onSelectKeyword,
  onSelectLocation,
  onSelectCategory,
  onSelectCity,
  onSelectAmenity,
  selectedAmenities,
  onSearch,
  onClose,
}: SearchSuggestionsProps) {
  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState<SearchApiItem[]>([]);
  const [popularProperties, setPopularProperties] = useState<
    PopularPropertyApiItem[]
  >([]);
  const [popularRegions, setPopularRegions] = useState<PopularRegionApiItem[]>(
    [],
  );

  // Dynamic server suggestions when user types
  const [serverSuggestions, setServerSuggestions] =
    useState<SearchSuggestionsData>({
      properties: [],
      locations: [],
      categories: [],
      features: [],
    });
  const [isFetching, setIsFetching] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load popular properties from API
    getPopularProperties()
      .then((res) => {
        if (res && Array.isArray(res)) setPopularProperties(res);
      })
      .catch((err) => console.error("Error loading popular properties:", err));

    // Load popular regions from API
    getPopularRegions()
      .then((res) => {
        if (res && Array.isArray(res)) setPopularRegions(res);
      })
      .catch((err) => console.error("Error loading popular regions:", err));

    // Load search history
    getSearches()
      .then((res) => {
        if (res.success && res.data && Array.isArray(res.data)) {
          const sorted = [...res.data].sort((a, b) => {
            const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            if (timeA !== timeB) return timeB - timeA;
            return b.id - a.id;
          });
          setRecentSearches(sorted);
        }
      })
      .catch((err) => {
        console.error("Error fetching searches:", err);
      });
  }, []);

  const cleanQ = query.trim();
  const isSearching = cleanQ.length > 0;
  const qLower = cleanQ.toLowerCase();

  // Debounced fetch for dynamic suggestions when typing
  useEffect(() => {
    if (!isSearching) {
      setServerSuggestions({
        properties: [],
        locations: [],
        categories: [],
        features: [],
      });
      setIsFetching(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsFetching(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const data = await getSearchSuggestions({ q: cleanQ });
        setServerSuggestions(data);
      } catch (err) {
        console.error("Error fetching dynamic suggestions:", err);
      } finally {
        setIsFetching(false);
      }
    }, 180);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [cleanQ, isSearching]);

  const handleRemoveItem = async (
    indexToRemove: number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const item = recentSearches[indexToRemove];
    if (item && item.id && item.id > 0) {
      try {
        await deleteSearchHistory(item.id);
      } catch (err) {
        console.error("Error deleting search history:", err);
      }
    }
    const updated = recentSearches.filter((_, i) => i !== indexToRemove);
    setRecentSearches(updated);
  };

  const handleScrollOrNavigate = (targetId: string) => {
    onClose();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/#${targetId}`);
    }
  };

  const handlePropertyClick = (
    property: SuggestionProperty | PopularPropertyApiItem,
  ) => {
    const permalink =
      (property as any).permalink || (property as any).property?.permalink;
    const name = (property as any).name || (property as any).title;

    if (permalink) {
      onClose();
      router.push(`/properties/${permalink}`);
    } else {
      onSelectKeyword(name);
      onSearch({ keyword: name });
      onClose();
    }
  };

  const handleRecentClick = (text: string) => {
    onSelectKeyword(text);
    onSearch({ keyword: text });
    onClose();
  };

  const handleRegionClick = (region: string) => {
    onSelectLocation(region);
    onSelectKeyword(region);
    onSearch({ location: region, keyword: region });
    onClose();
  };

  const handleCategoryClick = (catVal: string, catLabel?: string) => {
    if (onSelectCategory) {
      onSelectCategory(catVal);
    }
    const text = catLabel || catVal;
    onSelectKeyword(text);
    onSearch({ category: catVal, keyword: text });
    onClose();
  };

  const handleCityClick = (cityVal: string) => {
    if (onSelectCity) {
      onSelectCity(cityVal);
    }
    onSelectKeyword(cityVal);
    onSearch({ city: cityVal, keyword: cityVal });
    onClose();
  };

  const handleAmenityClick = (amenityVal: string) => {
    onSelectKeyword(amenityVal);
    if (onSelectAmenity) {
      onSelectAmenity(amenityVal);
    }
    const nextAmenities = selectedAmenities
      ? selectedAmenities.includes(amenityVal)
        ? selectedAmenities
        : [...selectedAmenities, amenityVal]
      : [amenityVal];
    onSearch({ amenities: nextAmenities, keyword: amenityVal });
    onClose();
  };

  // 1. Properties: when searching -> dynamic server suggestions; when idle -> popular properties from API
  const filteredProperties = isSearching
    ? serverSuggestions.properties || []
    : popularProperties;

  // 2. Locations: when searching -> dynamic locations from API; when idle -> popular regions from API
  const dynamicLocations: SuggestionLocation[] =
    serverSuggestions.locations || [];
  const filteredPopularRegions = isSearching
    ? popularRegions.filter((r) => r.name.toLowerCase().includes(qLower))
    : popularRegions;

  const filteredCities = isSearching
    ? STATIC_CITIES.filter((c) => c.toLowerCase().includes(qLower))
    : [];

  // 3. Recent searches containing the query
  const filteredRecent = isSearching
    ? recentSearches.filter((s) => s.query.toLowerCase().includes(qLower))
    : recentSearches;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100 select-none">
      {/* 1. Properties Column */}
      <div className="flex flex-col justify-between pr-0 md:pr-3">
        <div>
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-3 cursor-pointer group"
            onClick={() => handleScrollOrNavigate("high-demand-properties")}
          >
            <div className="flex items-center gap-2">
              <Flame
                size={14}
                className="text-orange-500 fill-orange-500 group-hover:scale-110 transition-transform"
              />
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition-colors">
                {isSearching ? "Matching Properties" : "High Demand Properties"}
              </h4>
            </div>
            {isFetching && (
              <Loader2 size={12} className="animate-spin text-primary" />
            )}
          </motion.div>

          <div className="space-y-2">
            {filteredProperties.map((prop: any, index: number) => {
              const title = prop.name || prop.title;
              return (
                <motion.div
                  variants={itemVariants}
                  key={prop.id || `prop-${index}`}
                  onClick={() => handlePropertyClick(prop)}
                  className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors duration-150 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Building size={14} className="stroke-[2.5px]" />
                  </div>
                  <span className="text-[13px] font-semibold text-left text-gray-700 leading-tight truncate group-hover:text-gray-900 transition-colors">
                    {title}
                  </span>
                </motion.div>
              );
            })}

            {filteredProperties.length === 0 && (
              <motion.div
                variants={itemVariants}
                className="text-gray-400 text-xs italic py-3 text-left"
              >
                {isSearching
                  ? "No matching properties"
                  : "No properties available"}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Locations Column */}
      <div className="flex flex-col justify-between pt-4 md:pt-0 pl-0 md:pl-4 pr-0 md:pr-3">
        <div>
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-3 cursor-pointer group"
            onClick={() => handleScrollOrNavigate("trending-cities")}
          >
            <Flame
              size={14}
              className="text-orange-500 fill-orange-500 group-hover:scale-110 transition-transform"
            />
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition-colors">
              {isSearching ? "Matching Locations" : "High Demand Regions"}
            </h4>
          </motion.div>

          <div className="space-y-2">
            {/* Dynamic Locations when searching */}
            {isSearching && dynamicLocations.length > 0
              ? dynamicLocations.map((loc, index) => (
                  <motion.div
                    variants={itemVariants}
                    key={`loc-${index}`}
                    onClick={() => handleRegionClick(loc.name)}
                    className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors duration-150 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} className="stroke-[2.5px]" />
                    </div>
                    <span className="text-[13px] font-semibold text-gray-700 text-left leading-tight group-hover:text-gray-900 transition-colors">
                      {loc.name}
                    </span>
                  </motion.div>
                ))
              : /* High Demand Regions from API */
                filteredPopularRegions.map((region, index) => (
                  <motion.div
                    variants={itemVariants}
                    key={region.id || `reg-${index}`}
                    onClick={() => handleRegionClick(region.name)}
                    className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors duration-150 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} className="stroke-[2.5px]" />
                    </div>
                    <span className="text-[13px] font-semibold text-gray-700 text-left leading-tight group-hover:text-gray-900 transition-colors">
                      {region.name}
                    </span>
                  </motion.div>
                ))}

            {/* Cities matching query when searching */}
            {isSearching &&
              dynamicLocations.length === 0 &&
              filteredCities.map((city, index) => (
                <motion.div
                  variants={itemVariants}
                  key={`city-${index}`}
                  onClick={() => handleCityClick(city)}
                  className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors duration-150 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="stroke-[2.5px]" />
                  </div>
                  <span className="text-[13px] font-semibold text-gray-700 text-left leading-tight group-hover:text-gray-900 transition-colors">
                    City: {city}
                  </span>
                </motion.div>
              ))}

            {isSearching &&
              dynamicLocations.length === 0 &&
              filteredPopularRegions.length === 0 &&
              filteredCities.length === 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-gray-400 text-xs italic py-3 text-left"
                >
                  No matching locations
                </motion.div>
              )}

            {!isSearching && filteredPopularRegions.length === 0 && (
              <motion.div
                variants={itemVariants}
                className="text-gray-400 text-xs italic py-3 text-left"
              >
                No regions available
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Recent Searches & Filter Recommendations */}
      <div className="flex flex-col justify-between pt-4 md:pt-0 pl-0 md:pl-4">
        <div>
          {/* Recent Searches */}
          <div className="mb-4">
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between mb-3"
            >
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Clock size={14} className="text-gray-400 stroke-[2.5px]" />
                {isSearching
                  ? "Matching History"
                  : recentSearches.some((s) => s.count !== undefined)
                    ? "Top Searches"
                    : "Recent Searches"}
              </h4>
            </motion.div>

            <div className="space-y-2">
              {filteredRecent.map((item, index) => (
                <motion.div
                  variants={itemVariants}
                  key={item.id || index}
                  onClick={() => handleRecentClick(item.query)}
                  className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors duration-150"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Home size={14} className="stroke-[2.5px]" />
                    </div>
                    <span className="text-[13px] font-semibold text-gray-700 text-left leading-tight group-hover:text-gray-900 transition-colors">
                      {item.query}
                    </span>
                  </div>
                  {item.id && item.id > 0 && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveItem(index, e)}
                      className="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
                      title="Delete search history"
                    >
                      <X size={12} className="stroke-[2.5px]" />
                    </button>
                  )}
                </motion.div>
              ))}
              {filteredRecent.length === 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-gray-400 text-xs italic py-1 text-left"
                >
                  {isSearching ? "No matching history" : "No recent searches"}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
