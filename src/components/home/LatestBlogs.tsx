"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getBlogs, getImageUrl } from "@/lib/api";
import type { BlogPost } from "@/types/blog";
import { fadeUp, stagger } from "@/lib/animations";

export default function LatestBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBlogs({ limit: 4 })
      .then((res) => {
        if (res.success && res.data && res.data.posts) {
          setPosts(res.data.posts);
        }
      })
      .catch((err) => console.error("Error loading blog posts:", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (!isLoading && posts.length === 0) {
    return null;
  }

  return (
    <section
      className="py-20 md:py-28 bg-[#f4f6f9] relative overflow-hidden"
      id="latest-blogs"
    >
      {/* Faint geometric background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'url("/assets/images/about-us/section-bg-shape-1.svg")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header — two column */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-16 mb-12 md:mb-16">
          {/* Left — label + heading */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="lg:max-w-xl"
          >
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-2 text-ink/50 text-sm font-medium mb-4"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Your Guide To Inspired Living</span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0d2247] leading-tight"
            >
              Smart insights. Better
              <br className="hidden sm:block" /> decisions. Beautiful spaces.
            </motion.h2>
          </motion.div>

          {/* Right — description */}
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-ink/60 text-sm sm:text-base leading-relaxed lg:max-w-md lg:pt-14 self-start"
          >
            Whether you&apos;re navigating the property market or designing your
            dream home, our blog keeps you informed and inspired. Discover
            expert tips, trend reports, neighborhood highlights, and practical
            guides, all in one place.
          </motion.p>
        </div>

        {/* Cards grid — 4 columns on lg */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
        >
          {posts.slice(0, 4).map((post, i) => (
            <motion.div key={post.id ?? i} variants={fadeUp}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden flex-shrink-0">
                    <Image
                      src={getImageUrl(post.coverImage)}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <h3 className="text-[#0d2247] font-bold text-base leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Divider */}
                    <div className="w-8 h-[2px] bg-[#153e75]/30 rounded-full" />

                    <span
                      className="inline-flex items-center gap-1.5 text-[#153e75] text-sm font-semibold underline underline-offset-2 hover:gap-2.5 transition-all duration-300 mt-auto cursor-pointer"
                      aria-label={`Read more about ${post.title}`}
                    >
                      Read More <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View all button — centered */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex justify-center"
        >
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "url(/assets/images/about-us/section-bg-shape-1.svg)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              minHeight: "100%",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
