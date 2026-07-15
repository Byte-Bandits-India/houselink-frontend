"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStates, getCities, getFeatures, recordSearch, getSearches, getPopularProperties, getPopularRegions, tokenStore } from "@/lib/api";
import type { SearchApiItem, PopularPropertyApiItem, PopularRegionApiItem } from "@/lib/api";
import { useHomeFilter } from "@/contexts/HomeFilterContext";
import ActionSearchBar from "@/components/kokonutui/action-search-bar";
import PropertyTypeSwitch from "./PropertyTypeSwitch";
import SearchFilterModal from "./SearchFilterModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_TOP_SEARCHES = [
  { id: -1, query: "2 BHK apartment in Adyar", count: 1 },
  { id: -2, query: "Flats in porur", count: 1 },
  { id: -3, query: "Lands in Kundrathur", count: 1 },
  { id: -4, query: "3 BHK Villas in ECR", count: 1 },
];

const categories = [
  { id: "all", name: "All" },
  { id: "plots", name: "Plots" },
  { id: "apartments", name: "Apartments" },
  { id: "villas", name: "Villas" },
  { id: "house", name: "Individual House" },
  { id: "commercial", name: "Commercial Property" },
];

const cities = [
  { value: "chennai", label: "Chennai" },
  { value: "bangalore", label: "Bangalore" },
  { value: "mumbai", label: "Mumbai" },
  { value: "hyderabad", label: "Hyderabad" },
];

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

const propertyCategories = [
  { value: "plots", label: "Plots" },
  { value: "apartments", label: "Apartments" },
  { value: "villas", label: "Villas" },
  { value: "house", label: "Individual House" },
  { value: "commercial", label: "Commercial Properties" },
];

