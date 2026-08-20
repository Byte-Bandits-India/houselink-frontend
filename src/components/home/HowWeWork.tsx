"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";
import { ArrowUpRight } from "lucide-react";
import { whatWeDoItems } from "@/components/home/Options";
import { useHomeFilter } from "@/contexts/HomeFilterContext";

const CustomHomeIcon = ({
  size = 22,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Roof */}
    <path
      d="M2,14.5 C1.7,14.5 1.4,14.3 1.2,14.1 C0.8,13.7 0.8,13 1.2,12.6 L10.8,3.5 C11.5,2.8 12.5,2.8 13.2,3.5 L22.8,12.6 C23.2,13 23.2,13.7 22.8,14.1 C22.4,14.5 21.7,14.5 21.3,14.1 L12,5.3 L2.7,14.1 C2.5,14.3 2.2,14.5 2,14.5 Z"
      fill="currentColor"
    />
    {/* Chimney */}
    <path
      d="M17,3.5 C17,3.2 17.2,3 17.5,3 H19.5 C19.8,3 20,3.2 20,3.5 V9.5 L17,6.8 V3.5 Z"
      fill="currentColor"
    />
    {/* Main House Body */}
    <path
      d="M12,7.2 L4.5,14.3 V20.5 C4.5,21.3 5.2,22 6,22 H10.5 V16.5 H13.5 V22 H18 C18.8,22 19.5,21.3 19.5,20.5 V14.3 L12,7.2 Z"
      fill="currentColor"
    />
  </svg>
);

export default function WhatWeDo() {
  const router = useRouter();
  const { filters, setFilters } = useHomeFilter();

  const handleActionClick = (item: (typeof whatWeDoItems)[0]) => {
    if (item.id === "wwd1" || item.href.startsWith("/properties")) {
      setFilters({
        ...filters,
        activeTab: "rent",
        keyword: "",
        location: "",
        activeCategory: "all",
      });
      router.push("/properties");
    } else {
      router.push(item.href);
    }
  };

  return (
    <section className="py-20 bg-white" id="what-we-do">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary mb-5"
          >
            What We Do ?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Houselink360 simplifies buying premium residential and commercial
            properties.
          </motion.p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {whatWeDoItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className={`flex flex-col w-full select-none relative pb-6 ${
                index === 2
                  ? "md:col-span-2 md:mx-auto md:max-w-[calc(50%-12px)] lg:col-span-1 lg:max-w-none"
                  : ""
              }`}
            >
              {/* Image Section (Top half, max-h-300px) */}
              <div className="relative w-full h-[290px] rounded-xl overflow-hidden shadow-sm image-anime">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority
                  unoptimized
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Bottom White Overlay Card Container using designer's Subtract.png */}
              <div
                className="relative -mt-20 mx-4 h-[250px] z-10 flex flex-col items-center text-center p-6 pt-12 select-none"
                style={{
                  backgroundImage: "url('/assets/home/Subtract.png')",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Home Icon overlay positioned inside the left peak */}
                <div className="absolute top-[14px] left-[14%] -translate-x-1/2 z-20">
                  <CustomHomeIcon size={28} className="text-primary" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col items-center h-full justify-between w-full">
                  {/* Text Content */}
                  <div className="flex flex-col items-center mt-4 space-y-3">
                    <h3 className="font-extrabold text-[18px] md:text-[20px] text-primary tracking-tight leading-tight">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 text-[13px] font-medium leading-relaxed max-w-[90%]">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Link centered at the bottom */}
                  <button
                    type="button"
                    onClick={() => handleActionClick(item)}
                    className="inline-flex items-center gap-3 text-primary font-black text-sm hover:underline cursor-pointer mb-2"
                  >
                    <span>{item.linkText}</span>
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                      <ArrowUpRight size={14} className="stroke-[3px]" />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
