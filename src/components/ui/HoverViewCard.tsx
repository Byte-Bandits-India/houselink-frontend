"use client"
import { useState, useRef } from "react"
import { motion } from "framer-motion"

import type { HoverViewCardProps } from "@/types/components";

/**
 * HoverViewCard
 *
 * A wrapper that tracks mouse position within the card and renders a
 * floating circle (default label "View") that smoothly follows the
 * cursor while hovering — replicating the legacy Blade data-cursor-text="View"
 * interactive effect.
 *
 * Usage:
 *   <HoverViewCard className="relative overflow-hidden w-full h-[200px]">
 *     <img ... />
 *   </HoverViewCard>
 */
export default function HoverViewCard({ label = "View", className = "", children }: HoverViewCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={containerRef}
      className={`relative cursor-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      {/* Floating "View" circle — follows the cursor */}
      <motion.div
        className="absolute z-20 flex items-center justify-center pointer-events-none"
        animate={{
          x: mousePos.x - 40,
          y: mousePos.y - 40,
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.5,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
        style={{ top: 0, left: 0 }}
      >
        <div className="w-20 h-20 bg-black/80 rounded-full flex items-center justify-center text-white text-sm font-medium backdrop-blur-sm border border-white/20 shadow-xl select-none">
          {label}
        </div>
      </motion.div>
    </div>
  )
}
