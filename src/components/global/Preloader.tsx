"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setFade(true);
      const timer = setTimeout(() => setShow(false), 500); // 500ms fade transition
      return () => clearTimeout(timer);
    };

    // If page is already loaded, fade out immediately
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      
      // Modern fail-safe: dismiss loading screen after 2.5 seconds max
      const backupTimer = setTimeout(handleLoad, 2500);
      
      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(backupTimer);
      };
    }
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-opacity duration-500 ease-out ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative w-24 h-24 flex items-center justify-center select-none">
        {/* Modern Custom Spinning Ring */}
        <div className="absolute inset-0 rounded-full border border-transparent border-t-secondary border-b-secondary animate-spin"></div>
        
        {/* Centered Brand Logo */}
        <div className="relative w-20 h-20 flex items-center justify-center p-1">
          <Image
            src="/loader.png"
            alt="Houselink Logo"
            width={100}
            height={100}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
