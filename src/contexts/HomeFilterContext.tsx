"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type PriceRangeOption = {
  id: string;
  label: string;
  min: number;
  max: number;
};

export const PRICE_RANGES: PriceRangeOption[] = [
  { id: "1L-25L", label: "1 L - 25 L", min: 100000, max: 2500000 },
  { id: "25L-50L", label: "25 L - 50 L", min: 2500000, max: 5000000 },
  { id: "50L-75L", label: "50 L - 75 L", min: 5000000, max: 7500000 },
  { id: "75L-1Cr", label: "75 L - 1 Crore", min: 7500000, max: 10000000 },
  { id: "1Cr+", label: "1 Crore +", min: 10000000, max: Infinity },
];

export type PageFilterValues = {
  activeTab: "sell" | "rent";
  activeCategory: string;
  city: string;
  keyword: string;
  location: string;
  categoryType: string;
  minPrice?: string;
  maxPrice: string;
  priceRanges?: string;
  minArea?: string;
  maxArea: string;
  amenities: string;
  facilities?: string;
  houseType?: string;
  furnishingType?: string;
  sortBy?: string;
};

export const defaultFilterValues: PageFilterValues = {
  activeTab: "sell",
  activeCategory: "all",
  city: "chennai",
  keyword: "",
  location: "",
  categoryType: "",
  minPrice: "",
  maxPrice: "",
  priceRanges: "",
  minArea: "",
  maxArea: "",
  amenities: "",
  facilities: "",
  houseType: "",
  furnishingType: "",
  sortBy: "",
};

type PageFilterContextType = {
  filters: PageFilterValues;
  setFilters: (filters: PageFilterValues) => void;
};

const PageFilterContext = createContext<PageFilterContextType>({
  filters: defaultFilterValues,
  setFilters: () => {},
});

export function PageFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<PageFilterValues>(defaultFilterValues);
  return (
    <PageFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </PageFilterContext.Provider>
  );
}

export function usePageFilter() {
  return useContext(PageFilterContext);
}

export { PageFilterProvider as HomeFilterProvider };
export const useHomeFilter = usePageFilter;
export type HomeFilterValues = PageFilterValues;
