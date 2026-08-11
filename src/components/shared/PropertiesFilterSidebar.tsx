"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePageFilter } from "@/contexts/HomeFilterContext";
import PropertyTypeSwitch from "./PropertyTypeSwitch";
import { Button } from "@/components/ui/button";
import { getFeatures, getFacilities } from "@/lib/api";

export default function PropertiesFilterSidebar() {
  const { filters, setFilters } = usePageFilter();

  // Collapsible states
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [configExpanded, setConfigExpanded] = useState(true);
  const [featuresExpanded, setFeaturesExpanded] = useState(true);
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(true);

  // Dynamic filter lists fetched from backend
  const [dbFeatures, setDbFeatures] = useState<Array<{ id: number; name: string }>>([]);
  const [dbFacilities, setDbFacilities] = useState<Array<{ id: number; name: string }>>([]);

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

  // Local values synchronized with page filter context
  const initialPrice = filters.maxPrice ? Number(filters.maxPrice) / 10000000 : 100;
  const [price, setPrice] = useState(initialPrice);
  const percentage = ((price - 0.1) / (99.9)) * 100;

  useEffect(() => {
    setPrice(filters.maxPrice ? Number(filters.maxPrice) / 10000000 : 100);
  }, [filters.maxPrice]);

  const handlePriceChange = (val: number) => {
    setPrice(val);
    setFilters({
      ...filters,
      maxPrice: val === 100 ? "" : String(val * 10000000),
    });
  };

  // "Show All Properties" is exclusive; any other category can be multi-selected
  // alongside other specific categories (stored as a comma-separated string).
  const selectedCategories =
    filters.activeCategory && filters.activeCategory !== "all"
      ? filters.activeCategory.split(",").filter(Boolean)
      : [];

  const handleCategorySelect = (categoryValue: string) => {
    if (categoryValue === "all") {
      setFilters({ ...filters, activeCategory: "all" });
      return;
    }
    const updated = selectedCategories.includes(categoryValue)
      ? selectedCategories.filter((c) => c !== categoryValue)
      : [...selectedCategories, categoryValue];
    setFilters({
      ...filters,
      activeCategory: updated.length > 0 ? updated.join(",") : "all",
    });
  };

  // Toggling amenities (stored as comma-separated string)
  const activeAmenitiesList = filters.amenities ? filters.amenities.split(",") : [];
  const handleToggleAmenity = (amenityName: string) => {
    let updated: string[];
    const lowerName = amenityName.toLowerCase();
    if (activeAmenitiesList.includes(lowerName)) {
      updated = activeAmenitiesList.filter((a) => a !== lowerName);
    } else {
      updated = [...activeAmenitiesList, lowerName];
    }
    setFilters({
      ...filters,
      amenities: updated.join(","),
    });
  };

  const categories = [
    { value: "plots", label: "Plots" },
    { value: "apartments", label: "Apartments" },
    { value: "villas", label: "Villas" },
    { value: "house", label: "Individual House" },
    { value: "commercial", label: "Commercial Properties" },
    { value: "all", label: "Show All Properties" },
  ];

  const houseTypes = [
    { value: "1 RK", label: "1 RK" },
    { value: "1 BHK", label: "1 BHK" },
    { value: "2 BHK", label: "2 BHK" },
    { value: "3 BHK", label: "3 BHK" },
    { value: "4 BHK", label: "4 BHK" },
    { value: "5+ BHK", label: "5+ BHK" },
  ];

  // Multi-select, stored as a comma-separated string (same convention as amenities)
  const selectedHouseTypes = filters.houseType ? filters.houseType.split(",").filter(Boolean) : [];
  const handleHouseTypeSelect = (value: string) => {
    const updated = selectedHouseTypes.includes(value)
      ? selectedHouseTypes.filter((v) => v !== value)
      : [...selectedHouseTypes, value];
    setFilters({
      ...filters,
      houseType: updated.join(","),
    });
  };

  // Static amenities array removed in favor of dynamic DB features & facilities

  return (
    <div className="w-full max-w-[318px] bg-white rounded-2xl border border-gray-150 p-5 text-left shadow-sm flex flex-col gap-6">
      
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
            <span className="text-xs font-semibold text-gray-500">
              Starting From ₹0 To ₹{price} Cr
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={price}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #163D75 ${percentage}%, #f3f4f6 ${percentage}%)`
              }}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
              <span>₹0</span>
              <span>₹100 Cr</span>
            </div>
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
              activeTab={filters.activeTab}
              onChange={(tab) => setFilters({ ...filters, activeTab: tab })}
              variant="sidebar"
            />

            {/* Checkbox List */}
            <div className="flex flex-col gap-3">
              {categories.map((cat) => {
                const isChecked =
                  cat.value === "all"
                    ? !filters.activeCategory || filters.activeCategory === "all"
                    : selectedCategories.includes(cat.value);
                return (
                  <label
                    key={cat.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategorySelect(cat.value)}
                      className="w-[17px] h-[17px] rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
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
                <Button
                  variant="gradient"
                  key={ht.value}
                  onClick={() => handleHouseTypeSelect(ht.value)}
                  className={`px-4 py-2 rounded-full border text-[11px] font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {ht.label}
                </Button>
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
                <Button
                  variant="gradient"
                  key={feat.id}
                  onClick={() => handleToggleAmenity(feat.name)}
                  className={`px-4 py-2 rounded-full border text-[11px] font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  + {feat.name}
                </Button>
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
                <Button
                  variant="gradient"
                  key={fac.id}
                  onClick={() => handleToggleAmenity(fac.name)}
                  className={`px-4 py-2 rounded-full border text-[11px] font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  + {fac.name}
                </Button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
