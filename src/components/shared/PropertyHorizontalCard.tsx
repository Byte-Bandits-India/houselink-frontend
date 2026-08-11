"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getImageUrl } from "@/lib/api";
import { useWishlist } from "@/context/WishlistContext";
import type { PropertyHorizontalCardProps } from "@/types/components";

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

function getCategoryIconClass(categoryName?: string): string {
  if (!categoryName) return "fi-ss-tag";
  const name = categoryName.toLowerCase().trim();
  if (name.includes("apartment")) return "fi-ss-building";
  if (name.includes("villa")) return "fi-ss-house-chimney";
  if (name.includes("plot") || name.includes("land")) return "fi-ss-marker";
  if (name.includes("individual house") || name.includes("individual_house") || name.includes("house")) {
    return "fi-ss-home";
  }
  if (name.includes("shop") || name.includes("store") || name.includes("commercial")) {
    return "fi-ss-briefcase";
  }
  return "fi-ss-tag";
}

function formatIndianPrice(price: number | string | undefined | null): string {
  if (price === undefined || price === null) return "";
  const numericPrice = typeof price === "string" ? parseFloat(price.replace(/,/g, "")) : price;
  if (isNaN(numericPrice)) return String(price);

  if (numericPrice >= 10000000) {
    const crores = numericPrice / 10000000;
    return `₹${crores.toFixed(crores % 1 === 0 ? 0 : 2)} Crores`;
  } else if (numericPrice >= 100000) {
    const lakhs = numericPrice / 100000;
    return `₹${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 2)} lacks`;
  } else {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numericPrice);
  }
}

export default function PropertyHorizontalCard(props: PropertyHorizontalCardProps) {
  const url = props.permalink ? `/properties/${props.permalink}` : `/properties/${props.id}`;
  const priceFormatted = formatIndianPrice(props.price);
  const areaFormatted = props.area !== undefined && props.area !== null
    ? (typeof props.area === "number" || !isNaN(Number(props.area)) ? `${props.area}/ sqft.` : props.area)
    : "";

  // Icons mapping for amenities representation
  const amenitiesList = props.features || [];
  const extraAmenitiesCount = amenitiesList.length > 4 ? amenitiesList.length - 4 : 0;

  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(Number(props.id));

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(Number(props.id));
  };

  return (
    <div className="relative flex flex-col md:flex-row border border-gray-205 rounded-2xl p-4 gap-6 bg-white shadow-xs select-none">
      
      {/* ── IMAGE SECTION ── */}
      <div className="relative w-full md:w-[320px] h-[200px] md:h-[250px] lg:w-[390px] lg:h-[278px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 select-none image-anime">
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

        {/* Wishlist heart button */}
        <button
          onClick={handleWishlistClick}
          className="absolute bottom-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-neutral-700 hover:bg-white/90 hover:text-black shadow-sm transition-colors cursor-pointer border-none"
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4.5 w-4.5 stroke-[2px] ${wishlisted ? "fill-red-500 text-red-500" : "text-neutral-700"}`} />
        </button>
      </div>

      {/* ── DETAILS SECTION ── */}
      <div className="flex flex-col flex-1 justify-between min-w-0 text-left py-4 pr-1">
        
        {/* Header row: Location & Category Tag */}
        <div className="flex items-center justify-between gap-3 select-none flex-wrap">
          <span className="text-gray-500 text-xs font-semibold truncate mt-1">
            {props.location}
          </span>

          {/* Mobile Category Tag */}
          {props.categoryName && (
            <span className="flex md:hidden items-center gap-1.5 px-3 py-1 bg-[#bfdbfe]/80 text-[#000000] rounded-full font-bold text-[9px] uppercase tracking-wider select-none border border-gray-150 shrink-0">
              <i className={`fi ${getCategoryIconClass(props.categoryName)} text-[9px] text-black leading-none`}></i>
              {props.categoryName}
            </span>
          )}
        </div>

        {/* Desktop Category Tag */}
        {props.categoryName && (
          <div className="hidden md:flex absolute top-0 right-0 items-center gap-1.5 px-4 py-1.5 bg-[#bfdbfe]/80 text-[#000000] rounded-bl-xl rounded-tr-2xl font-bold text-[11px] uppercase tracking-wider select-none border-b border-l border-gray-150">
            <i className={`fi ${getCategoryIconClass(props.categoryName)} text-[12px] text-black leading-none`}></i>
            {props.categoryName}
          </div>
        )}

        {/* Title & Description Excerpt */}
        <div className="my-2 select-text">
          <Link href={url}>
            <h3 className="font-bold text-base md:text-xl text-gray-900 tracking-tight hover:text-[#000000] transition-colors leading-snug line-clamp-2">
              {props.name}
            </h3>
          </Link>
          <p className="text-gray-500 text-xs line-clamp-2 mt-2 leading-relaxed">
            {props.description || "Browse details of this beautiful property listed on Houselink. Connect directly for inquiries."}
          </p>
        </div>

        {/* Amenities Icons Row */}
        <div className="flex items-center gap-4 text-gray-900 my-2 select-none flex-wrap">
          <div className="flex items-center gap-3">
            <i className="fi fi-ss-shield-check text-[18px] text-black leading-none"></i>
            <i className="fi fi-ss-terrace text-[18px] text-black leading-none"></i>
            <i className="fi fi-ss-tree text-[18px] text-black leading-none"></i>
            <i className="fi fi-ss-parking text-[18px] text-black leading-none"></i>
            {extraAmenitiesCount > 0 && (
              <span className="text-xs font-medium text-gray-900 ml-1">
                + {extraAmenitiesCount} Amenities
              </span>
            )}
          </div>
        </div>

        {/* Specifications Row */}
        <div className="flex items-center gap-6 text-[13px] font-bold text-gray-500 pt-3 select-none flex-wrap">
          {props.bedrooms !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 leading-none">{props.bedrooms}</span>
              <i className="fi fi-ss-bed text-[16px] text-black inline-flex items-center justify-center leading-none mx-1"></i>
              <span className="text-gray-500 font-medium leading-none">Bedrooms</span>
            </div>
          )}
          {props.bathrooms !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 leading-none">{props.bathrooms}</span>
              <i className="fi fi-ss-bath text-[16px] text-black inline-flex items-center justify-center leading-none mx-1"></i>
              <span className="text-gray-500 font-medium leading-none">Bathrooms</span>
            </div>
          )}
          {props.area !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 leading-none">{areaFormatted}</span>
              <i className="fi fi-ss-ruler-horizontal text-[16px] text-black inline-flex items-center justify-center leading-none mx-1"></i>
              <span className="text-gray-500 font-medium leading-none">Build up Area</span>
            </div>
          )}
        </div>

        {/* Footer: Price & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3.5 mt-2">
          <span className="font-bold text-2xl text-gray-900 leading-none">
            {priceFormatted}
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end sm:justify-start">
            <Link
              href={url}
              className="flex-1 sm:flex-none text-center bg-gradient-to-r from-primary to-secondary hover:from-primary/95 hover:to-secondary/95 text-white font-medium text-xs px-6 py-2.5 rounded-full shadow-sm transition-all active:scale-[0.98] select-none cursor-pointer"
            >
              More Details
            </Link>
            <button
              onClick={() => props.onEnquireClick(props)}
              className="flex-1 sm:flex-none text-center border border-primary text-primary hover:bg-blue-50/40 font-medium text-xs px-6 py-2 rounded-full transition-all active:scale-[0.98] cursor-pointer select-none"
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
