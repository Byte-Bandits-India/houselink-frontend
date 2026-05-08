"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";

const cards = [
  {
    tag: "RENT A PROPERTY",
    tagColor: "bg-blue-100 text-blue-700",
    cardBg: "bg-white",
    imageBg: "bg-blue-50",
    title:
      "Find your perfect rental space with ease, comfort, and verified listings",
    btnLabel: "Rent Now",
    btnColor: "bg-[#153e75] hover:bg-[#0d2a52] text-white",
    href: "/rent",
    image: "/assets/images/about-us/howWe1.png",
  },
  {
    tag: "BECOME A PARTNER",
    tagColor: "bg-teal-100 text-teal-700",
    cardBg: "bg-[#EFFFFE]",
    imageBg: "bg-[#d4f5ee]",
    title:
      "Find your perfect rental space with ease, comfort, and verified listings",
    btnLabel: "Become a Partner",
    btnColor: "bg-teal-600 hover:bg-teal-700 text-white",
    href: "/partner",
    image: "/assets/images/about-us/howWe2.png",
  },
  {
    tag: "BUY A PROPERTY",
    tagColor: "bg-blue-100 text-blue-700",
    cardBg: "bg-white",
    imageBg: "bg-blue-50",
    title:
      "Find your perfect rental space with ease, comfort, and verified listings",
    btnLabel: "Buy Now",
    btnColor: "bg-[#153e75] hover:bg-[#0d2a52] text-white",
    href: "/buy",
    image: "/assets/images/about-us/howWe3.png",
  },
];

export default function WhatWeDo() {
  return (
    <section className="py-20 md:py-28 bg-white" id="what-we-do">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — centered */}
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
          {cards.map((card, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`relative rounded-3xl overflow-hidden shadow-[0_4px_20px_0px_rgba(0,0,0,0.25)] border border-gray-100 ${card.cardBg} flex flex-col min-h-[150px]`}
            >
              {/* Content + Image row */}
              <div className="flex flex-row items-end justify-between flex-1 px-6 pb-3 pt-4 gap-2">
                {/* Left — text + button */}
                <div className="flex flex-col gap-5 max-w-[55%]">
                  {/* Tag */}
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide ${card.tagColor}`}
                  >
                    {card.tag}
                  </span>
                  <p className="text-[#0d2247] text-sm font-medium leading-snug">
                    {card.title}
                  </p>
                  <Link
                    href={card.href}
                    className={`inline-block self-start px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 ${card.btnColor}`}
                  >
                    {card.btnLabel}
                  </Link>
                </div>

                {/* Right — person image */}
                <div className="relative w-[45%] h-[200px] flex-shrink-0">
                  <Image
                    src={card.image}
                    alt={card.tag}
                    fill
                    className="object-contain object-bottom"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
