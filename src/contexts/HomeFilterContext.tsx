"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface PageFilterValues {
  activeTab: "sell" | "rent";
  activeCategory: string;
  city: string;
  keyword: string;
  location: string;
  categoryType: string;
  maxPrice: string;
  maxArea: string;
  amenities: string;
}

export const defaultFilterValues: PageFilterValues = {
  activeTab: "sell",
  activeCategory: "all",
  city: "",
  keyword: "",
  location: "",
  categoryType: "",
  maxPrice: "",
  maxArea: "",
  amenities: "",
};

interface PageFilterContextType {
  filters: PageFilterValues;
  setFilters: (filters: PageFilterValues) => void;
}

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
