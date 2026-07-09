"use client";

import { useRef } from "react";
import Image from "next/image";
import { MapPin, ArrowRight, Building } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { upcomingProperties } from "./Options";
import type { UpcomingProperty } from "./Options";

function UpcomingPropertyCard({ property }: { property: UpcomingProperty }) {
  const purposeColorClass = {
    Sale: "text-primary",
    Rent: "text-amber-500",
    Lease: "text-emerald-600",
  }[property.purpose];

  return (
    <div className="group relative flex h-[396px] w-full max-w-[300px] flex-col rounded-[28px] border border-gray-150 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.12)] bg-white select-none">
      {/* Top portion: Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[28px]">
        <Image
          src={property.image}
          alt={property.title}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          unoptimized
        />

        {/* Category tag */}
        <div className="absolute bottom-4 left-4 z-10 bg-white px-4 py-1.5 text-[11px] font-extrabold text-black rounded-full shadow-sm">
          {property.category}
        </div>
      </div>

      {/* Purpose ribbon / badge */}
      <div className={`absolute -top-3.5 right-4 z-20 select-none filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] ${purposeColorClass}`}>
        <svg width="84" height="34" viewBox="0 0 84 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 8 0 H 76 C 80 0, 84 4, 84 8 C 80 12, 80 22, 84 26 C 84 30, 80 34, 76 34 H 8 C 4 34, 0 30, 0 26 C 4 22, 4 12, 0 8 C 0 4, 4 0, 8 0 Z" fill="currentColor" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[12px] font-black text-white tracking-wider">
          {property.purpose}
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
              {property.title}
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
              {property.price}
            </span>
          </div>

          {/* Action chevron */}
          <Button variant="gradient" className="w-11 h-11 rounded-full text-white flex items-center justify-center transition-colors shadow-md flex-shrink-0 cursor-pointer">
            <ArrowRight size={18} className="stroke-[2.5px]" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function UpcomingProperties() {
  const scrollContainer = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16 bg-whiteBG" id="upcoming-properties">
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
                Upcoming Properties
              </h2>
              <p className="text-gray-500 text-sm lg:text-md font-medium leading-tight mt-0.5">
                Find future-ready homes in prime locations
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mb-10 w-full">
        <img
          src="/assets/home/upComming.png"
          alt="upcoming-properties"
          className="w-full h-auto shadow-sm object-cover"
        />
      </div>

      <div className="container mx-auto px-4 max-w-[1440px]">
        {/* Properties Carousel */}
        <div
          ref={scrollContainer}
          className="flex overflow-x-auto gap-6 pt-5 pb-6 snap-x snap-mandatory scroll-smooth scrollbar-hide w-full"
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

          {upcomingProperties.map((property) => (
            <div key={property.id} className="snap-start flex-none w-[300px]">
              <UpcomingPropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