/* ── Controlled select ── */
function NativeSelect({
  options,
  placeholder,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-transparent border-none outline-none text-sm text-gray-800 font-medium pr-5 cursor-pointer"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}

/* ── Reusable field wrapper ── */
function Field({
  label,
  divider = true,
  children,
  className,
}: {
  label: string;
  divider?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center px-4 py-2",
        divider && "border-r border-gray-200",
        className
      )}
    >
      <p className="text-[16px] font-medium text-black tracking-wide mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}

export default function PropertySearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters: homeFilters, setFilters } = useHomeFilter();

  const isListingPage = ["/", "/properties", "/properties/featured", "/properties/owner"].includes(pathname);
  const isHomePage = pathname === "/";
  // basePath only matters for non-listing pages (e.g., a blog page clicking Search → go to /properties)
  const basePath = isListingPage ? pathname : "/properties";

  const scrollToResults = () => {
    if (isHomePage) {
      setTimeout(() => {
        const el = document.getElementById("featured-properties");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else if (isListingPage) {
      // On other listing pages just scroll to the top of the results area
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    }
  };

  // State initialized from URL query params (browser execution only)
  const [activeTab, setActiveTab] = useState("sell");
  const [activeCategory, setActiveCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceRange, setPriceRange] = useState(100);
  const [areaRange, setAreaRange] = useState(100000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [citiesList, setCitiesList] = useState<{ value: string; label: string }[]>(cities);
  const [amenityList, setAmenityList] = useState<string[]>(defaultAmenities);
  const [recentSearches, setRecentSearches] = useState<SearchApiItem[]>([]);
  const [popularProperties, setPopularProperties] = useState<PopularPropertyApiItem[]>([]);
  const [popularRegions, setPopularRegions] = useState<PopularRegionApiItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Typewriter placeholder animation
  const [placeholderText, setPlaceholderText] = useState("Search for properties in Chennai...");
  useEffect(() => {
    const placeholderSequences = [
      "Search for properties in Chennai...",
      "2 BHK Apartment in Guindy...",
      "Office Space in OMR...",
      "Luxury Villa in ECR...",
      "Independent House in Adyar...",
    ];

    let sequenceIndex = 0;
    let charIndex = placeholderSequences[0].length;
    let isDeleting = true;
    let timeoutId: NodeJS.Timeout;

    const runTypewriter = () => {
      const currentText = placeholderSequences[sequenceIndex];
      
      if (isDeleting) {
        if (charIndex > 0) {
          charIndex--;
          setPlaceholderText(currentText.slice(0, charIndex));
          timeoutId = setTimeout(runTypewriter, 30);
        } else {
          isDeleting = false;
          sequenceIndex = (sequenceIndex + 1) % placeholderSequences.length;
          timeoutId = setTimeout(runTypewriter, 150); // transition delay
        }
      } else {
        if (charIndex < currentText.length) {
          charIndex++;
          setPlaceholderText(currentText.slice(0, charIndex));
          timeoutId = setTimeout(runTypewriter, 60);
        } else {
          // Pause before starting deletion
          timeoutId = setTimeout(() => {
            isDeleting = true;
            runTypewriter();
          }, 1500);
        }
      }
    };

    timeoutId = setTimeout(runTypewriter, 1500);

    return () => clearTimeout(timeoutId);
  }, []);

  // ── Sync local state FROM context (home page only) ────────────────────────
  // This keeps PropertySearch in sync when FeaturedProperties (or any other
  // consumer) updates the shared HomeFilterContext.
  useEffect(() => {
    if (!isHomePage) return;
    setActiveTab(homeFilters.activeTab);
    setActiveCategory(homeFilters.activeCategory);
    setCity(homeFilters.city);
    setKeyword(homeFilters.keyword);
    setLocation(homeFilters.location);
    setCategoryType(homeFilters.categoryType);
    if (homeFilters.maxPrice) {
      setShowAdvanced(true);
      setPriceRange(Number(homeFilters.maxPrice) / 10000000);
    }
    if (homeFilters.maxArea) {
      setShowAdvanced(true);
      setAreaRange(Number(homeFilters.maxArea));
    }
    if (homeFilters.amenities) {
      setShowAdvanced(true);
      setSelectedAmenities(homeFilters.amenities.split(","));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeFilters]);

  useEffect(() => {
    async function loadBackendData() {
      try {
        const statesRes = await getStates();
        if (statesRes.success && statesRes.data) {
          const list: { value: string; label: string }[] = [];
          for (const state of statesRes.data) {
            const citiesRes = await getCities(Number(state.id));
            if (citiesRes.success && citiesRes.data) {
              citiesRes.data.forEach((c) => {
                if (!list.some(item => item.value === c.name.toLowerCase())) {
                  list.push({
                    value: c.name.toLowerCase(),
                    label: c.name,
                  });
                }
              });
            }
          }
          if (list.length > 0) {
            setCitiesList(list);
          }
        }
      } catch (e) {
        console.error("Failed to load cities from backend, using fallback:", e);
      }

      try {
        const featuresRes = await getFeatures();
        if (featuresRes.success && featuresRes.data) {
          const list = featuresRes.data.map(f => f.name);
          if (list.length > 0) {
            setAmenityList(list);
          }
        }
      } catch (e) {
        console.error("Failed to load features from backend, using fallback:", e);
      }

      try {
        const searchesRes = await getSearches();
        console.log("PropertySearch: getSearches response:", searchesRes);
        if (searchesRes.success && searchesRes.data) {
          if (searchesRes.data.length > 0) {
            const sorted = [...searchesRes.data].sort((a, b) => {
              const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
              const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
              if (timeA !== timeB) return timeB - timeA;
              return b.id - a.id;
            });
            setRecentSearches(sorted);
          } else {
            setRecentSearches(DEFAULT_TOP_SEARCHES);
          }
        } else {
          setRecentSearches(DEFAULT_TOP_SEARCHES);
        }
      } catch (e) {
        console.error("Failed to load searches from backend:", e);
        setRecentSearches(DEFAULT_TOP_SEARCHES);
      }

      try {
        const propsRes = await getPopularProperties();
        if (Array.isArray(propsRes)) {
          setPopularProperties(propsRes);
        }
      } catch (e) {
        console.error("Failed to load popular properties:", e);
      }

      try {
        const regionsRes = await getPopularRegions();
        if (Array.isArray(regionsRes)) {
          setPopularRegions(regionsRes);
        }
      } catch (e) {
        console.error("Failed to load popular regions:", e);
      }
    }
    loadBackendData();
  }, []);

  useEffect(() => {
    if (searchParams) {
      setActiveTab(searchParams.get("property_purpose") || "sell");
      setActiveCategory(searchParams.get("category") || "all");
      setKeyword(searchParams.get("keyword") || "");
      setLocation(searchParams.get("location") || "");
      setCity(searchParams.get("city") || "");
      setCategoryType(searchParams.get("category_type") || "");
      
      const hasMaxPrice = searchParams.get("max_price");
      const hasMaxArea = searchParams.get("max_area");
      const hasAmenities = searchParams.get("amenities");
      
      if (hasMaxPrice || hasMaxArea || hasAmenities) {
        setShowAdvanced(true);
        if (hasMaxPrice) setPriceRange(Number(hasMaxPrice) / 10000000);
        if (hasMaxArea) setAreaRange(Number(hasMaxArea));
        if (hasAmenities) setSelectedAmenities(hasAmenities.split(","));
      } else {
        setShowAdvanced(false);
        setPriceRange(100);
        setAreaRange(100000);
        setSelectedAmenities([]);
      }
    }
  }, [searchParams]);

  const handleSearch = (overrides?: {
    keyword?: string;
    location?: string;
    category?: string;
    city?: string;
    amenities?: string[];
    fromModal?: boolean;
    property_purpose?: "sell" | "rent";
    max_price?: string;
    max_area?: string;
    house_type?: string;
  }) => {
    const searchKeyword = overrides && overrides.keyword !== undefined ? overrides.keyword : keyword;
    const searchLocation = overrides && overrides.location !== undefined ? overrides.location : location;
    const searchCategory = overrides && overrides.category !== undefined ? overrides.category : activeCategory;
    const searchCity = overrides && overrides.city !== undefined ? overrides.city : city;
    const searchAmenities = overrides && overrides.amenities !== undefined ? overrides.amenities : selectedAmenities;
    const searchPurpose = overrides && overrides.property_purpose !== undefined ? overrides.property_purpose : activeTab;
    const searchMaxPrice = overrides && overrides.max_price !== undefined ? overrides.max_price : (showAdvanced ? String(priceRange * 10000000) : "");
    const searchMaxArea = overrides && overrides.max_area !== undefined ? overrides.max_area : (showAdvanced ? String(areaRange) : "");
    const searchHouseType = overrides && overrides.house_type !== undefined ? overrides.house_type : "";

    const q = searchKeyword.trim().toLowerCase();
    const isSearching = q.length > 0;
    const fromModal = overrides && overrides.fromModal;

    const hasLocationFilter = overrides && overrides.location !== undefined;
    const hasCategoryFilter = overrides && overrides.category !== undefined;
    const hasCityFilter = overrides && overrides.city !== undefined;
    const hasAmenityFilter = overrides && overrides.amenities !== undefined;
    const isTargetedSearch = hasLocationFilter || hasCategoryFilter || hasCityFilter || hasAmenityFilter;

    if (isHomePage && !fromModal && !isTargetedSearch) {
      if (!isSearching) {
        setIsModalOpen(true);
        return;
      }

      const propertyCategories = ["plots", "apartments", "villas", "house", "commercial"];
      const defaultAmenitiesList = ["wifi", "swimming pool", "security", "garden", "balcony", "air conditioning", "fitness center", "car parking", "bike parking"];
      
      const hasSuggestions =
        popularProperties.some((p) => p.title.toLowerCase().includes(q)) ||
        popularRegions.some((r) => r.name.toLowerCase().includes(q)) ||
        ["chennai", "bangalore", "mumbai", "hyderabad"].some((c) => c.includes(q)) ||
        recentSearches.some((s) => s.query.toLowerCase().includes(q)) ||
        propertyCategories.some((c) => c.includes(q)) ||
        defaultAmenitiesList.some((a) => a.includes(q));

      if (!hasSuggestions) {
        setIsModalOpen(true);
        return;
      }
    }

    if (searchKeyword && searchKeyword.trim()) {
      const trimmed = searchKeyword.trim();
      recordSearch(trimmed).catch((err) => console.error("Error recording search query:", err));
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s.query.toLowerCase() !== trimmed.toLowerCase());
        return [{ id: Date.now(), query: trimmed, updatedAt: new Date().toISOString() }, ...filtered].slice(0, 6);
      });
    }

    const params = new URLSearchParams();
    params.set("property_purpose", searchPurpose);
    if (searchCity) params.set("city", searchCity);
    if (searchKeyword) params.set("keyword", searchKeyword);
    if (searchLocation) params.set("location", searchLocation);
    if (categoryType) params.set("category_type", categoryType);
    if (searchCategory !== "all") params.set("category", searchCategory);

    const hasAdvanced = showAdvanced || (overrides && overrides.amenities !== undefined) || (overrides && overrides.max_price !== undefined);

    if (hasAdvanced) {
      if (searchMaxPrice) params.set("max_price", searchMaxPrice);
      if (searchMaxArea) params.set("max_area", searchMaxArea);
      if (searchAmenities.length > 0) {
        params.set("amenities", searchAmenities.join(","));
      }
    }

    if (searchHouseType) {
      params.set("house_type", searchHouseType);
    }

    if (isListingPage) {
      if (isHomePage) {
        router.push(`/properties?${params.toString()}`, { scroll: false });
      } else {
        // On all listing pages: update context, keep URL clean
        setFilters({
          activeTab: searchPurpose as "sell" | "rent",
          activeCategory: searchCategory,
          city: searchCity,
          keyword: searchKeyword,
          location: searchLocation,
          categoryType,
          maxPrice: searchMaxPrice,
          maxArea: searchMaxArea,
          amenities: searchAmenities.length > 0 ? searchAmenities.join(",") : "",
          houseType: searchHouseType,
        });
        scrollToResults();
      }
    } else {
      router.push(`${basePath}?${params.toString()}`, { scroll: false });
    }
  };

  const handleTabClick = (key: string) => {
    setActiveTab(key);
    
    let nextCategory = activeCategory;
    if (key !== "sell" && activeCategory === "plots") {
      nextCategory = "all";
      setActiveCategory("all");
    }

    if (isListingPage) {
      // On all listing pages: update context only, keep URL clean
      setFilters({
        activeTab: key as "sell" | "rent",
        activeCategory: nextCategory,
        city,
        keyword,
        location,
        categoryType,
        maxPrice: showAdvanced ? String(priceRange * 10000000) : "",
        maxArea: showAdvanced ? String(areaRange) : "",
        amenities: showAdvanced && selectedAmenities.length > 0 ? selectedAmenities.join(",") : "",
        houseType: "",
      });
      return;
    }

    const params = new URLSearchParams();
    params.set("property_purpose", key);
    if (city) params.set("city", city);
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    if (categoryType) params.set("category_type", categoryType);
    if (nextCategory !== "all") params.set("category", nextCategory);

    if (showAdvanced) {
      params.set("max_price", String(priceRange * 10000000));
      params.set("max_area", String(areaRange));
      if (selectedAmenities.length > 0) {
        params.set("amenities", selectedAmenities.join(","));
      }
    }
    
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  const handleCategoryNavClick = (catId: string) => {
    setActiveCategory(catId);

    if (isListingPage) {
      // On all listing pages: update context only, keep URL clean
      setFilters({
        activeTab: activeTab as "sell" | "rent",
        activeCategory: catId,
        city,
        keyword,
        location,
        categoryType,
        maxPrice: showAdvanced ? String(priceRange * 10000000) : "",
        maxArea: showAdvanced ? String(areaRange) : "",
        amenities: showAdvanced && selectedAmenities.length > 0 ? selectedAmenities.join(",") : "",
        houseType: "",
      });
      return;
    }
    
    const params = new URLSearchParams();
    params.set("property_purpose", activeTab);
    if (city) params.set("city", city);
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    if (categoryType) params.set("category_type", categoryType);
    if (catId !== "all") params.set("category", catId);

    if (showAdvanced) {
      params.set("max_price", String(priceRange * 10000000));
      params.set("max_area", String(areaRange));
      if (selectedAmenities.length > 0) {
        params.set("amenities", selectedAmenities.join(","));
      }
    }
    
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  if (isHomePage) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 z-20">
        {/* Tabs & City */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          {/* Buy / Rent Toggle */}
          <div className="w-[280px]">
            <PropertyTypeSwitch
              activeTab={activeTab as "sell" | "rent"}
              onChange={handleTabClick}
              variant="header"
            />
          </div>

          {/* City Dropdown */}
          <Select value={city || "chennai"} onValueChange={(v) => setCity(v === "chennai" ? "" : v)}>
            <SelectTrigger className="w-[160px] bg-white rounded-full px-6 py-3 h-12 shadow-sm border border-gray-100 text-sm text-gray-800 font-bold focus:ring-0 focus:ring-offset-0 focus:outline-none my-0 cursor-pointer justify-between border-solid select-none">
              <SelectValue placeholder="Chennai" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-100 rounded-2xl shadow-md duration-300 ease-out z-50">
              <SelectItem value="chennai" className="font-bold text-gray-800 cursor-pointer">Chennai</SelectItem>
              {citiesList.filter(o => o.value !== "chennai").map((o) => (
                <SelectItem key={o.value} value={o.value} className="font-bold text-gray-800 cursor-pointer">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search bar */}
        <ActionSearchBar
          keyword={keyword}
          setKeyword={setKeyword}
          placeholderText={placeholderText}
          onSearch={handleSearch}
          onSelectLocation={setLocation}
          setActiveCategory={setActiveCategory}
          setCity={setCity}
          setShowAdvanced={setShowAdvanced}
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
        />

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 mt-5">
            <span className="font-bold text-gray-600 w-full text-center mb-1 md:w-auto md:mb-0">
              {recentSearches.some((s) => s.count !== undefined) ? "Top searches:" : "Recent searches:"}
            </span>
            {recentSearches.slice(0, 6).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setKeyword(item.query);
                  setCity("chennai");
                  handleSearch({ keyword: item.query, city: "chennai" });
                }}
                className="flex items-center gap-1.5 bg-white/70 hover:bg-white text-gray-600 px-3.5 py-1.5 rounded-full border border-gray-200/85 transition-colors shadow-sm cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item.query}
              </button>
            ))}
          </div>
        )}
        
        <SearchFilterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialKeyword={keyword}
          initialPurpose={activeTab as "sell" | "rent"}
          onSearch={(modalFilters) => {
            handleSearch({
              ...modalFilters,
              fromModal: true,
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1240px] mx-auto mb-10 relative z-20 -mt-24">

      {/* ── Tabs ── */}
      <div className="flex justify-center gap-2">
        {[
          { key: "sell", label: "For Sale" },
          { key: "rent", label: "Rent / Lease" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleTabClick(key)}
            className={cn(
              "min-w-[130px] px-6 py-4 text-[15px] font-bold transition-all duration-200 backdrop-blur-lg rounded-t-xl",
              activeTab === key
                ? "bg-white text-[#153e75] shadow-[0_-2px_8px_rgba(0,0,0,0.06)]"
                : "bg-white/5 text-white hover:border-2 hover:border-white/50 hover:bg-white/20"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Search Card ── */}
      <div className="bg-white rounded-2xl rounded-tr-2xl shadow-[rgb(38,57,77)_0px_20px_30px_-10px] px-5 py-6">

        {/* Main form row */}
        <div className="flex flex-wrap items-stretch gap-y-2">

          {/* City */}
          <Field label="City" className="flex-[1_1_120px]">
            <NativeSelect
              options={citiesList}
              placeholder="Select City"
              value={city}
              onChange={setCity}
            />
          </Field>

          {/* Keyword */}
          <Field label="Keyword" className="flex-[1.5_1_160px]">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search for keyword"
              className="bg-transparent border-none outline-none text-base text-black placeholder:text-black font-medium py-0.5"
            />
          </Field>

          {/* Location */}
          <Field label="Location" className="flex-[2_1_200px]">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="bg-transparent border-none outline-none text-sm text-black placeholder:text-black font-medium py-0.5"
            />
          </Field>

          {/* Category */}
          <Field label="Category" divider={false} className="flex-[1.2_1_140px]">
            <NativeSelect
              options={activeTab === "sell" ? propertyCategories : propertyCategories.filter(cat => cat.value !== "plots")}
              placeholder="Select Category"
              value={activeCategory === "all" ? "" : activeCategory}
              onChange={setActiveCategory}
            />
          </Field>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pl-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                "flex items-center gap-1.5 px-4 h-[42px] border rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap",
                showAdvanced
                  ? "border-[#153e75] text-[#153e75] bg-[#eaf0fb]"
                  : "border-gray-300 text-gray-600 bg-white hover:border-[#153e75] hover:text-[#153e75]"
              )}
            >
              <SlidersHorizontal size={14} />
              Advanced
            </button>

            <button
              type="button"
              onClick={() => handleSearch()}
              className="flex items-center gap-1.5 px-6 h-[42px] bg-[#153e75] hover:bg-[#1a4d8f] text-white text-sm font-semibold rounded-lg shadow-[0_4px_12px_rgba(21,62,117,0.3)] transition-colors duration-200 whitespace-nowrap"
            >
              <Search size={14} />
              Search
            </button>
          </div>
        </div>

        {/* ── Advanced Filters ── */}
        {showAdvanced && (
          <div className="pt-5 mt-4 border-t border-gray-100 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {/* Price Range */}
              <div>
                <p className="text-[13px] font-medium text-gray-500 mb-3 flex items-center gap-2">
                  Price Range <span className="text-[#153e75] font-bold">up to ₹{priceRange} Cr</span>
                </p>
                <input
                  type="range"
                  min={0.1}
                  max={100}
                  step={0.1}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#153e75]"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>₹0.1 Cr</span>
                  <span>₹100 Cr</span>
                </div>
              </div>

              {/* Square Range */}
              <div>
                <p className="text-[13px] font-medium text-gray-500 mb-3 flex items-center gap-2">
                  Square Range <span className="text-[#153e75] font-bold">up to {areaRange.toLocaleString()} Sq.Ft</span>
                </p>
                <input
                  type="range"
                  min={100}
                  max={100000}
                  step={100}
                  value={areaRange}
                  onChange={(e) => setAreaRange(Number(e.target.value))}
                  className="w-full accent-[#153e75]"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>100 Sq.Ft</span>
                  <span>100,000 Sq.Ft</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-5 gap-x-4 mt-2">
              {amenityList.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => {
                      setSelectedAmenities((prev) =>
                        prev.includes(amenity)
                          ? prev.filter((a) => a !== amenity)
                          : [...prev, amenity]
                      );
                    }}
                    className="w-[15px] h-[15px] rounded-[3px] border-gray-300 text-[#153e75] focus:ring-[#153e75] accent-[#153e75]"
                  />
                  <span className="text-[13px] text-gray-500 font-medium group-hover:text-gray-800 transition-colors">{amenity}</span>
                </label>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* ── Category Nav ── */}
      <div className="flex justify-center gap-7 mt-9 flex-wrap">
        {categories.filter(cat => activeTab === "sell" || cat.id !== "plots").map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryNavClick(cat.id)}
            className={cn(
              "pb-1.5 text-[15px] font-medium border-b-[2.5px] transition-all duration-200 whitespace-nowrap",
              activeCategory === cat.id
                ? "border-[#153e75] text-[#153e75] font-semibold"
                : "border-transparent text-gray-500 hover:text-[#153e75] hover:border-[#153e75]/30"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <SearchFilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialKeyword={keyword}
        initialPurpose={activeTab as "sell" | "rent"}
        onSearch={(modalFilters) => {
          handleSearch({
            ...modalFilters,
            fromModal: true,
          });
        }}
      />

    </div>
  );
}