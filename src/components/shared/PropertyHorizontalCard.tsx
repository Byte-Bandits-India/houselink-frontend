"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Shield, ShieldCheck, Trees, Car, Building, Bed, Bath, Square, Ruler, Tag } from "lucide-react";
import { getImageUrl } from "@/lib/api";
import { PropertyCardProps } from "./PropertyCard";

interface PropertyHorizontalCardProps extends PropertyCardProps {
  onEnquireClick: (property: any) => void;
}

function getDefaultImage(categoryName?: string): string {
  if (!categoryName) return "/assets/default.png";
  const name = categoryName.toLowerCase().trim();
  if (name.includes("apartment")) return "/assets/default_images/apartmentAvatar.jpg";
  if (name.includes("villa")) return "/assets/default_images/villaAvatar.jpg";
  if (name.includes("plot")) return "/assets/default_images/plotsAvatar.jpg";
  if (name.includes("individual house") || name.includes("individual_house") || name.includes("house")) {
    return "/assets/default_images/houseAvatar.jpg";
  }
  if (name.includes("land")) return "/assets/default_images/landAvatar.jpg";
  if (name.includes("shop")) return "/assets/default_images/shopAvatar.jpg";
  if (name.includes("building")) return "/assets/default_images/buildingAvatar.jpg";
  if (name.includes("godown")) return "/assets/default_images/godownAvatar.jpg";
  if (name.includes("warehouse")) return "/assets/default_images/warehouseAvatar.jpg";
  if (name.includes("office")) return "/assets/default_images/officeAvatar.jpg";
  if (name.includes("commercial")) return "/assets/default_images/commercialAvatar.jpg";
  return "/assets/default.png";
}

export default function PropertyHorizontalCard(props: PropertyHorizontalCardProps) {
  const url = props.permalink ? `/properties/${props.permalink}` : `/properties/${props.id}`;
  const priceFormatted = typeof props.price === "number"
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(props.price)
    : props.price;

  // Icons mapping for amenities representation
  const amenitiesList = props.features || [];
  const extraAmenitiesCount = amenitiesList.length > 4 ? amenitiesList.length - 4 : 0;

  return (
    <div className="relative flex flex-col md:flex-row border border-gray-205 rounded-2xl p-4 gap-6 bg-white shadow-xs select-none">
      
      {/* ── IMAGE SECTION ── */}
      <div className="relative w-full md:w-[320px] h-[200px] md:h-[250px] lg:w-[390px] lg:h-[278px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 select-none">
        <Link href={url} className="block w-full h-full relative">
          <Image
            src={props.image && props.image !== "/assets/blur.png" ? getImageUrl(props.image) : getDefaultImage(props.categoryName)}
            alt={props.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            unoptimized={true}
          />
        </Link>

        {/* Featured Tag on top-left of image */}
        {props.isFeatured && (
          <span className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white px-3.5 py-1 font-bold text-[10px] uppercase tracking-wider shadow-sm select-none">
            Featured
          </span>
        )}
      </div>

      {/* ── DETAILS SECTION ── */}
      <div className="flex flex-col flex-1 justify-between min-w-0 text-left py-1 pr-1">
        
        {/* Header row: Location & Category Tag */}
        <div className="flex items-center justify-between gap-3 select-none flex-wrap">
          <span className="text-gray-500 text-xs font-semibold truncate mt-1">
            {props.location}
          </span>

          {/* Mobile Category Tag */}
          {props.categoryName && (
            <span className="flex md:hidden items-center gap-1.5 px-3 py-1 bg-[#bfdbfe]/80 text-[#000000] rounded-full font-bold text-[9px] uppercase tracking-wider select-none border border-gray-150 shrink-0">
              <Tag size={10} className="stroke-[2.5px]" />
              {props.categoryName}
            </span>
          )}
        </div>

        {/* Desktop Category Tag */}
        {props.categoryName && (
          <div className="hidden md:flex absolute top-0 right-0 items-center gap-1.5 px-4 py-1.5 bg-[#bfdbfe]/80 text-[#000000] rounded-bl-xl rounded-tr-2xl font-bold text-[11px] uppercase tracking-wider select-none border-b border-l border-gray-150">
            <Tag size={12} className="stroke-[2.5px]" />
            {props.categoryName}
          </div>
        )}

        {/* Title & Description Excerpt */}
        <div className="my-2 select-text">
          <Link href={url}>
            <h3 className="font-extrabold text-base md:text-lg text-gray-900 tracking-tight hover:text-[#000000] transition-colors leading-snug line-clamp-2">
              {props.name}
            </h3>
          </Link>
          <p className="text-gray-500 text-xs font-medium line-clamp-2 mt-2 leading-relaxed">
            {props.description || "Browse details of this beautiful property listed on Houselink. Connect directly for inquiries."}
          </p>
        </div>

        {/* Amenities Icons Row */}
        <div className="flex items-center gap-4 text-gray-900 my-2 select-none flex-wrap">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-black stroke-[2.5px]" />
            <Building size={20} className="text-black stroke-[2.5px]" />
            <Trees size={20} className="text-black stroke-[2.5px]" />
            <Car size={20} className="text-black stroke-[2.5px]" />
            {extraAmenitiesCount > 0 && (
              <span className="text-xs font-bold text-gray-900 ml-1">
                + {extraAmenitiesCount} Amenities
              </span>
            )}
          </div>
        </div>

        {/* Specifications Row */}
        <div className="flex items-center gap-6 text-xs font-bold text-gray-500 border-t border-gray-100 pt-3 select-none flex-wrap">
          {props.bedrooms !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="font-black text-gray-900 text-sm leading-none">{props.bedrooms}</span>
              <Bed size={15} className="text-black stroke-[2px]" />
              <span className="text-gray-500 font-medium text-[13px]">Bedrooms</span>
            </div>
          )}
          {props.bathrooms !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="font-black text-gray-900 text-sm leading-none">{props.bathrooms}</span>
              <Bath size={15} className="text-black stroke-[2px]" />
              <span className="text-gray-500 font-medium text-[13px]">Bathrooms</span>
            </div>
          )}
          {props.area !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="font-black text-gray-900 text-sm leading-none">{props.area}</span>
              <Ruler size={15} className="text-black stroke-[2px]" />
              <span className="text-gray-500 font-medium text-[13px]">Build up Area</span>
            </div>
          )}
        </div>

        {/* Footer: Price & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-100 pt-3.5 mt-2">
          <span className="font-black text-2xl text-gray-900 leading-none">
            {priceFormatted}
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end sm:justify-start">
            <Link
              href={url}
              className="flex-1 sm:flex-none text-center bg-gradient-to-r from-primary to-secondary hover:from-primary/95 hover:to-secondary/95 text-white font-extrabold text-xs px-6 py-2.5 rounded-full shadow-sm transition-all active:scale-[0.98] select-none cursor-pointer"
            >
              More Details
            </Link>
            <button
              onClick={() => props.onEnquireClick(props)}
              className="flex-1 sm:flex-none text-center border-2 border-primary text-primary hover:bg-blue-50/40 font-extrabold text-xs px-6 py-2 rounded-full transition-all active:scale-[0.98] cursor-pointer select-none"
              type="button"
            >
              Enquire Property
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
