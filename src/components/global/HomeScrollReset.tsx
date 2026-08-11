"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Forces the homepage to the top on every visit, including when arriving
 * via the browser's back button. Runs from a component that stays mounted
 * across navigations (unlike the page itself) and defers the scroll past
 * Next.js's own back/forward restoration, which otherwise wins the race
 * and can land on the wrong section when the page layout has shifted
 * since the last visit (async data, images, etc.).
 */
export default function HomeScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || pathname !== "/" || window.location.hash) {
      return;
    }

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => window.scrollTo(0, 0));
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [pathname]);

  return null;
}
