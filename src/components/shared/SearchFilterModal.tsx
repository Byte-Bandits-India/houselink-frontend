"use client";

import { useState, useEffect, useRef } from "react";
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
  MapPin,
  X,
  Loader2,
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
import {
  getLocationSuggestions,
  getFeatures,
  getFacilities,
  getPropertyCategories,
} from "@/lib/api";
import { Button } from "../ui/button";

import { SearchFilterModalProps } from "@/types/components";

const houseTypes = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK", "1 RK"];

// Helper mapping for amenities names to icons dynamically
const getAmenityIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet"))
    return <Wifi className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  if (lower.includes("pool") || lower.includes("swim"))
    return <Waves className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  if (lower.includes("security") || lower.includes("guard"))
    return <Shield className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  if (lower.includes("balcony"))
    return <Building className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  if (
    lower.includes("ac") ||
    lower.includes("conditioning") ||
    lower.includes("air")
  )
    return <Wind className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  if (
    lower.includes("garden") ||
    lower.includes("park") ||
    lower.includes("lawn")
  )
    return <Leaf className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  if (
    lower.includes("gym") ||
    lower.includes("fitness") ||
    lower.includes("center")
  )
    return <Dumbbell className="w-4 h-4 mr-1.5 flex-shrink-0" />;
  return <Check className="w-4 h-4 mr-1.5 flex-shrink-0" />;
};

