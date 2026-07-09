import { useRef } from "react";
import Image from "next/image";
import { MapPin, TrendingUp } from "lucide-react";
import { trendingCities } from "./Options";

interface CityCardProps {
  image: string;
  name: string;
  propertiesCount: number;
  growthRate: string;
}

function CityCard({ image, name, propertiesCount, growthRate }: CityCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full max-w-[280px] sm:max-w-none">
      {/* Image Container */}
      <div className="relative h-[180px] w-full overflow-hidden select-none">
        {/* High Demand Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[10px] font-bold text-red-500 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-red-50/50 z-10">
          <span>🔥</span> High Demand
        </div>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, 240px"
          className="object-cover hover:scale-105 transition-transform duration-500"
          draggable={false}
        />
      </div>

      {/* Info Container */}
      <div className="p-5 text-left flex flex-col gap-3">
        {/* Location Row */}
        <div className="flex items-center gap-1.5">
          <MapPin size={18} className="text-blue-500" />
          <h3 className="text-primary font-extrabold text-base tracking-tight">{name}</h3>
        </div>

        {/* Subtitle properties */}
        <p className="text-xs text-gray-500 font-medium -mt-1">{propertiesCount}+ Properties</p>

        {/* Trend badge */}
        <div className="inline-flex items-center gap-1 bg-[#EAEAFE] text-primary text-[10px] font-bold px-2.5 py-1.5 rounded-full w-fit">
          <TrendingUp size={12} />
          {growthRate} Growth
        </div>
      </div>
    </div>
  );
}


export default function TopTrendingCities() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-12 container mx-auto px-4 md:px-6">
      {/* Title and Controls block */}
      <div className="flex justify-between items-end mb-8">
        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#000000] flex items-center gap-2 mb-2">
            <span>🔥</span> High Demand Regions
          </h2>
          <p className="text-sm md:text-base text-[#918B8B] font-medium">
            Top locations with great demand and promising returns
          </p>
        </div>
      </div>

      {/* Cards list (Carousel on all screens) */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scroll-smooth scrollbar-hide w-full"
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
        {trendingCities.map((city) => (
          <div key={city.name} className="snap-start flex-shrink-0 w-[260px] md:w-[280px]">
            <CityCard
              image={city.image}
              name={city.name}
              propertiesCount={city.propertiesCount}
              growthRate={city.growthRate}
            />
          </div>
        ))}
      </div>
    </section>
  );
}