"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, RotateCcw, SlidersHorizontal } from "lucide-react";
import { usePageFilter, PRICE_RANGES, defaultFilterValues, type PageFilterValues } from "@/contexts/HomeFilterContext";
import PropertyTypeSwitch from "./PropertyTypeSwitch";
import { getFeatures, getFacilities, getPropertyCategories } from "@/lib/api";

export default function PropertiesFilterSidebar() {
  const { filters, setFilters } = usePageFilter();

  // Collapsible section states
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [configExpanded, setConfigExpanded] = useState(true);
  const [featuresExpanded, setFeaturesExpanded] = useState(true);
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(true);

  // Dynamic filter lists fetched from backend
  const [dbFeatures, setDbFeatures] = useState<Array<{ id: number; name: string }>>([]);
  const [dbFacilities, setDbFacilities] = useState<Array<{ id: number; name: string }>>([]);
  const [categoriesList, setCategoriesList] = useState<Array<{ value: string; label: string }>>([
    { value: "apartments", label: "Apartments" },
    { value: "villas", label: "Villas" },
    { value: "house", label: "Individual House" },
    { value: "commercial", label: "Commercial Properties" },
    { value: "all", label: "Show All Properties" },
  ]);

  // Local state for instantaneous UI responsiveness
  const [localFilters, setLocalFilters] = useState<PageFilterValues>(filters);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadFilterData() {
      try {
        const [featRes, facRes] = await Promise.all([
          getFeatures(),
          getFacilities(),
        ]);
        if (featRes?.success) setDbFeatures(featRes.data || []);
        if (facRes?.success) setDbFacilities(facRes.data || []);
      } catch (err) {
        console.error("Failed to load filter items:", err);
      }
    }
    loadFilterData();
  }, []);

  // Dynamically load categories based on activeTab purpose
  useEffect(() => {
    getPropertyCategories({ for: localFilters.activeTab })
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) {
          // Individual residential categories
          const residentialCategories = res.data
            .filter((c: any) => c.type?.toLowerCase() === "residential")
            .map((c: any) => {
              const lowerName = c.name.toLowerCase();
              let val = lowerName.replace(/\s+/g, "_");
              if (lowerName.includes("plot")) val = "plots";
              else if (lowerName.includes("apartment")) val = "apartments";
              else if (lowerName.includes("villa")) val = "villas";
              else if (lowerName.includes("individual house") || lowerName.includes("house")) val = "house";
              return {
                value: val,
                label: c.name,
              };
            });

          // Single entry for Commercial Properties
          const hasCommercial = res.data.some(
            (c: any) => c.type?.toLowerCase() === "commercial"
          );

          const list = [
            ...residentialCategories,
            ...(hasCommercial
              ? [{ value: "commercial", label: "Commercial Properties" }]
              : []),
            { value: "all", label: "Show All Properties" },
          ];

          setCategoriesList(list);
        }
      })
      .catch((err) => console.error("Failed to load categories in sidebar:", err));
  }, [localFilters.activeTab]);

  // Synchronize external filter changes when no active debounce timer is running
  useEffect(() => {
    if (!debounceTimerRef.current) {
      setLocalFilters(filters);
    }
  }, [filters]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Dispatch debounced filter update to context (400ms)
  const applyFilterChange = (nextFilters: PageFilterValues) => {
    setLocalFilters(nextFilters);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setFilters(nextFilters);
      debounceTimerRef.current = null;
    }, 400);
  };

  // Immediate Clear Filters handler
  const handleClearFilters = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    const resetFilters: PageFilterValues = {
      ...defaultFilterValues,
      activeTab: localFilters.activeTab,
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
  };

  const hasActiveFilters = Boolean(
    (localFilters.activeCategory && localFilters.activeCategory !== "all") ||
    localFilters.priceRanges ||
    localFilters.houseType ||
    localFilters.amenities ||
    localFilters.maxPrice ||
    localFilters.minPrice ||
    localFilters.keyword ||
    localFilters.location ||
    localFilters.maxArea ||
    localFilters.city
  );

  // ── Price Range Selection (Checkboxes) ──
  const selectedPriceRanges = localFilters.priceRanges
    ? localFilters.priceRanges.split(",").filter(Boolean)
    : [];

  const handlePriceRangeSelect = (rangeId: string) => {
    const currentRanges = localFilters.priceRanges
      ? localFilters.priceRanges.split(",").filter(Boolean)
      : [];
    const updated = currentRanges.includes(rangeId)
      ? currentRanges.filter((id) => id !== rangeId)
      : [...currentRanges, rangeId];
    applyFilterChange({
      ...localFilters,
      priceRanges: updated.join(","),
    });
  };

  // ── Property Category Selection (Checkboxes) ──
  const selectedCategories =
    localFilters.activeCategory && localFilters.activeCategory !== "all"
      ? localFilters.activeCategory.split(",").filter(Boolean)
      : [];

  const handleCategorySelect = (categoryValue: string) => {
    if (categoryValue === "all") {
      applyFilterChange({ ...localFilters, activeCategory: "all" });
      return;
    }
    const currentSelected =
      localFilters.activeCategory && localFilters.activeCategory !== "all"
        ? localFilters.activeCategory.split(",").filter(Boolean)
        : [];
    const updated = currentSelected.includes(categoryValue)
      ? currentSelected.filter((c) => c !== categoryValue)
      : [...currentSelected, categoryValue];
    applyFilterChange({
      ...localFilters,
      activeCategory: updated.length > 0 ? updated.join(",") : "all",
    });
  };

  // ── BHK Type Selection (Pill Buttons) ──
  const selectedHouseTypes = localFilters.houseType
    ? localFilters.houseType.split(",").filter(Boolean)
    : [];

  const handleHouseTypeSelect = (value: string) => {
    const current = localFilters.houseType ? localFilters.houseType.split(",").filter(Boolean) : [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    applyFilterChange({
      ...localFilters,
      houseType: updated.join(","),
    });
  };

  // ── Amenities / Features / Facilities Selection ──
  const activeAmenitiesList = localFilters.amenities
    ? localFilters.amenities.split(",").filter(Boolean)
    : [];

  const handleToggleAmenity = (amenityName: string) => {
    const currentList = localFilters.amenities ? localFilters.amenities.split(",").filter(Boolean) : [];
    const lowerName = amenityName.toLowerCase();
    const updated = currentList.includes(lowerName)
      ? currentList.filter((a) => a !== lowerName)
      : [...currentList, lowerName];
    applyFilterChange({
      ...localFilters,
      amenities: updated.join(","),
    });
  };

  const houseTypes = [
    { value: "1 RK", label: "1 RK" },
    { value: "1 BHK", label: "1 BHK" },
    { value: "2 BHK", label: "2 BHK" },
    { value: "3 BHK", label: "3 BHK" },
    { value: "4 BHK", label: "4 BHK" },
    { value: "5+ BHK", label: "5+ BHK" },
  ];

  return (
    <div className="w-full max-w-[318px] bg-white rounded-2xl border border-gray-150 p-5 text-left shadow-sm flex flex-col gap-6 select-none">
      
      {/* ── SIDEBAR TOP HEADER & CLEAR BUTTON ── */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 hover:underline cursor-pointer transition-colors active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* ── PRICE RANGE SECTION ── */}
      <div>
        <button
          type="button"
          onClick={() => setPriceExpanded(!priceExpanded)}
          className="w-full flex items-center justify-between font-bold text-sm text-gray-800 uppercase tracking-wider pb-3 border-b border-gray-100 cursor-pointer"
        >
          <span>Price Range</span>
          {priceExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {priceExpanded && (
          <div className="pt-4 flex flex-col gap-3">
            {PRICE_RANGES.map((range) => {
              const isChecked = selectedPriceRanges.includes(range.id);
              return (
                <label
                  key={range.id}
                  className="flex items-center gap-3 cursor-pointer group select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handlePriceRangeSelect(range.id)}
                    className="w-[17px] h-[17px] rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer transition-transform group-active:scale-95"
                  />
                  <span className="text-[13px] text-gray-600 font-semibold group-hover:text-gray-900 transition-colors">
                    {range.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* ── PROPERTY CATEGORY SECTION ── */}
      <div>
        <button
          type="button"
          onClick={() => setCategoryExpanded(!categoryExpanded)}
          className="w-full flex items-center justify-between font-bold text-sm text-gray-800 uppercase tracking-wider pb-3 border-b border-gray-100 cursor-pointer"
        >
          <span>Property Category</span>
          {categoryExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {categoryExpanded && (
          <div className="pt-4 flex flex-col gap-4">
            
            {/* Toggle Buy / Rent */}
            <PropertyTypeSwitch
              activeTab={localFilters.activeTab}
              onChange={(tab) => applyFilterChange({ ...localFilters, activeTab: tab })}
              variant="sidebar"
            />

            {/* Checkbox List */}
            <div className="flex flex-col gap-3">
              {categoriesList.map((cat) => {
                const isChecked =
                  cat.value === "all"
                    ? !localFilters.activeCategory || localFilters.activeCategory === "all"
                    : selectedCategories.includes(cat.value);
                return (
                  <label
                    key={cat.value}
                    className="flex items-center gap-3 cursor-pointer group select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategorySelect(cat.value)}
                      className="w-[17px] h-[17px] rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer transition-transform group-active:scale-95"
                    />
                    <span className="text-[13px] text-gray-600 font-semibold group-hover:text-gray-900 transition-colors">
                      {cat.label}
                    </span>
                  </label>
                );
              })}
            </div>

          </div>
        )}
      </div>

      {/* ── BHK Type SECTION (BHK) ── */}
      <div>
        <button
          type="button"
          onClick={() => setConfigExpanded(!configExpanded)}
          className="w-full flex items-center justify-between font-bold text-sm text-gray-800 uppercase tracking-wider pb-3 border-b border-gray-100 cursor-pointer"
        >
          <span>BHK Type</span>
          {configExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {configExpanded && (
          <div className="pt-4 flex flex-wrap gap-2">
            {houseTypes.map((ht) => {
              const isSelected = selectedHouseTypes.includes(ht.value);
              return (
                <button
                  type="button"
                  key={ht.value}
                  onClick={() => handleHouseTypeSelect(ht.value)}
                  className={`px-4 py-2 rounded-full border text-[11px] font-bold transition-all duration-150 cursor-pointer active:scale-95 select-none ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                  }`}
                >
                  {ht.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── FEATURES SECTION ── */}
      <div>
        <button
          type="button"
          onClick={() => setFeaturesExpanded(!featuresExpanded)}
          className="w-full flex items-center justify-between font-bold text-sm text-gray-800 uppercase tracking-wider pb-3 border-b border-gray-100 cursor-pointer"
        >
          <span>Features</span>
          {featuresExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {featuresExpanded && (
          <div className="pt-4 flex flex-wrap gap-2">
            {dbFeatures.map((feat) => {
              const isSelected = activeAmenitiesList.includes(feat.name.toLowerCase());
              return (
                <button
                  type="button"
                  key={feat.id}
                  onClick={() => handleToggleAmenity(feat.name)}
                  className={`px-4 py-2 rounded-full border text-[11px] font-bold transition-all duration-150 cursor-pointer active:scale-95 select-none ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                  }`}
                >
                  + {feat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── FACILITIES SECTION ── */}
      <div>
        <button
          type="button"
          onClick={() => setFacilitiesExpanded(!facilitiesExpanded)}
          className="w-full flex items-center justify-between font-bold text-sm text-gray-800 uppercase tracking-wider pb-3 border-b border-gray-100 cursor-pointer"
        >
          <span>Facilities</span>
          {facilitiesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {facilitiesExpanded && (
          <div className="pt-4 flex flex-wrap gap-2">
            {dbFacilities.map((fac) => {
              const isSelected = activeAmenitiesList.includes(fac.name.toLowerCase());
              return (
                <button
                  type="button"
                  key={fac.id}
                  onClick={() => handleToggleAmenity(fac.name)}
                  className={`px-4 py-2 rounded-full border text-[11px] font-bold transition-all duration-150 cursor-pointer active:scale-95 select-none ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                  }`}
                >
                  + {fac.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── BOTTOM RESET FILTERS BUTTON ── */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClearFilters}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

    </div>
  );
}

