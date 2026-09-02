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
  if (name.includes("apartment"))
    return "/assets/default_images/apartmentAvatar.jpg";
  if (name.includes("villa")) return "/assets/default_images/villaAvatar.jpg";
  if (name.includes("plot")) return "/assets/default_images/plotsAvatar.jpg";
  if (
    name.includes("individual house") ||
    name.includes("individual_house") ||
    name.includes("house")
  ) {
    return "/assets/default_images/houseAvatar.jpg";
  }
  if (name.includes("land")) return "/assets/default_images/landAvatar.jpg";
  if (name.includes("shop")) return "/assets/default_images/shopAvatar.jpg";
  if (name.includes("building"))
    return "/assets/default_images/buildingAvatar.jpg";
  if (name.includes("godown")) return "/assets/default_images/godownAvatar.jpg";
  if (name.includes("warehouse"))
    return "/assets/default_images/warehouseAvatar.jpg";
  if (name.includes("office")) return "/assets/default_images/officeAvatar.jpg";
  if (name.includes("commercial"))
    return "/assets/default_images/commercialAvatar.jpg";
  return "/assets/default.png";
}

function getCategoryIconClass(categoryName?: string): string {
  if (!categoryName) return "fi-ss-tag";
  const name = categoryName.toLowerCase().trim();
  if (name.includes("apartment")) return "fi-ss-building";
  if (name.includes("villa")) return "fi-ss-house-chimney";
  if (name.includes("plot") || name.includes("land")) return "fi-ss-marker";
  if (
    name.includes("individual house") ||
    name.includes("individual_house") ||
    name.includes("house")
  ) {
    return "fi-ss-home";
  }
  if (
    name.includes("shop") ||
    name.includes("store") ||
    name.includes("commercial")
  ) {
    return "fi-ss-briefcase";
  }
  return "fi-ss-tag";
}

