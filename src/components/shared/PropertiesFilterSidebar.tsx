"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePageFilter } from "@/contexts/HomeFilterContext";
import PropertyTypeSwitch from "./PropertyTypeSwitch";
import { Button } from "@/components/ui/button"

export default function PropertiesFilterSidebar() {
  const { filters, setFilters } = usePageFilter();

  // Collapsible states
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [featuresExpanded, setFeaturesExpanded] = useState(true);

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

  const handleCategorySelect = (categoryValue: string) => {
    setFilters({
      ...filters,
      activeCategory: categoryValue,
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

  const amenities = [
    "Wifi",
    "Parking",
    "Security",
    "Garden",
    "Swimming Pool",
    "Balcony",
  ];

  return (
    <div className="w-full max-w-[318px] bg-white rounded-2xl border border-gray-150 p-5 text-left shadow-sm flex flex-col gap-6 font-inter">
      
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
              min={0.1}
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
              <span>₹0.1 Cr</span>
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
                const isChecked = filters.activeCategory === cat.value;
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
            {amenities.map((amenity) => {
              const isSelected = activeAmenitiesList.includes(amenity.toLowerCase());
              return (
                <Button
                  variant="gradient"
                  key={amenity}
                  onClick={() => handleToggleAmenity(amenity)}
                  className={`px-4 py-2 rounded-full border text-[11px] font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  + {amenity}
                </Button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
