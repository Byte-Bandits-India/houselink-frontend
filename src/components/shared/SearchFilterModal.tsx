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
import PriceInWords from "./PriceInWords";

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
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [regionInput, setRegionInput] = useState("");
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
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
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

  // Location cleaning and deduplication helper
  const cleanLocationItem = (loc: string): string => {
    if (!loc) return "";
    let cleaned = loc
      .replace(/\b\d{6}\b/g, "")
      .replace(/\b\d{3}\s\d{3}\b/g, "")
      .trim();
    cleaned = cleaned
      .replace(
        /,\s*(india|tamil\s*nadu|kerala|karnataka|andhra\s*pradesh|telangana|maharashtra)\s*$/gi,
        "",
      )
      .replace(/,\s*chennai\s*$/gi, "")
      .trim();
    const parts = cleaned.split(",").map((p) => p.trim()).filter(Boolean);
    return parts[0] || cleaned;
  };

  const fetchLocationSuggestions = async (
    searchQuery: string,
    currentPurpose: string = purpose,
  ) => {
    try {
      setIsLoadingSuggestions(true);
      const list = await getLocationSuggestions(searchQuery, currentPurpose);
      const seen = new Set<string>();
      const deduped: string[] = [];
      for (const item of list) {
        const cleaned = cleanLocationItem(item);
        if (cleaned && cleaned.length >= 2) {
          const lower = cleaned.toLowerCase();
          if (!seen.has(lower)) {
            seen.add(lower);
            deduped.push(cleaned);
          }
        }
      }
      setSuggestions(deduped);
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
      const initialLocs = (initialLocation || initialKeyword || "")
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);
      setSelectedLocations(initialLocs);
      setRegionInput("");
      setCategory("");
      setRegionError(false);
      setShowRegionSuggestions(false);
      setHighlightedIndex(-1);
      setMinPrice("");
      setMaxPrice("");
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

  // Load backend categories dynamically based on selected purpose
  useEffect(() => {
    getPropertyCategories({ for: purpose })
      .then((res) => {
        if (res?.success) setCategoriesList(res.data || []);
      })
      .catch((err) =>
        console.error("Error loading categories for purpose:", err),
      );
  }, [purpose]);

  // Load backend features & facilities
  useEffect(() => {
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

  const handleAddLocationTag = (loc: string) => {
    const trimmed = loc.trim();
    if (!trimmed) return;
    const exists = selectedLocations.some(
      (l) => l.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!exists) {
      setSelectedLocations((prev) => [...prev, trimmed]);
    }
    setRegionInput("");
    setRegionError(false);
    setHighlightedIndex(-1);
    fetchLocationSuggestions("", purpose);
    inputRef.current?.focus();
  };

  const handleRemoveLocationTag = (locToRemove: string) => {
    setSelectedLocations((prev) =>
      prev.filter((l) => l.toLowerCase() !== locToRemove.toLowerCase()),
    );
  };

  const handleToggleLocationSuggestion = (loc: string) => {
    const trimmed = loc.trim();
    const exists = selectedLocations.some(
      (l) => l.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) {
      handleRemoveLocationTag(trimmed);
    } else {
      handleAddLocationTag(trimmed);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      const effectiveLocs = [
        ...selectedLocations,
        ...(regionInput.trim() ? [regionInput.trim()] : []),
      ];
      if (effectiveLocs.length === 0) {
        setRegionError(true);
        return;
      }
      if (
        regionInput.trim() &&
        !selectedLocations.some(
          (l) => l.toLowerCase() === regionInput.trim().toLowerCase(),
        )
      ) {
        setSelectedLocations((prev) => [...prev, regionInput.trim()]);
        setRegionInput("");
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
    fetchLocationSuggestions(regionInput, purpose);
  };

  const handleRegionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(",")) {
      const parts = val.split(",").map((p) => p.trim()).filter(Boolean);
      parts.forEach((p) => handleAddLocationTag(p));
      setRegionInput("");
      return;
    }

    setRegionInput(val);
    if (val.trim() || selectedLocations.length > 0) {
      setRegionError(false);
    }
    setShowRegionSuggestions(true);
    setHighlightedIndex(-1);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchLocationSuggestions(val, purpose);
    }, 200);
  };

  const handleClearLocations = () => {
    if (regionInput) {
      setRegionInput("");
    } else {
      setSelectedLocations([]);
    }
    setRegionError(false);
    setHighlightedIndex(-1);
    fetchLocationSuggestions("", purpose);
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
      e.preventDefault();
      if (
        showRegionSuggestions &&
        highlightedIndex >= 0 &&
        suggestions[highlightedIndex]
      ) {
        handleToggleLocationSuggestion(suggestions[highlightedIndex]);
      } else if (regionInput.trim()) {
        handleAddLocationTag(regionInput.trim());
      } else {
        setShowRegionSuggestions(false);
      }
    } else if (
      e.key === "Backspace" &&
      !regionInput &&
      selectedLocations.length > 0
    ) {
      setSelectedLocations((prev) => prev.slice(0, -1));
    } else if (e.key === "Escape") {
      setShowRegionSuggestions(false);
    }
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
  };

  const handleSubmit = () => {
    const allLocs = [
      ...selectedLocations,
      ...(regionInput.trim() ? [regionInput.trim()] : []),
    ];
    const locString = allLocs.join(",");
    onSearch({
      keyword: undefined,
      location: locString || undefined,
      property_purpose: purpose,
      min_price: minPrice.trim() || undefined,
      max_price: maxPrice.trim() || undefined,
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
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Property Purpose
              </label>
              <div className="w-[200px]">
                <PropertyTypeSwitch
                  activeTab={purpose}
                  onChange={(val) => {
                    setPurpose(val);
                    fetchLocationSuggestions(regionInput, val);
                  }}
                  variant="header"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                Property Region / Location{" "}
                <span className="text-red-500">*</span>
              </label>

              <div ref={regionContainerRef} className="relative w-full">
                <div
                  className={`relative flex items-center flex-wrap gap-1.5 w-full bg-gray-50 border rounded-xl min-h-[44px] py-1.5 px-3 transition-all duration-200 focus-within:bg-white focus-within:ring-2 cursor-pointer ${
                    regionError
                      ? "border-red-500 focus-within:ring-red-200"
                      : "border-gray-200 focus-within:border-primary focus-within:ring-primary/20"
                  }`}
                  onClick={() => {
                    inputRef.current?.focus();
                    handleOpenSuggestions();
                  }}
                >
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mr-1 pointer-events-none" />

                  {/* Active Location Tag Chips */}
                  {selectedLocations.map((loc) => (
                    <span
                      key={loc}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs shrink-0 animate-in fade-in"
                    >
                      <span>{loc}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLocationTag(loc);
                        }}
                        className="hover:opacity-75 rounded-full p-0.5 ml-0.5 cursor-pointer"
                        title="Remove location"
                      >
                        <X size={11} className="stroke-[2.5px]" />
                      </button>
                    </span>
                  ))}

                  <input
                    ref={inputRef}
                    type="text"
                    value={regionInput}
                    onChange={handleRegionInputChange}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSuggestions();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      selectedLocations.length === 0
                        ? "Search or enter location (e.g. Adyar, Guindy)..."
                        : "Add location..."
                    }
                    className="flex-1 min-w-[120px] bg-transparent text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none cursor-text py-0.5"
                  />
                  {isLoadingSuggestions ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0 ml-auto" />
                  ) : selectedLocations.length > 0 || regionInput ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearLocations();
                      }}
                      className="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 transition-colors flex-shrink-0 ml-auto cursor-pointer"
                      title={regionInput ? "Clear input" : "Clear all locations"}
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
                          const isSelected = selectedLocations.some(
                            (l) => l.toLowerCase() === loc.toLowerCase(),
                          );
                          return (
                            <button
                              key={`${loc}-${idx}`}
                              type="button"
                              onClick={() => handleToggleLocationSuggestion(loc)}
                              onMouseEnter={() => setHighlightedIndex(idx)}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left cursor-pointer ${
                                isSelected
                                  ? "bg-blue-50 text-blue-700 font-bold"
                                  : isHighlighted
                                  ? "bg-gray-100 text-gray-900"
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
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 ml-2 stroke-[3px]" />
                              ) : (
                                <span className="text-[10px] text-gray-400 font-medium">
                                  + Tag
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-3 px-3 text-center text-xs text-gray-500">
                        {regionInput.trim() ? (
                          <p>
                            No properties listed in{" "}
                            <span className="font-semibold text-gray-700">
                              "{regionInput}"
                            </span>{" "}
                            yet.
                            <span className="block text-[11px] text-gray-400 mt-0.5">
                              Press Enter to add this location tag anyway.
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
                  Please enter or select at least one location to proceed.
                </span>
              )}
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

              {/* Price Range Integer Inputs */}
              <div className="border border-slate-100 rounded-xl p-4 md:p-5 bg-white shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center flex-shrink-0">
                    <IndianRupee className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <span className="font-medium text-sm text-gray-800">
                    Price Range (₹)
                  </span>
                </div>

                <div className="flex flex-col gap-3.5">
                  {/* Min Price Field */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[12px] font-bold text-gray-700">
                        Min Price (₹)
                      </label>
                      <PriceInWords amount={minPrice} variant="badge" />
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-gray-400 text-xs font-bold pointer-events-none select-none">
                        ₹
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={minPrice}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setMinPrice(val);
                        }}
                        placeholder="e.g. 1000000"
                        className="w-full pl-7 pr-7 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 text-gray-800"
                      />
                      {minPrice && (
                        <button
                          type="button"
                          onClick={() => setMinPrice("")}
                          className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                          title="Clear Min Price"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    <PriceInWords amount={minPrice} variant="full" />
                  </div>

                  {/* Max Price Field */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[12px] font-bold text-gray-700">
                        Max Price (₹)
                      </label>
                      <PriceInWords amount={maxPrice} variant="badge" />
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-gray-400 text-xs font-bold pointer-events-none select-none">
                        ₹
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={maxPrice}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setMaxPrice(val);
                        }}
                        placeholder="e.g. 5000000"
                        className="w-full pl-7 pr-7 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 text-gray-800"
                      />
                      {maxPrice && (
                        <button
                          type="button"
                          onClick={() => setMaxPrice("")}
                          className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                          title="Clear Max Price"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    <PriceInWords amount={maxPrice} variant="full" />
                  </div>
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
