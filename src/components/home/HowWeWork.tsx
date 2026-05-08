"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";

export default function WhatWeDo() {
  return (
    <section className="py-20 md:py-28 bg-white" id="what-we-do">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0d2247] mb-5"
          >
            What We Do
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-ink/60 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
          >
            Houselink360° connects discerning buyers with thoughtfully planned
            residential and commercial properties. We offer end-to-end solutions
            that simplify discovery, evaluation, and acquisition.
          </motion.p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1 — Rent a Property */}
          <motion.div
            variants={fadeUp}
            className="relative rounded-3xl overflow-hidden shadow-[0_4px_20px_0px_rgba(0,0,0,0.25)] border border-gray-100 bg-white flex flex-col min-h-[150px]"
          >
            <div className="flex flex-row items-end justify-between flex-1 px-6 pb-3 pt-4 gap-2">
              <div className="flex flex-col gap-5 max-w-[55%]">
                <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide bg-blue-100 text-blue-700">
                  RENT A PROPERTY
                </span>
                <p className="text-[#0d2247] text-sm font-medium leading-snug">
                  Find your perfect rental space with ease, comfort, and verified listings
                </p>
                <Link
                  href="/rent"
                  className="inline-block self-start px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 bg-[#153e75] hover:bg-[#0d2a52] text-white"
                >
                  Rent Now
                </Link>
              </div>
              <div className="relative w-[50%] h-[200px] flex-shrink-0">
                <Image
                  src="/assets/images/about-us/howWe1.png"
                  alt="Rent a Property"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 2 — Become a Partner */}
          <motion.div
            variants={fadeUp}
            className="relative rounded-3xl overflow-hidden shadow-[0_4px_20px_0px_rgba(0,0,0,0.25)] border border-gray-100 bg-[#EFFFFE] flex flex-col min-h-[150px]"
          >
            <div className="flex flex-row items-end justify-between flex-1 px-6 pb-3 pt-4 gap-2">
              <div className="flex flex-col gap-5 max-w-[55%]">
                <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide bg-teal-100 text-teal-700">
                  BECOME A PARTNER
                </span>
                <p className="text-[#0d2247] text-sm font-medium leading-snug">
                  Find your perfect rental space with ease, comfort, and verified listings
                </p>
                <Link
                  href="/partner"
                  className="inline-block self-start px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Become a Partner
                </Link>
              </div>
              <div className="relative w-[45%] h-[200px] flex-shrink-0">
                <Image
                  src="/assets/images/about-us/howWe2.png"
                  alt="Become a Partner"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 3 — Buy a Property */}
          <motion.div
            variants={fadeUp}
            className="relative rounded-3xl overflow-hidden shadow-[0_4px_20px_0px_rgba(0,0,0,0.25)] border border-gray-100 bg-white flex flex-col min-h-[150px]"
          >
            <div className="flex flex-row items-end justify-between flex-1 px-6 pb-3 pt-4 gap-2">
              <div className="flex flex-col gap-5 max-w-[55%]">
                <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide bg-blue-100 text-blue-700">
                  BUY A PROPERTY
                </span>
                <p className="text-[#0d2247] text-sm font-medium leading-snug">
                  Find your perfect rental space with ease, comfort, and verified listings
                </p>
                <Link
                  href="/buy"
                  className="inline-block self-start px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 bg-[#153e75] hover:bg-[#0d2a52] text-white"
                >
                  Buy Now
                </Link>
              </div>
              <div className="relative w-[45%] h-[200px] flex-shrink-0">
                <Image
                  src="/assets/images/about-us/howWe3.png"
                  alt="Buy a Property"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}