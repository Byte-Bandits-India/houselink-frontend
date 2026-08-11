"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { smoothScrollBy } from "@/lib/smoothScroll";
import { MapPin, ArrowRight, Building, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { getProperties, mapApiPropertyToCardProps, getImageUrl, getUpcomingConfig } from "@/lib/api";

function getDefaultImage(categoryName?: string): string {
  if (!categoryName) return "/assets/default.png";
  const name = categoryName.toLowerCase().trim();
  if (name.includes("apartment")) {
    return "/assets/default_images/apartmentAvatar.jpg";
  }
  if (name.includes("villa")) {
    return "/assets/default_images/villaAvatar.jpg";
  }
  if (name.includes("plot")) {
    return "/assets/default_images/plotsAvatar.jpg";
  }
  if (name.includes("individual house") || name.includes("individual_house") || name.includes("house")) {
    return "/assets/default_images/houseAvatar.jpg";
  }
  if (name.includes("land")) {
    return "/assets/default_images/landAvatar.jpg";
  }
  if (name.includes("shop")) {
    return "/assets/default_images/shopAvatar.jpg";
  }
  if (name.includes("building")) {
    return "/assets/default_images/buildingAvatar.jpg";
  }
  if (name.includes("godown")) {
    return "/assets/default_images/godownAvatar.jpg";
  }
  if (name.includes("warehouse")) {
    return "/assets/default_images/warehouseAvatar.jpg";
  }
  if (name.includes("office")) {
    return "/assets/default_images/officeAvatar.jpg";
  }
  if (name.includes("commercial")) {
    return "/assets/default_images/commercialAvatar.jpg";
  }
  return "/assets/default.png";
}

function UpcomingPropertyCard({ property }: { property: any }) {
  const purposeColorMap: Record<string, string> = {
    "For Sale": "text-primary",
    "Rent": "text-amber-500",
    "Lease": "text-emerald-600",
  };
  const purposeColorClass = purposeColorMap[property.property_for] || "text-primary";

  const imageUrl = property.image && property.image !== "/assets/blur.png" 
    ? getImageUrl(property.image) 
    : getDefaultImage(property.categoryName);

  const href = property.permalink ? `/properties/${property.permalink}` : `/properties/${property.id}`;

  return (
    <Link
      href={href}
      className="group relative flex h-[396px] w-full max-w-[300px] flex-col rounded-[28px] border border-gray-150 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.12)] bg-white select-none cursor-pointer"
    >
      {/* Top portion: Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[28px] image-anime">
        <Image
          src={imageUrl}
          alt={property.name}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          unoptimized
        />

        {/* Featured badge */}
        {property.isFeatured && (
          <div className="absolute top-4 left-4 z-10 bg-[#D1FAE5] text-emerald-800 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-sm">
            Featured
          </div>
        )}

        {/* Category tag */}
        <div className="absolute bottom-4 left-4 z-10 bg-white px-4 py-1.5 text-[11px] font-extrabold text-black rounded-full shadow-sm">
          {property.categoryName}
        </div>
      </div>

      {/* Purpose ribbon / badge */}
      <div className={`absolute -top-3.5 right-4 z-20 select-none filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] ${purposeColorClass}`}>
        <svg width="84" height="34" viewBox="0 0 84 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 8 0 H 76 C 80 0, 84 4, 84 8 C 80 12, 80 22, 84 26 C 84 30, 80 34, 76 34 H 8 C 4 34, 0 30, 0 26 C 4 22, 4 12, 0 8 C 0 4, 4 0, 8 0 Z" fill="currentColor" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[12px] font-black text-white tracking-wider">
          {property.property_for}
        </span>
      </div>

      {/* Bottom portion: Info details */}
      <div className="flex flex-1 flex-col justify-between p-5 text-left bg-white rounded-b-[28px]">
        {/* Title and location */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {/* Small building Icon container */}
            <div className="w-10 h-10 rounded-xl border border-blue-100 bg-white flex items-center justify-center text-primary flex-shrink-0 shadow-sm">
              <Building size={18} className="text-primary stroke-[2px]" />
            </div>
            <h3 className="font-extrabold text-[17px] text-black tracking-tight leading-tight truncate mt-0.5">
              {property.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 pl-1 text-gray-500 text-xs font-semibold">
            <MapPin size={13} className="text-indigo-600 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Price and right chevron button */}
        <div className="flex items-center justify-between pt-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400">
              Price
            </span>
            <span className="text-[20px] font-black text-black leading-none mt-1.5">
              {typeof property.price === "number"
                ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.price)
                : property.price}
            </span>
          </div>

          {/* Action chevron */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center transition-colors shadow-md flex-shrink-0">
            <ArrowRight size={18} className="stroke-[2.5px]" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function UpcomingProperties() {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  // Tracks which face is showing ("active") and which just left ("outgoing"),
  // so both can be animated with a 3D rotateY transition at the same time.
  const [slideIndices, setSlideIndices] = useState({ active: 0, outgoing: -1 });

  useEffect(() => {
    async function loadFeaturedProperties() {
      try {
        const res = await getProperties({
          is_active: "true",
          moderation: "approved",
          page_size: "100"
        });
        if (res.success && res.data) {
          const featured = res.data
            .filter((p: any) => p.isFeatured)
            .map(mapApiPropertyToCardProps);
          setProperties(featured);
        }
      } catch (err) {
        console.error("Error loading upcoming featured properties:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    async function loadBanner() {
      try {
        const res = await getUpcomingConfig();
        if (res.success && res.data && res.data.images && res.data.images.length > 0) {
          setBannerImages(res.data.images);
        } else {
          setBannerImages(['/assets/home/upComming.png']);
        }
      } catch (err) {
        console.error("Failed to load upcoming banner images:", err);
        setBannerImages(['/assets/home/upComming.png']);
      }
    }

    loadFeaturedProperties();
    loadBanner();
  }, []);

  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndices((prev) => ({
        active: (prev.active + 1) % bannerImages.length,
        outgoing: prev.active,
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainer.current) {
      const scrollAmount = 320; // card width (300) + gap (20) approx
      smoothScrollBy(
        scrollContainer.current,
        direction === "left" ? -scrollAmount : scrollAmount,
        450
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return null; // Don't show the upcoming section if no featured properties are seeded/added yet
  }

  return (
    <section className="py-8 bg-whiteBG" id="upcoming-properties">
      <div className="container mx-auto px-4 max-w-[1440px]">
        {/* Header Block */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex items-center justify-between gap-6 mb-8"
        >
          <div className="flex items-center gap-4">
            {/* Icon Box */}
            <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <MapPin size={22} className="stroke-[2.5px]" />
            </div>

            {/* Texts */}
            <div className="text-left">
              <h2 className="text-xl md:text-2xl font-extrabold text-primary leading-tight">
                Featured Properties
              </h2>
              <p className="text-gray-500 text-sm lg:text-md font-medium leading-tight -mt-2">
                Explore handpicked properties in prime locations
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mb-10">
        <div
          className="banner-cube-wrap relative w-full overflow-hidden select-none"
          style={{ aspectRatio: "1440 / 240" }}
        >
          {/* 3D rotate transition between banner faces */}
          <style dangerouslySetInnerHTML={{ __html: `
            .banner-cube-wrap {
              perspective: 1600px;
            }
            .banner-cube-face {
              position: absolute;
              inset: 0;
              backface-visibility: hidden;
              transform-style: preserve-3d;
            }
            .banner-cube-face.is-active {
              transform: rotateX(0deg);
              opacity: 1;
              z-index: 2;
              transition: transform 1s cubic-bezier(.65,0,.35,1);
            }
            .banner-cube-face.is-outgoing {
              transform: rotateX(-90deg);
              opacity: 1;
              z-index: 1;
              transition: transform 1s cubic-bezier(.65,0,.35,1);
            }
            .banner-cube-face.is-idle {
              transform: rotateX(90deg);
              opacity: 0;
              z-index: 0;
            }
          `}} />

          {bannerImages.map((src, idx) => {
            const role =
              idx === slideIndices.active
                ? "is-active"
                : idx === slideIndices.outgoing
                ? "is-outgoing"
                : "is-idle";
            return (
              <div key={idx} className={`banner-cube-face ${role}`}>
                <Image
                  src={getImageUrl(src)}
                  alt={`Upcoming Banner ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1440px]">
        {/* Arrow Slider Controls */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleScroll("left")}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-xs cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="stroke-[2px]" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-xs cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="stroke-[2px]" />
          </button>
        </div>
        
        {/* Properties Carousel */}
        <div
          ref={scrollContainer}
          className="flex overflow-x-auto gap-6 pt-5 pb-6 scrollbar-hide w-full"
        >
          {/* Style block to hide scrollbar */}
          <style dangerouslySetInnerHTML={{ __html: `
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}} />

          {properties.map((property) => (
            <div key={property.id} className="flex-none w-[300px]">
              <UpcomingPropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
