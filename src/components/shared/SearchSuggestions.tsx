"use client";

import { useState, useEffect, useRef } from "react";
import {
  Clock,
  MapPin,
  Building,
  X,
  Home,
  Flame,
  Loader2,
  Sparkles,
} from "lucide-react";
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
} from "@/lib/api";
import type { SearchSuggestionsProps } from "@/types/components";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export default function SearchSuggestions({
  query = "",
  tags = [],
  onAddTag,
  onRemoveTag,
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

  // Dynamic server suggestions when user types or has active tags
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
    getPopularProperties()
      .then((res) => {
        if (res && Array.isArray(res)) setPopularProperties(res);
      })
      .catch((err) => console.error("Error loading popular properties:", err));

    getPopularRegions()
      .then((res) => {
        if (res && Array.isArray(res)) setPopularRegions(res);
      })
      .catch((err) => console.error("Error loading popular regions:", err));

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
  const hasTags = tags.length > 0;
  const isSearching = cleanQ.length > 0 || hasTags;
  const qLower = cleanQ.toLowerCase();

  // Extract active tags
  const locationTags = tags
    .filter((t) => t.type === "location")
    .map((t) => t.value);
  const categoryTags = tags
    .filter((t) => t.type === "category")
    .map((t) => t.value);
  const cityTags = tags.filter((t) => t.type === "city").map((t) => t.value);
  const purposeTag = tags.find((t) => t.type === "purpose")?.value;

  const locationTag =
    locationTags.length > 0 ? locationTags.join(",") : undefined;
  const categoryTag =
    categoryTags.length > 0 ? categoryTags.join(",") : undefined;
  const cityTag = cityTags.length > 0 ? cityTags.join(",") : undefined;

  // Debounced fetch for dynamic suggestions when typing or tags change
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
        const data = await getSearchSuggestions({
          q: cleanQ,
          location: locationTag,
          category: categoryTag,
          city: cityTag,
          type: purposeTag,
        });
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
  }, [cleanQ, isSearching, locationTag, categoryTag, cityTag, purposeTag]);

  const handleRemoveHistoryItem = async (
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
    if (onAddTag) {
      onAddTag({
        id: `kw-${text.toLowerCase()}`,
        label: text,
        type: "keyword",
        value: text,
      });
    } else {
      onSelectKeyword(text);
      onSearch({ keyword: text });
      onClose();
    }
  };

  const handleRegionClick = (region: string) => {
    const existing = tags.find(
      (t) =>
        t.type === "location" && t.value.toLowerCase() === region.toLowerCase(),
    );
    if (existing && onRemoveTag) {
      onRemoveTag(existing.id);
    } else if (onAddTag) {
      onAddTag({
        id: `loc-${region.toLowerCase()}`,
        label: region,
        type: "location",
        value: region,
      });
    } else {
      onSelectLocation(region);
      onSearch({ location: region, keyword: region });
      onClose();
    }
  };

  const handleCategoryClick = (catVal: string, catLabel?: string) => {
    const text = catLabel || catVal;
    const existing = tags.find(
      (t) =>
        t.type === "category" && t.value.toLowerCase() === catVal.toLowerCase(),
    );
    if (existing && onRemoveTag) {
      onRemoveTag(existing.id);
    } else if (onAddTag) {
      onAddTag({
        id: `cat-${catVal.toLowerCase()}`,
        label: text,
        type: "category",
        value: catVal,
      });
    } else {
      if (onSelectCategory) onSelectCategory(catVal);
      onSearch({ category: catVal, keyword: text });
      onClose();
    }
  };

  const handleAmenityClick = (amenityVal: string) => {
    const existing = tags.find(
      (t) =>
        t.type === "amenity" &&
        t.value.toLowerCase() === amenityVal.toLowerCase(),
    );
    if (existing && onRemoveTag) {
      onRemoveTag(existing.id);
    } else if (onAddTag) {
      onAddTag({
        id: `amenity-${amenityVal.toLowerCase()}`,
        label: amenityVal,
        type: "amenity",
        value: amenityVal,
      });
    } else {
      onSelectKeyword(amenityVal);
      if (onSelectAmenity) onSelectAmenity(amenityVal);
      const nextAmenities = selectedAmenities
        ? selectedAmenities.includes(amenityVal)
          ? selectedAmenities
          : [...selectedAmenities, amenityVal]
        : [amenityVal];
      onSearch({ amenities: nextAmenities, keyword: amenityVal });
      onClose();
    }
  };

  // 1. Properties
  const filteredProperties = isSearching
    ? serverSuggestions.properties || []
    : popularProperties;

  // 2. Locations
  const dynamicLocations = serverSuggestions.locations || [];
  const filteredPopularRegions = isSearching
    ? popularRegions.filter((r) => r.name.toLowerCase().includes(qLower))
    : popularRegions;

  // 3. Categories & Amenities
  const dynamicCategories = serverSuggestions.categories || [];
  const dynamicFeatures = serverSuggestions.features || [];

  // 4. Recent searches
  const filteredRecent = isSearching
    ? recentSearches.filter((s) => s.query.toLowerCase().includes(qLower))
    : recentSearches;

  return (
    <div className="flex flex-col gap-3 select-none text-left">
      {/* ── 3-Column Original Layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* ── 1. Properties Column ── */}
        <div className="flex flex-col pr-0 md:pr-3">
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
                  {isSearching
                    ? "Matching Properties"
                    : "High Demand Properties"}
                </h4>
              </div>
              {isFetching && (
                <Loader2 size={12} className="animate-spin text-primary" />
              )}
            </motion.div>

            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {filteredProperties.map((prop: any, index: number) => {
                const title = prop.name || prop.title;
                const loc = prop.location;
                return (
                  <motion.div
                    variants={itemVariants}
                    key={prop.id || `prop-${index}`}
                    onClick={() => handlePropertyClick(prop)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors duration-150 group border border-transparent hover:border-gray-100"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Building size={16} className="stroke-[2.5px]" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <p className="text-[13px] font-semibold text-gray-800 leading-tight truncate group-hover:text-primary transition-colors">
                        {title}
                      </p>
                      {loc && (
                        <p className="text-[11px] text-gray-400 font-medium truncate flex items-center gap-1 -mt-2">
                          <MapPin
                            size={11}
                            className="shrink-0 text-gray-400 stroke-[2px]"
                          />
                          <span>{loc}</span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {filteredProperties.length === 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-gray-400 text-xs italic py-4 text-left"
                >
                  {isSearching
                    ? "No properties matching these criteria"
                    : "No properties available"}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* ── 2. Locations Column ── */}
        <div className="flex flex-col pt-4 md:pt-0 pl-0 md:pl-4 pr-0 md:pr-3">
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
                {isSearching ? "Related Locations" : "High Demand Regions"}
              </h4>
            </motion.div>

            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {isSearching && dynamicLocations.length > 0
                ? dynamicLocations.map((loc, index) => {
                    const isSelected = tags.some(
                      (t) =>
                        t.type === "location" &&
                        t.value.toLowerCase() === loc.name.toLowerCase(),
                    );
                    return (
                      <motion.div
                        variants={itemVariants}
                        key={`loc-${index}`}
                        onClick={() => handleRegionClick(loc.name)}
                        className={`flex items-center gap-2.5 cursor-pointer p-2 rounded-xl transition-colors duration-150 group ${
                          isSelected
                            ? "bg-blue-50 text-blue-700 font-bold"
                            : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <MapPin size={14} className="stroke-[2.5px]" />
                        </div>
                        <span className="text-[13px] font-semibold leading-tight truncate">
                          {loc.name}
                        </span>
                      </motion.div>
                    );
                  })
                : filteredPopularRegions.map((region, index) => {
                    const isSelected = tags.some(
                      (t) =>
                        t.type === "location" &&
                        t.value.toLowerCase() === region.name.toLowerCase(),
                    );
                    return (
                      <motion.div
                        variants={itemVariants}
                        key={region.id || `reg-${index}`}
                        onClick={() => handleRegionClick(region.name)}
                        className={`flex items-center gap-2.5 cursor-pointer p-2 rounded-xl transition-colors duration-150 group ${
                          isSelected
                            ? "bg-green-50 text-green-700 font-bold"
                            : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                          <MapPin size={14} className="stroke-[2.5px]" />
                        </div>
                        <span className="text-[13px] font-semibold leading-tight truncate">
                          {region.name}
                        </span>
                      </motion.div>
                    );
                  })}

              {isSearching &&
                dynamicLocations.length === 0 &&
                filteredPopularRegions.length === 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="text-gray-400 text-xs italic py-4 text-left"
                  >
                    No matching locations
                  </motion.div>
                )}

              {!isSearching && filteredPopularRegions.length === 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-gray-400 text-xs italic py-4 text-left"
                >
                  No regions available
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* ── 3. Categories, Amenities & Recent Searches Column ── */}
        <div className="flex flex-col pt-4 md:pt-0 pl-0 md:pl-4">
          <div>
            {/* Dynamic Categories matching query/tags */}
            {isSearching && dynamicCategories.length > 0 && (
              <div className="mb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                  <Building
                    size={13}
                    className="text-purple-500 stroke-[2.5px]"
                  />
                  Categories
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {dynamicCategories.map((cat) => {
                    const isSelected = tags.some(
                      (t) =>
                        t.type === "category" &&
                        t.value.toLowerCase() === cat.name.toLowerCase(),
                    );
                    return (
                      <button
                        key={`cat-${cat.id}`}
                        type="button"
                        onClick={() => handleCategoryClick(cat.name)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-purple-600 text-white font-bold shadow-xs"
                            : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100"
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Features/Amenities matching query/tags */}
            {isSearching && dynamicFeatures.length > 0 && (
              <div className="mb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                  <Sparkles
                    size={13}
                    className="text-emerald-500 stroke-[2.5px]"
                  />
                  Amenities
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {dynamicFeatures.map((feat) => {
                    const isSelected = tags.some(
                      (t) =>
                        t.type === "amenity" &&
                        t.value.toLowerCase() === feat.name.toLowerCase(),
                    );
                    return (
                      <button
                        key={`feat-${feat.id}`}
                        type="button"
                        onClick={() => handleAmenityClick(feat.name)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-emerald-600 text-white font-bold shadow-xs"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
                        }`}
                      >
                        {feat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            <div>
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between mb-2"
              >
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Clock size={13} className="text-gray-400 stroke-[2.5px]" />
                  {isSearching ? "Recent Matches" : "Recent Searches"}
                </h4>
              </motion.div>

              <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                {filteredRecent.map((item, index) => (
                  <motion.div
                    variants={itemVariants}
                    key={item.id || index}
                    onClick={() => handleRecentClick(item.query)}
                    className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors duration-150"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
                        <Home size={14} className="stroke-[2.5px]" />
                      </div>
                      <span className="text-[13px] font-semibold text-gray-700 leading-tight group-hover:text-gray-900 transition-colors truncate">
                        {item.query}
                      </span>
                    </div>
                    {item.id && item.id > 0 && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveHistoryItem(index, e)}
                        className="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 cursor-pointer shrink-0"
                        title="Delete search history"
                      >
                        <X size={11} className="stroke-[2.5px]" />
                      </button>
                    )}
                  </motion.div>
                ))}
                {filteredRecent.length === 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="text-gray-400 text-xs italic py-2 text-left"
                  >
                    {isSearching ? "No matching history" : "No recent searches"}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
