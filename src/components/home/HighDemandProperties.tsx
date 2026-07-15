import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getPopularProperties, getImageUrl, type PopularPropertyApiItem } from "@/lib/api";
import { smoothScrollBy } from "@/lib/smoothScroll";
import type { HighDemandPropertyCardProps } from "@/types/home";

function PropertyCard({ image, type, title, price, location }: HighDemandPropertyCardProps) {
  return (
    <div className="relative rounded-[20px] overflow-hidden shadow-[0_1px_10px_rgba(0,0,0,0.25)] w-[360px] sm:w-[460px] md:w-[540px] lg:w-[888px] h-[240px] sm:h-[300px] md:h-[340px] lg:h-[396px] flex-shrink-0 cursor-pointer group image-anime">
      {/* Category Tag */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[11px] md:text-xs font-bold text-primary px-4 py-1.5 rounded-full shadow-sm z-10 select-none">
        {type}
      </div>

      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        unoptimized={true}
        className="object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
        draggable={false}
      />

      {/* Bottom Floating Info Capsule */}
      <div className="absolute bottom-5 left-5 right-5 bg-white rounded-2xl p-3 md:p-4 flex items-center justify-between shadow-md border border-gray-100/50 z-10">
        <div className="text-left flex-1 min-w-0 pr-2">
          <h3 className="text-primary font-extrabold text-sm md:text-base leading-tight truncate">
            {title} - <span className="text-[#2448B7] font-black">{price}</span>
          </h3>
          <div className="flex items-center gap-1 mt-1 text-gray-500 text-[11px] md:text-xs font-medium">
            <MapPin size={13} className="text-blue-500 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
}

export default function HighDemandProperties() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [properties, setProperties] = useState<PopularPropertyApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getPopularProperties()
      .then((data) => {
        if (isMounted) setProperties(data);
      })
      .catch((err) => {
        console.error("Error loading high demand properties:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 420; // approximate scroll step (card width + gap)
      smoothScrollBy(
        scrollRef.current,
        direction === "left" ? -scrollAmount : scrollAmount,
        450
      );
    }
  };

  if (!isLoading && properties.length === 0) {
    return null;
  }

  return (
    <section id="high-demand-properties" className="py-6 container mx-auto px-4 md:px-6">
      {/* Title and Controls block */}
      <div className="flex justify-between items-end mb-8">
        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#000000] flex items-center gap-2 mb-2">
            <img src="/assets/home/icons/fire.png" alt="fire" className="w-7 h-7 object-contain" /> High Demand Properties
          </h2>
          <p className="text-sm md:text-base text-[#918B8B] font-medium">
            Top Properties with high demand and promising returns
          </p>
        </div>

        {/* Arrow Slider Controls */}
        <div className="flex gap-2">
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
      </div>

      {/* Cards list (Carousel) */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide w-full"
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
          <div key={property.id} className="flex-shrink-0">
            <PropertyCard
              image={getImageUrl(property.image)}
              type={property.type}
              title={property.title}
              price={property.price}
              location={property.location}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