export default function SearchFilterModal({
  isOpen,
  onClose,
  initialKeyword,
  initialLocation,
  initialPurpose,
  onSearch,
}: SearchFilterModalProps) {
  const [step, setStep] = useState(1);

  // Step 1 States
  const [region, setRegion] = useState("");
  const [purpose, setPurpose] = useState<"sell" | "rent">(initialPurpose);
  const [category, setCategory] = useState("");
  const [categoriesList, setCategoriesList] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [regionError, setRegionError] = useState(false);

  // Location suggestions state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showRegionSuggestions, setShowRegionSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const regionContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Step 2 States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1]); // in Crores
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 10000]); // in sq.ft.
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedHouseType, setSelectedHouseType] = useState<string>("");

  // Backend Features & Facilities
  const [dbFeatures, setDbFeatures] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [dbFacilities, setDbFacilities] = useState<
    Array<{ id: number; name: string }>
  >([]);

  const fetchLocationSuggestions = async (searchQuery: string) => {
    try {
      setIsLoadingSuggestions(true);
      const list = await getLocationSuggestions(searchQuery);
      setSuggestions(list);
    } catch (err) {
      console.error("Error fetching location suggestions:", err);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Sync initial states when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPurpose(initialPurpose);
      setRegion(initialLocation || initialKeyword || "");
      setCategory("");
      setRegionError(false);
      setShowRegionSuggestions(false);
      setHighlightedIndex(-1);
      setPriceRange([0, 1]);
      setAreaRange([0, 10000]);
      setSelectedAmenities([]);
      setSelectedHouseType("");
    }
  }, [isOpen, initialPurpose, initialKeyword, initialLocation]);

  // Click outside listener to close suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        regionContainerRef.current &&
        !regionContainerRef.current.contains(e.target as Node)
      ) {
        setShowRegionSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Load backend filter metadata
  useEffect(() => {
    getPropertyCategories()
      .then((res) => {
        if (res?.success) setCategoriesList(res.data || []);
      })
      .catch((err) => console.error("Error loading categories:", err));

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
      if (!region.trim()) {
        setRegionError(true);
        return;
      }
      setRegionError(false);
      setShowRegionSuggestions(false);
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
      prev.includes(lowerName)
        ? prev.filter((a) => a !== lowerName)
        : [...prev, lowerName],
    );
  };

  const handleOpenSuggestions = () => {
    setShowRegionSuggestions(true);
    if (suggestions.length === 0) {
      fetchLocationSuggestions(region);
    }
  };

  const handleRegionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRegion(val);
    if (val.trim()) {
      setRegionError(false);
    }
    setShowRegionSuggestions(true);
    setHighlightedIndex(-1);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchLocationSuggestions(val);
    }, 200);
  };

  const handleSelectSuggestion = (loc: string) => {
    setRegion(loc);
    setShowRegionSuggestions(false);
    setRegionError(false);
    setHighlightedIndex(-1);
  };

  const handleClearRegion = () => {
    setRegion("");
    setRegionError(false);
    setHighlightedIndex(-1);
    fetchLocationSuggestions("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!showRegionSuggestions) {
        setShowRegionSuggestions(true);
        return;
      }
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!showRegionSuggestions) {
        setShowRegionSuggestions(true);
        return;
      }
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === "Enter") {
      if (
        showRegionSuggestions &&
        highlightedIndex >= 0 &&
        suggestions[highlightedIndex]
      ) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[highlightedIndex]);
      } else {
        setShowRegionSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowRegionSuggestions(false);
    }
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
  };

  const handleSubmit = () => {
    const loc = region.trim();
    onSearch({
      keyword: loc || initialKeyword || undefined,
      location: loc || undefined,
      property_purpose: purpose,
      max_price:
        priceRange[1] === 1 ? undefined : String(priceRange[1] * 10000000), // convert Cr to Rupees
      max_area: areaRange[1] === 10000 ? undefined : String(areaRange[1]),
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      house_type: selectedHouseType || undefined,
      category: category && category !== "all" ? category : undefined,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        className={`w-full p-6 rounded-2xl bg-white border border-gray-100 shadow-2xl select-none transition-all duration-300 ${
          step === 1
            ? "max-w-[460px] overflow-visible"
            : "max-w-[880px] overflow-hidden"
        }`}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-medium text-gray-900 tracking-tight">
            Search Filters
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          /* ─── STEP 1 ─── */
          <div className="flex flex-col gap-5 text-left pb-2 bg-white">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                Property Region / Location{" "}
                <span className="text-red-500">*</span>
              </label>

              <div ref={regionContainerRef} className="relative w-full">
                <div
                  className={`relative flex items-center w-full bg-gray-50 border rounded-xl h-11 px-3.5 transition-all duration-200 focus-within:bg-white focus-within:ring-2 cursor-pointer ${
                    regionError
                      ? "border-red-500 focus-within:ring-red-200"
                      : "border-gray-200 focus-within:border-primary focus-within:ring-primary/20"
                  }`}
                  onClick={() => {
                    inputRef.current?.focus();
                    handleOpenSuggestions();
                  }}
                >
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mr-2.5 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={region}
                    onChange={handleRegionInputChange}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSuggestions();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search or enter location (e.g. Adyar, Guindy)..."
                    className="w-full bg-transparent text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none cursor-text"
                  />
                  {isLoadingSuggestions ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0 ml-2" />
                  ) : region ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearRegion();
                      }}
                      className="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 transition-colors flex-shrink-0 ml-2 cursor-pointer"
                      title="Clear location"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>

                {showRegionSuggestions && (
                  <div className="absolute z-[70] left-0 right-0 top-[calc(100%+6px)] bg-white border border-gray-100 rounded-xl shadow-xl max-h-[220px] overflow-y-auto p-1 divide-y divide-gray-50 animate-in fade-in duration-150">
                    {isLoadingSuggestions && suggestions.length === 0 ? (
                      <div className="flex items-center justify-center py-4 text-xs font-medium text-gray-400 gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                        <span>Searching locations...</span>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <div className="py-0.5">
                        {suggestions.map((loc, idx) => {
                          const isHighlighted = idx === highlightedIndex;
                          const isSelected =
                            loc.toLowerCase() === region.toLowerCase().trim();
                          return (
                            <button
                              key={`${loc}-${idx}`}
                              type="button"
                              onClick={() => handleSelectSuggestion(loc)}
                              onMouseEnter={() => setHighlightedIndex(idx)}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left cursor-pointer ${
                                isHighlighted || isSelected
                                  ? "bg-blue-50/80 text-primary font-semibold"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                                    isSelected
                                      ? "bg-primary text-white"
                                      : "bg-blue-50 text-blue-600"
                                  }`}
                                >
                                  <MapPin className="w-3.5 h-3.5" />
                                </div>
                                <span className="truncate">{loc}</span>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-3 px-3 text-center text-xs text-gray-500">
                        {region.trim() ? (
                          <p>
                            No properties listed in{" "}
                            <span className="font-semibold text-gray-700">
                              "{region}"
                            </span>{" "}
                            yet.
                            <span className="block text-[11px] text-gray-400 mt-0.5">
                              Press Enter or Next to search this location
                              anyway.
                            </span>
                          </p>
                        ) : (
                          <p>No location suggestions available.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {regionError && (
                <span className="text-[11px] font-medium text-red-500 mt-1 block">
                  Please enter or select a region to proceed.
                </span>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
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
          <div className="visible-scrollbar bg-[#f4f7fb] border border-slate-200/70 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-5 text-left max-h-[60vh] overflow-y-scroll pr-3">
            {/* Left Column: Category, Price Range, Area Range (max-w-[300px]) */}
            <div className="flex flex-col gap-5 w-full md:max-w-[280px] md:flex-shrink-0">
              {/* Category */}
              <div className="border border-slate-100 rounded-xl p-4 md:p-5 bg-white shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center flex-shrink-0">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm text-gray-800">
                    Property Category
                  </span>
                </div>

                <div className="relative flex flex-col items-start w-full">
                  <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-full text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl h-11 px-4 my-0 focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <SelectValue placeholder="All Categories" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-[220px] z-[60]">
                      <SelectItem value="all" className="text-sm font-medium">
                        All Categories
                      </SelectItem>
                      {categoriesList.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={c.name.toLowerCase()}
                          className="text-sm font-medium"
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="border border-slate-100 rounded-xl p-4 md:p-5 bg-white shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center flex-shrink-0">
                    <IndianRupee className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <span className="font-medium text-sm text-gray-800">
                    Price Range
                  </span>
                </div>

                <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                  <span>From</span>
                  <span>To</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary mt-1"
                />

                <div className="flex justify-between text-xs font-medium text-gray-500 mt-2.5">
                  <span>₹0</span>
                  <span>
                    {priceRange[1] >= 1
                      ? `₹${priceRange[1]} Cr+`
                      : priceRange[1] === 0
                        ? "₹0"
                        : `₹${Math.round(priceRange[1] * 100)} Lakhs`}
                  </span>
                </div>
              </div>

              {/* Area Range Slider */}
              <div className="border border-slate-100 rounded-xl p-4 md:p-5 bg-white shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center flex-shrink-0">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm text-gray-800">
                    Area Range (sq.ft.)
                  </span>
                </div>

                <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
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

                <div className="flex justify-between text-xs font-medium text-gray-500 mt-2.5">
                  <span>0</span>
                  <span>{areaRange[1].toLocaleString()} sq.ft.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Features, Facilities, House Type */}
            <div className="flex flex-col gap-5 flex-1 min-w-0">
              {/* Features */}
              {dbFeatures.length > 0 && (
                <div className="border border-slate-100 rounded-xl p-4 md:p-5 bg-white shadow-xs">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 fill-white" />
                    </div>
                    <span className="font-medium text-sm text-gray-800">
                      Features
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {dbFeatures.map((feat) => {
                      const isChecked = selectedAmenities.includes(
                        feat.name.toLowerCase(),
                      );
                      return (
                        <button
                          key={feat.id}
                          type="button"
                          onClick={() => toggleAmenity(feat.name)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center transition-all duration-200 cursor-pointer ${
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
                <div className="border border-slate-100 rounded-xl p-4 md:p-5 bg-white shadow-xs">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center flex-shrink-0">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm text-gray-800">
                      Facilities
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {dbFacilities.map((fac) => {
                      const isChecked = selectedAmenities.includes(
                        fac.name.toLowerCase(),
                      );
                      return (
                        <button
                          key={fac.id}
                          type="button"
                          onClick={() => toggleAmenity(fac.name)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center transition-all duration-200 cursor-pointer ${
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

              {/* House Type */}
              <div className="border border-slate-100 rounded-xl p-4 md:p-5 bg-white shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center flex-shrink-0">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm text-gray-800">
                    House Type
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {houseTypes.map((type) => {
                    const isSelected = selectedHouseType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setSelectedHouseType(
                            selectedHouseType === type ? "" : type,
                          )
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all duration-200 cursor-pointer ${
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
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex flex-col items-center mt-5 gap-3 bg-white w-full">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={handleBack}
              className="px-6 py-2.5 rounded-[50px] border border-gray-300 bg-white hover:bg-gray-50 font-medium text-xs text-gray-600 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft size={15} />
              Back
            </button>

            <Button
              onClick={handleNext}
              variant={"gradient"}
              className="rounded-[50px] text-white font-medium text-xs h-10 px-6 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
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
