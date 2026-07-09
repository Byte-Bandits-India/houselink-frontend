"use client";

import { useEffect, useState } from "react";

interface TabItem {
  id: string;
  label: string;
}

const TABS: TabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "description", label: "Description" },
  { id: "amenities", label: "Amenities & Features" },
  { id: "details", label: "Additional Information" },
  { id: "location", label: "Location" },
];

export default function PropertyTabs() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 140; // Adjust for header height and tab nav height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

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
    <div className="w-full border-b border-gray-200 bg-white sticky top-0 z-40 select-none shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex gap-8 overflow-x-auto scrollbar-none py-4 text-sm font-bold text-gray-500">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
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
