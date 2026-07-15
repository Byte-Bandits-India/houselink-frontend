"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  ChevronLeft,
  Check,
  Wifi,
  Waves,
  Shield,
  Home,
  Wind,
  Leaf,
  Dumbbell,
  Star,
  Maximize2,
  IndianRupee,
  ArrowRight,
  Sliders,
} from "lucide-react";
import PropertyTypeSwitch from "./PropertyTypeSwitch";
import { getPopularRegions, getFeatures, getFacilities, type PopularRegionApiItem } from "@/lib/api";
import { Button } from "../ui/button";

import { SearchFilterModalProps } from "@/types/components";

const houseTypes = [
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
  "5+ BHK",
  "1 RK",
];

// Helper mapping for amenities names to icons dynamically
const getAmenityIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet")) return <Wifi className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  if (lower.includes("pool") || lower.includes("swim")) return <Waves className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  if (lower.includes("security") || lower.includes("guard")) return <Shield className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  if (lower.includes("balcony")) return <Building className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  if (lower.includes("ac") || lower.includes("conditioning") || lower.includes("air")) return <Wind className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  if (lower.includes("garden") || lower.includes("park") || lower.includes("lawn")) return <Leaf className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  if (lower.includes("gym") || lower.includes("fitness") || lower.includes("center")) return <Dumbbell className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  return <Check className="w-4 h-4 mr-1.5 flex-shrink-0" />;
};