function formatIndianPrice(price: number | string | undefined | null): string {
  if (price === undefined || price === null) return "";
  const numericPrice =
    typeof price === "string" ? parseFloat(price.replace(/,/g, "")) : price;
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

function getAmenityIconClass(name?: string): string {
  if (!name) return "fi fi-ss-check-circle";
  const lower = name.toLowerCase().trim();
  if (
    lower.includes("security") ||
    lower.includes("shield") ||
    lower.includes("cctv") ||
    lower.includes("guard")
  )
    return "fi fi-ss-shield-check";
  if (
    lower.includes("terrace") ||
    lower.includes("balcony") ||
    lower.includes("roof")
  )
    return "fi fi-ss-terrace";
  if (
    lower.includes("garden") ||
    lower.includes("tree") ||
    lower.includes("park") ||
    lower.includes("lawn")
  )
    return "fi fi-ss-tree";
  if (
    lower.includes("parking") ||
    lower.includes("car") ||
    lower.includes("garage")
  )
    return "fi fi-ss-parking";
  if (
    lower.includes("gym") ||
    lower.includes("fitness") ||
    lower.includes("workout")
  )
    return "fi fi-ss-dumbbell";
  if (lower.includes("pool") || lower.includes("swim"))
    return "fi fi-ss-swimming-pool";
  if (lower.includes("lift") || lower.includes("elevator"))
    return "fi fi-ss-elevator";
  if (lower.includes("wifi") || lower.includes("internet"))
    return "fi fi-ss-wifi-alt";
  if (
    lower.includes("power") ||
    lower.includes("generator") ||
    lower.includes("backup")
  )
    return "fi fi-ss-bolt";
  if (lower.includes("water") || lower.includes("supply"))
    return "fi fi-ss-faucet-drip";
  if (lower.includes("club") || lower.includes("community"))
    return "fi fi-ss-users";
  if (
    lower.includes("play") ||
    lower.includes("kids") ||
    lower.includes("children")
  )
    return "fi fi-ss-gamepad";
  return "fi fi-ss-check-circle";
}

function getCategoryColor(category?: string) {
  if (!category) return "text-primary";
  const c = category.toLowerCase().trim();
  if (c.includes("plot") || c.includes("land")) return "text-amber-500";
  if (c.includes("villa")) return "text-emerald-600";
  if (
    c.includes("individual house") ||
    c.includes("individual_house") ||
    c.includes("house")
  )
    return "text-rose-500";
  if (
    c.includes("commercial") ||
    c.includes("office") ||
    c.includes("shop") ||
    c.includes("godown") ||
    c.includes("warehouse")
  )
    return "text-violet-600";
  if (c.includes("apartment")) return "text-sky-600";
  return "text-amber-500";
}

function getShortCategoryName(category?: string) {
  if (!category) return "";
  const name = category.trim();
  if (name.toLowerCase() === "individual house") return "House";
  if (
    name.toLowerCase() === "commercial property" ||
    name.toLowerCase() === "commercial"
  )
    return "Commercial";
  return name;
}

export default function PropertyHorizontalCard(
  props: PropertyHorizontalCardProps,
) {
  const url = props.permalink
    ? `/properties/${props.permalink}`
    : `/properties/${props.id}`;
  const priceFormatted = formatIndianPrice(props.price);
  const areaFormatted =
    props.area !== undefined && props.area !== null
      ? typeof props.area === "number" || !isNaN(Number(props.area))
        ? `${props.area}/ sqft.`
        : props.area
      : "";

  // Badges calculation
  const ownerRole = props.type || (props as any).propertyOwnership || "Owner";
  const rawPurpose = props.property_for || (props as any).propertyFor || "sell";
  const purposeTag = rawPurpose.toLowerCase().includes("rent")
    ? "Rent"
    : rawPurpose.toLowerCase().includes("lease")
      ? "Lease"
      : "Sell";

  const categoryColorClass = getCategoryColor(props.categoryName);
  const displayCategoryName = getShortCategoryName(props.categoryName);

  // Extract all amenities (features & facilities) with backend images
  const rawFeatures: Array<{ name: string; image?: string }> = Array.isArray(
    props.features,
  )
    ? props.features
        .map((f: any) => {
          if (typeof f === "string") return { name: f, image: undefined };
          return {
            name: f.name || f.feature?.name || "",
            image:
              f.image ||
              f.icon ||
              f.feature?.image ||
              f.feature?.icon ||
              undefined,
          };
        })
        .filter((f) => Boolean(f.name))
    : [];

  const rawFacilities: Array<{ name: string; image?: string }> = Array.isArray(
    (props as any).facilities,
  )
    ? (props as any).facilities
        .map((f: any) => {
          if (typeof f === "string") return { name: f, image: undefined };
          return {
            name: f.name || f.facility?.name || "",
            image:
              f.image ||
              f.icon ||
              f.facility?.image ||
              f.facility?.icon ||
              undefined,
          };
        })
        .filter((f: any) => Boolean(f.name))
    : [];

  const allAmenities = [
    ...rawFeatures,
    ...rawFacilities.filter(
      (fac) =>
        !rawFeatures.some(
          (feat) => feat.name.toLowerCase() === fac.name.toLowerCase(),
        ),
    ),
  ];

  // Max 4 amenities to display
  const displayedAmenities = allAmenities.slice(0, 4);
  const extraAmenitiesCount =
    allAmenities.length > 4 ? allAmenities.length - 4 : 0;

  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(Number(props.id));

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(Number(props.id));
  };

  return (
    <div className="relative flex flex-col md:flex-row border border-gray-205 rounded-2xl p-4 gap-6 bg-white shadow-xs select-none">
      {/* ── Category ribbon / badge ── */}
      {displayCategoryName && (
        <div
          className={`absolute -top-3.5 right-4 z-20 select-none filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] ${categoryColorClass}`}
        >
          <svg
            width="84"
            height="34"
            viewBox="0 0 84 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 8 0 H 76 C 80 0, 84 4, 84 8 C 80 12, 80 22, 84 26 C 84 30, 80 34, 76 34 H 8 C 4 34, 0 30, 0 26 C 4 22, 4 12, 0 8 C 0 4, 4 0, 8 0 Z"
              fill="currentColor"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white tracking-wider uppercase">
            {displayCategoryName}
          </span>
        </div>
      )}

      {/* ── IMAGE SECTION ── */}
      <div className="relative w-full md:w-[320px] h-[200px] md:h-[250px] lg:w-[390px] lg:h-[278px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 select-none image-anime">
        <Link href={url} className="block w-full h-full relative">
          <Image
            src={
              props.image && props.image !== "/assets/blur.png"
                ? getImageUrl(props.image)
                : getDefaultImage(props.categoryName)
            }
            alt={props.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            unoptimized={true}
          />
        </Link>

        {/* Badges on top-left of image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {props.isFeatured && (
            <span className="rounded-md bg-emerald-100 text-emerald-800 px-2.5 py-1 font-semibold text-[11px] md:text-xs shadow-sm select-none">
              Featured
            </span>
          )}
          {ownerRole && (
            <span className="rounded-md bg-blue-100 text-blue-800 px-2.5 py-1 font-semibold text-[11px] md:text-xs shadow-sm select-none capitalize">
              {ownerRole}
            </span>
          )}
          {purposeTag && (
            <span className="rounded-md bg-[#153e75] text-white px-2.5 py-1 font-semibold text-[11px] md:text-xs shadow-sm select-none capitalize">
              {purposeTag}
            </span>
          )}
        </div>

        {/* Wishlist heart button */}
        <button
          onClick={handleWishlistClick}
          className="absolute bottom-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-neutral-700 hover:bg-white/90 hover:text-black shadow-sm transition-colors cursor-pointer border-none"
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4.5 w-4.5 stroke-[2px] ${wishlisted ? "fill-red-500 text-red-500" : "text-neutral-700"}`}
          />
        </button>
      </div>

      {/* ── DETAILS SECTION ── */}
      <div className="flex flex-col flex-1 justify-between min-w-0 text-left py-2 pr-1">
        {/* Header row: Location */}
        <div className="flex items-center justify-between gap-3 select-none flex-wrap pt-1">
          <span className="text-gray-500 text-xs font-semibold truncate">
            {props.location}
          </span>
        </div>

        {/* Title & Description Excerpt */}
        <div className="my-2 select-text">
          <Link href={url}>
            <h3 className="font-bold text-base md:text-xl text-gray-900 tracking-tight hover:text-[#000000] transition-colors leading-snug line-clamp-2">
              {props.name}
            </h3>
          </Link>
          <p className="text-gray-500 text-xs line-clamp-2 mt-2 leading-relaxed">
            {props.description ||
              "Browse details of this beautiful property listed on Houselink. Connect directly for inquiries."}
          </p>
        </div>

        {/* Amenities Icons Row (Max 4 with backend images) */}
        {displayedAmenities.length > 0 && (
          <div className="flex items-center gap-4 text-gray-900 my-2 select-none flex-wrap">
            <div className="flex items-center gap-3">
              {displayedAmenities.map((amenity, idx) => {
                const imgUrl = amenity.image
                  ? getImageUrl(amenity.image)
                  : null;
                return (
                  <div
                    key={`${amenity.name}-${idx}`}
                    className="w-7 h-7 flex items-center justify-center text-black"
                    title={amenity.name}
                  >
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={amenity.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <i
                        className={`${getAmenityIconClass(amenity.name)} text-12 text-black leading-none`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Specifications Row */}
        <div className="flex items-center gap-6 text-[13px] font-bold text-gray-500 pt-3 select-none flex-wrap">
          {props.bedrooms !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 leading-none">
                {props.bedrooms}
              </span>
              <i className="fi fi-ss-bed text-[16px] text-black inline-flex items-center justify-center leading-none mx-1"></i>
              <span className="text-gray-500 font-medium leading-none">
                Bedrooms
              </span>
            </div>
          )}
          {props.bathrooms !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 leading-none">
                {props.bathrooms}
              </span>
              <i className="fi fi-ss-bath text-[16px] text-black inline-flex items-center justify-center leading-none mx-1"></i>
              <span className="text-gray-500 font-medium leading-none">
                Bathrooms
              </span>
            </div>
          )}
          {props.area !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 leading-none">
                {areaFormatted}
              </span>
              <i className="fi fi-ss-ruler-horizontal text-[16px] text-black inline-flex items-center justify-center leading-none mx-1"></i>
              <span className="text-gray-500 font-medium leading-none">
                Build up Area
              </span>
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
