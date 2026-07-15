"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Search } from "lucide-react";
import PropertiesSearchHeader from "./PropertiesSearchHeader";
import PropertiesFilterSidebar from "./PropertiesFilterSidebar";
import PropertyHorizontalCard from "./PropertyHorizontalCard";
import PropertyEnquirySidebar from "./PropertyEnquirySidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import type { PropertiesListingLayoutProps } from "@/types/components";

export default function PropertiesListingLayout({
  properties,
  isLoading,
  error,
  title,
  breadcrumbLabel,
}: PropertiesListingLayoutProps) {
  const [enquiryProperty, setEnquiryProperty] = useState<any | null>(null);

  return (
    <div className="w-full min-h-screen bg-gray-50/50 pb-16">
      {/* 1. TOP BLUE SEARCH HEADER */}
      <PropertiesSearchHeader />

      {/* 2. PAGE CONTENT AREA */}
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Title and Breadcrumbs */}
        <div className="flex flex-col text-left py-6 border-b border-gray-100 mb-6">
          <h1 className="text-2xl font-black text-gray-900 mb-2">{title}</h1>
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="text-primary hover:text-primary/80 font-medium">
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-ink-secondary font-medium">
                  {breadcrumbLabel}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
          
          {/* Left Column: Filter Sidebar */}
          <div className="w-full lg:w-[318px] lg:flex-shrink-0 lg:sticky lg:top-6">
            <PropertiesFilterSidebar />
          </div>

          {/* Right Column: Properties List */}
          <div className="w-full">
            {isLoading ? (
              <div className="flex flex-col gap-5">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="w-full h-[220px] bg-white border border-gray-200 rounded-2xl animate-pulse flex flex-col md:flex-row overflow-hidden">
                    <div className="w-full md:w-[280px] h-[200px] md:h-full bg-gray-200" />
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-6 bg-gray-200 rounded w-3/4 my-2" />
                      <div className="h-10 bg-gray-200 rounded w-full" />
                      <div className="h-8 bg-gray-200 rounded w-1/4 mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-150">
                <p className="text-red-500 font-semibold text-lg">{error}</p>
              </div>
            ) : properties.length > 0 ? (
              <div className="flex flex-col gap-5">
                {properties.map((prop) => (
                  <PropertyHorizontalCard
                    key={prop.id}
                    {...prop}
                    onEnquireClick={(p) => setEnquiryProperty(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-150 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 select-none">
                  <Search size={32} className="text-primary" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">No properties found</h4>
                <p className="text-gray-500 text-sm max-w-sm">
                  We couldn't find any properties matching your current filters. Try resetting or adjusting your search parameters.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 3. ENQUIRY MODAL DIALOG */}
      {enquiryProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setEnquiryProperty(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close dialog"
            >
              <X size={20} className="stroke-[2.5px]" />
            </button>
            
            {/* Property details mini heading */}
            <div className="mb-4 text-left pr-8 select-none">
              <h3 className="text-lg font-black text-gray-900 leading-tight">Enquire Property</h3>
              <p className="text-xs text-gray-500 font-bold truncate mt-0.5">{enquiryProperty.name}</p>
            </div>
            
            {/* Form scrollable container */}
            <div className="max-h-[70vh] overflow-y-auto pr-1">
              <PropertyEnquirySidebar property={{ ...enquiryProperty, id: Number(enquiryProperty.id) }} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
