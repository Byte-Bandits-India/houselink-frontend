"use client";

import { useState, useEffect } from "react";
import { Clock, MapPin, Building, X, Home, Flame, Tag, CheckSquare } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface SearchSuggestionsProps {
  query?: string;
  onSelectKeyword: (keyword: string) => void;
  onSelectLocation: (location: string) => void;
  onSelectCategory?: (category: string) => void;
  onSelectCity?: (city: string) => void;
  onSelectAmenity?: (amenity: string) => void;
  onSearch: () => void;
  onClose: () => void;
}

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

export default function SearchSuggestions({
  query = "",
  onSelectKeyword,
  onSelectLocation,
  onSelectCategory,
  onSelectCity,
  onSelectAmenity,
  onSearch,
  onClose,
}: SearchSuggestionsProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    } else {
      const fallback = [
        "2 BHK apartment in Adyar",
        "Flats in porur",
        "Lands in Kundrathur",
        "3 BHK Villas in ECR",
      ];
      setRecentSearches(fallback);
      localStorage.setItem("recent_searches", JSON.stringify(fallback));
    }
  }, []);

  const handleRemoveItem = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((_, i) => i !== indexToRemove);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  const handleRecentClick = (text: string) => {
    onSelectKeyword(text);
    setTimeout(() => {
      onSearch();
      onClose();
    }, 50);
  };

  const handleRegionClick = (region: string) => {
    onSelectLocation(region);
    setTimeout(() => {
      onSearch();
      onClose();
    }, 50);
  };

  const handleCategoryClick = (catVal: string) => {
    if (onSelectCategory) {
      onSelectCategory(catVal);
    }
    onSelectKeyword("");
    setTimeout(() => {
      onSearch();
      onClose();
    }, 50);
  };

  const handleCityClick = (cityVal: string) => {
    if (onSelectCity) {
      onSelectCity(cityVal);
    }
    setTimeout(() => {
      onSearch();
      onClose();
    }, 50);
  };

  const handleAmenityClick = (amenityVal: string) => {
    if (onSelectAmenity) {
      onSelectAmenity(amenityVal);
    }
    setTimeout(() => {
      onSearch();
      onClose();
    }, 50);
  };

  const q = query.trim().toLowerCase();
  const isSearching = q.length > 0;

  // 1. High Demand Properties containing the query
  const defaultProperties = [
    "Skyline Apartments",
    "Grand Plaza Office",
    "Oceanic Luxury Villa",
    "Signature Residencies",
  ];
  const filteredProperties = isSearching
    ? defaultProperties.filter((p) => p.toLowerCase().includes(q))
    : defaultProperties;

  // 2. High Demand Regions / Cities containing the query
  const defaultRegions = ["Adyar", "OMR", "Porur", "Velachery"];
  const staticCities = ["Chennai", "Bangalore", "Mumbai", "Hyderabad"];

  const filteredRegions = isSearching
    ? defaultRegions.filter((r) => r.toLowerCase().includes(q))
    : defaultRegions;

  const filteredCities = isSearching
    ? staticCities.filter((c) => c.toLowerCase().includes(q))
    : [];

  // 3. Recent searches containing the query
  const filteredRecent = isSearching
    ? recentSearches.filter((s) => s.toLowerCase().includes(q))
    : recentSearches;

  // 4. Categories matching the query
  const propertyCategories = [
    { value: "plots", label: "Plots" },
    { value: "apartments", label: "Apartments" },
    { value: "villas", label: "Villas" },
    { value: "house", label: "Individual House" },
    { value: "commercial", label: "Commercial Properties" },
  ];
  const matchingCategories = isSearching
    ? propertyCategories.filter((c) => c.label.toLowerCase().includes(q))
    : [];

  // 5. Amenities matching the query
  const defaultAmenities = [
    "Wifi",
    "Swimming pool",
    "Security",
    "Garden",
    "Balcony",
    "Air Conditioning",
    "Fitness center",
    "Car Parking",
    "Bike Parking",
  ];
  const matchingAmenities = isSearching
    ? defaultAmenities.filter((a) => a.toLowerCase().includes(q))
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100 select-none">
      {/* 1. High Demand Properties */}
      <div className="flex flex-col justify-between pr-0 md:pr-3">
        <div>
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-3">
            <Flame size={14} className="text-orange-500 fill-orange-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">
              {isSearching ? "Matching Properties" : "High Demand Properties"}
            </h4>
          </motion.div>

          <div className="space-y-2">
            {filteredProperties.map((prop, index) => (
              <motion.div
                variants={itemVariants}
                key={index}
                onClick={() => handleRecentClick(prop)}
                className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors duration-150 group"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Building size={14} className="stroke-[2.5px]" />
                </div>
                <span className="text-[13px] font-semibold text-left text-gray-700 leading-tight truncate group-hover:text-gray-900 transition-colors">
                  {prop}
                </span>
              </motion.div>
            ))}
            {filteredProperties.length === 0 && (
              <motion.div variants={itemVariants} className="text-gray-400 text-xs italic py-3">
                No matching properties
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 2. High Demand Regions */}
      <div className="flex flex-col justify-between pt-4 md:pt-0 pl-0 md:pl-4 pr-0 md:pr-3">
        <div>
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-3">
            <Flame size={14} className="text-orange-500 fill-orange-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">
              {isSearching ? "Matching Locations" : "High Demand Regions"}
            </h4>
          </motion.div>

          <div className="space-y-2">
            {/* Regions */}
            {filteredRegions.map((region, index) => (
              <motion.div
                variants={itemVariants}
                key={index}
                onClick={() => handleRegionClick(region)}
                className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors duration-150 group"
              >
                <div className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="stroke-[2.5px]" />
                </div>
                <span className="text-[13px] font-semibold text-gray-700 text-left leading-tight group-hover:text-gray-900 transition-colors">
                  {region}
                </span>
              </motion.div>
            ))}

            {/* Cities */}
            {isSearching &&
              filteredCities.map((city, index) => (
                <motion.div
                  variants={itemVariants}
                  key={`city-${index}`}
                  onClick={() => handleCityClick(city.toLowerCase())}
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

            {filteredRegions.length === 0 && filteredCities.length === 0 && (
              <motion.div variants={itemVariants} className="text-gray-400 text-xs italic py-3">
                No matching locations
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
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Clock size={14} className="text-gray-400 stroke-[2.5px]" />
                {isSearching ? "Matching History" : "Recent Searches"}
              </h4>
            </motion.div>

            <div className="space-y-2">
              {filteredRecent.map((item, index) => (
                <motion.div
                  variants={itemVariants}
                  key={index}
                  onClick={() => handleRecentClick(item)}
                  className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors duration-150"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Home size={14} className="stroke-[2.5px]" />
                    </div>
                    <span className="text-[13px] font-semibold text-gray-700 text-left leading-tight group-hover:text-gray-900 transition-colors">
                      {item}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleRemoveItem(index, e)}
                    className="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    <X size={12} className="stroke-[2.5px]" />
                  </button>
                </motion.div>
              ))}
              {filteredRecent.length === 0 && (
                <motion.div variants={itemVariants} className="text-gray-400 text-xs italic py-1">
                  No matching history
                </motion.div>
              )}
            </div>
          </div>

          {/* Filter Suggestions (Only when searching) */}
          {isSearching && (matchingCategories.length > 0 || matchingAmenities.length > 0) && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <motion.div variants={itemVariants} className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-indigo-500" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Matching Filters
                </h4>
              </motion.div>

              <div className="space-y-2">
                {/* Categories */}
                {matchingCategories.map((category) => (
                  <motion.div
                    variants={itemVariants}
                    key={category.value}
                    onClick={() => handleCategoryClick(category.value)}
                    className="flex items-center gap-2.5 cursor-pointer hover:bg-indigo-50/50 p-1.5 rounded-xl transition-colors duration-150 group border border-dashed border-indigo-100"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Tag size={14} className="stroke-[2.5px]" />
                    </div>
                    <span className="text-[13px] font-semibold text-gray-700 text-left leading-tight group-hover:text-indigo-900 transition-colors">
                      Category: <strong className="text-indigo-600">{category.label}</strong>
                    </span>
                  </motion.div>
                ))}

                {/* Amenities */}
                {matchingAmenities.map((amenity) => (
                  <motion.div
                    variants={itemVariants}
                    key={amenity}
                    onClick={() => handleAmenityClick(amenity)}
                    className="flex items-center gap-2.5 cursor-pointer hover:bg-emerald-50/50 p-1.5 rounded-xl transition-colors duration-150 group border border-dashed border-emerald-100"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <CheckSquare size={14} className="stroke-[2.5px]" />
                    </div>
                    <span className="text-[13px] font-semibold text-gray-700 text-left leading-tight group-hover:text-emerald-900 transition-colors">
                      Amenity: <strong className="text-emerald-600">{amenity}</strong>
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
