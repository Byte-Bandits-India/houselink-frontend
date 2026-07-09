"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { introVideoConfig } from "./Options";

export default function IntroVideo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth cursor follow spring physics
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 28, stiffness: 280, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  return (
    <section className="bg-whiteBG" id="intro-video-section">
      <div>
        {/* Banner Area */}
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsOpen(true)}
          className="relative w-full aspect-video md:aspect-[2.3/1] max-h-[700px] overflow-hidden shadow-[0_15px_35px_-5px_rgba(0,0,0,0.12)] border border-gray-150 group cursor-none"
        >
          {/* Background Poster Image */}
          <Image
            src={introVideoConfig.posterImage}
            alt="Intro Video Background"
            fill
            priority
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10 pointer-events-none" />

          {/* Shine hover effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-15">
            <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
          </div>

          {/* Central pulsing play button overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-none">
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-black/10 border border-white/60 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
              {/* Pulsing ring animation */}
              <div className="absolute inset-0 rounded-full animate-ping opacity-75" />
              <Play className="text-white w-6 h-6 sm:w-8 sm:h-8 fill-white ml-1 stroke-[1.5px]" />
            </div>
          </div>

          {/* Framer Motion custom cursor follower */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                style={{
                  left: cursorXSpring,
                  top: cursorYSpring,
                }}
                className="absolute pointer-events-none hidden lg:flex items-center justify-center w-20 h-20 -translate-x-1/2 -translate-y-1/2 bg-black/85 backdrop-blur-[6px] text-white text-sm font-extrabold rounded-full shadow-2xl z-30 select-none border border-white/10"
              >
                Play
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Responsive Video Lightbox Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 cursor-default"
            onClick={() => setIsOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border-none shadow-md"
              type="button"
              aria-label="Close video"
            >
              <X size={24} className="stroke-[2.5px]" />
            </button>

            {/* Video Box Content */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-[840px] aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={introVideoConfig.youtubeEmbedUrl}
                title={introVideoConfig.youtubeTitle}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
