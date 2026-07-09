"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";
import { Home, ArrowUpRight } from "lucide-react";
import { whatWeDoItems } from "@/components/home/Options";

export default function WhatWeDo() {
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
            Houselink360 simplifies buying premium residential and commercial properties.
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
              <div className="relative w-full h-[290px] rounded-xl overflow-hidden shadow-sm">
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
                <div className="absolute top-[16px] left-[14%] -translate-x-1/2 z-20">
                  <Home size={22} className="text-black stroke-[2.5px]" />
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
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-3 text-primary font-black text-sm hover:underline cursor-pointer mb-2"
                  >
                    {item.linkText}
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                      <ArrowUpRight size={14} className="stroke-[3px]" />
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}