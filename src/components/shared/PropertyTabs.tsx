"use client";

import { useEffect, useState, useRef } from "react";
import { smoothScrollBy } from "@/lib/smoothScroll";

import type { TabItem } from "@/types/components";

const TABS: TabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "description", label: "Description" },
  { id: "amenities", label: "Amenities & Features" },
  { id: "details", label: "Additional Information" },
  { id: "location", label: "Location" },
];

export default function PropertyTabs() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track header visibility on scroll to dynamically adjust sticky top offset
  useEffect(() => {
    const handleScroll = () => {
      const headerElement = document.querySelector("header");
      if (headerElement) {
        const rect = headerElement.getBoundingClientRect();
        const bottom = Math.max(0, rect.bottom);
        setIsHeaderVisible(bottom > 0);
        // Set CSS custom property on the document element to sync all sticky elements
        document.documentElement.style.setProperty(
          "--tabs-sticky-top",
          `${bottom}px`
        );
        document.documentElement.style.setProperty(
          "--sticky-offset",
          `${bottom + 72}px`
        );
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll the active tab into view horizontally inside the scroll container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeBtn = container.querySelector('[data-active="true"]') as HTMLButtonElement;
    if (activeBtn) {
      const containerWidth = container.clientWidth;
      const buttonLeft = activeBtn.offsetLeft;
      const buttonWidth = activeBtn.clientWidth;

      const targetScrollLeft = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
      const currentScrollLeft = container.scrollLeft;
      const distance = targetScrollLeft - currentScrollLeft;

      if (Math.abs(distance) > 1) {
        smoothScrollBy(container, distance, 300);
      }
    }
  }, [activeTab]);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const headerElement = document.querySelector("header");
      const headerBottom = headerElement ? Math.max(0, headerElement.getBoundingClientRect().bottom) : 0;
      const offset = headerBottom + 68; // header bottom + tabs height (~56px) + small margin (~12px)
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = elementRect + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Intersection observer to highlight active section on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-160px 0px -40% 0px",
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    TABS.forEach((tab) => {
      const element = document.getElementById(tab.id);
      if (element) observer.observe(element);
    });

    return () => {
      TABS.forEach((tab) => {
        const element = document.getElementById(tab.id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div
      className="w-full border-b border-gray-200 bg-white sticky z-40 select-none shadow-sm"
      style={{ top: "var(--tabs-sticky-top, 72px)" }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div
          ref={containerRef}
          className="flex gap-8 overflow-x-auto scrollbar-none py-4 text-sm font-bold text-gray-500"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                data-active={isActive}
                onClick={() => handleTabClick(tab.id)}
                className={`relative pb-2 transition-colors hover:text-gray-900 cursor-pointer whitespace-nowrap ${
                  isActive ? "text-primary font-extrabold" : ""
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full animate-in fade-in duration-200" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