export default function SearchFilterModal({
  isOpen,
  onClose,
  initialKeyword,
  initialPurpose,
  onSearch,
}: SearchFilterModalProps) {
  const [step, setStep] = useState(1);

  // Step 1 States
  const [region, setRegion] = useState("");
  const [purpose, setPurpose] = useState<"sell" | "rent">(initialPurpose);
  const [popularRegions, setPopularRegions] = useState<PopularRegionApiItem[]>([]);

  // Step 2 States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]); // in Crores
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 10000]); // in sq.ft.
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedHouseType, setSelectedHouseType] = useState<string>("");

  // Backend Features & Facilities
  const [dbFeatures, setDbFeatures] = useState<Array<{ id: number; name: string }>>([]);
  const [dbFacilities, setDbFacilities] = useState<Array<{ id: number; name: string }>>([]);

  // Sync initial purpose when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPurpose(initialPurpose);
      setRegion("");
      setPriceRange([0, 100]);
      setAreaRange([0, 10000]);
      setSelectedAmenities([]);
      setSelectedHouseType("");
    }
  }, [isOpen, initialPurpose]);

  // Load backend filter metadata
  useEffect(() => {
    getPopularRegions()
      .then((data) => {
        if (Array.isArray(data)) {
          setPopularRegions(data);
        }
      })
      .catch((err) => console.error("Error loading popular regions:", err));

    getFeatures()
      .then((res) => {
        if (res?.success) setDbFeatures(res.data || []);
      })
      .catch((err) => console.error("Error loading features:", err));

    getFacilities()
      .then((res) => {
        if (res?.success) setDbFacilities(res.data || []);
      })
      .catch((err) => console.error("Error loading facilities:", err));
  }, []);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      onClose();
    }
  };

  const toggleAmenity = (name: string) => {
    const lowerName = name.toLowerCase();
    setSelectedAmenities((prev) =>
      prev.includes(lowerName) ? prev.filter((a) => a !== lowerName) : [...prev, lowerName]
    );
  };

  const handleSubmit = () => {
    onSearch({
      keyword: initialKeyword,
      location: region || undefined,
      property_purpose: purpose,
      max_price: priceRange[1] === 100 ? undefined : String(priceRange[1] * 10000000), // convert Cr to Rupees
      max_area: areaRange[1] === 10000 ? undefined : String(areaRange[1]),
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      house_type: selectedHouseType || undefined,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className={`w-full p-6 md:p-8 rounded-2xl bg-white border border-gray-100 shadow-2xl overflow-hidden font-inter select-none transition-all duration-300 ${
        step === 1 ? "max-w-[460px]" : "max-w-[880px]"
      }`}>
        <DialogHeader className="text-left pb-3 border-b border-gray-100 mb-5">
          <DialogTitle className="text-lg font-bold text-gray-900 tracking-tight">
            Search Filters
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          /* ─── STEP 1 ─── */
          <div className="flex flex-col gap-5 text-left">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">
                Property Region
              </label>
              <div className="relative flex items-center w-full">
                <Select value={region} onValueChange={(val) => setRegion(val)}>
                  <SelectTrigger className="w-full text-sm font-bold text-gray-700 bg-gray-50 border-gray-200 rounded-xl h-11 px-4 my-0 focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <SelectValue placeholder="Select Region..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white max-h-[220px] z-[60]">
                    {popularRegions.map((o) => (
                      <SelectItem key={o.id} value={o.name} className="text-sm font-semibold">
                        {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">
                Property Purpose
              </label>
              <div className="w-[200px]">
                <PropertyTypeSwitch
                  activeTab={purpose}
                  onChange={(val) => setPurpose(val)}
                  variant="header"
                />
              </div>
            </div>
          </div>
        ) : (
          /* ─── STEP 2 ─── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-h-[60vh] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            
            {/* Left Column: Sliders */}
            <div className="flex flex-col gap-5">
              {/* Price Range Slider */}
              <div className="border border-gray-100 rounded-xl p-4 md:p-5 bg-white shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center flex-shrink-0">
                    <IndianRupee className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <span className="font-bold text-sm text-gray-800">Price Range</span>
                </div>
                
                <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                  <span>From</span>
                  <span>To</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary mt-1"
                />
                
                <div className="flex justify-between text-xs font-bold text-gray-500 mt-2.5">
                  <span>₹0</span>
                  <span>₹{priceRange[1]} Cr{priceRange[1] === 100 && "+"}</span>
                </div>
              </div>

              {/* Area Range Slider */}
              <div className="border border-gray-100 rounded-xl p-4 md:p-5 bg-white shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center flex-shrink-0">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-gray-800">Area Range (sq.ft.)</span>
                </div>
                
                <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                  <span>From</span>
                  <span>To</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={areaRange[1]}
                  onChange={(e) => setAreaRange([0, Number(e.target.value)])}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary mt-1"
                />
                
                <div className="flex justify-between text-xs font-bold text-gray-500 mt-2.5">
                  <span>0</span>
                  <span>{areaRange[1].toLocaleString()} sq.ft.</span>
                </div>
              </div>

              {/* House Type */}
              <div className="border border-gray-100 rounded-xl p-4 md:p-5 bg-white shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center flex-shrink-0">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-gray-800">House Type</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {houseTypes.map((type) => {
                    const isSelected = selectedHouseType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedHouseType(selectedHouseType === type ? "" : type)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-primary to-secondary border-transparent text-white shadow-xs"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Split Features & Facilities */}
            <div className="flex flex-col gap-5">
              {/* Features */}
              {dbFeatures.length > 0 && (
                <div className="border border-gray-100 rounded-xl p-4 md:p-5 bg-white shadow-xs">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 fill-white" />
                    </div>
                    <span className="font-bold text-sm text-gray-800">Features</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dbFeatures.map((feat) => {
                      const isChecked = selectedAmenities.includes(feat.name.toLowerCase());
                      return (
                        <button
                          key={feat.id}
                          type="button"
                          onClick={() => toggleAmenity(feat.name)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center transition-all duration-200 cursor-pointer ${
                            isChecked
                              ? "bg-gradient-to-r from-primary to-secondary border-transparent text-white shadow-xs"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {getAmenityIcon(feat.name)}
                          {feat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {dbFacilities.length > 0 && (
                <div className="border border-gray-100 rounded-xl p-4 md:p-5 bg-white shadow-xs">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center flex-shrink-0">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm text-gray-800">Facilities</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dbFacilities.map((fac) => {
                      const isChecked = selectedAmenities.includes(fac.name.toLowerCase());
                      return (
                        <button
                          key={fac.id}
                          type="button"
                          onClick={() => toggleAmenity(fac.name)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center transition-all duration-200 cursor-pointer ${
                            isChecked
                              ? "bg-gradient-to-r from-primary to-secondary border-transparent text-white shadow-xs"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {getAmenityIcon(fac.name)}
                          {fac.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex flex-col items-center mt-6 pt-4 border-t border-gray-100 gap-3">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={handleBack}
              className="px-6 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 font-bold text-xs text-gray-600 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft size={15} />
              Back
            </button>

            <Button
              onClick={handleNext}
              variant={"gradient"}
              className="rounded-xl text-white font-bold text-xs h-10 px-6 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {step === 1 ? "Next" : "show properties"}
              <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
