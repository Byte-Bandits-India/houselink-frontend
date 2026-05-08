"use client";

import { useState } from "react";
import { Search, Plus, Clock } from "lucide-react";

const categories = [
    {
        id: "plots",
        name: "Plots",
        icon: <img src="/icon/plot.svg" alt="plot" className="w-5 h-5" />,
    },
    {
        id: "apartments",
        name: "Apartments",
        icon: <img src="/icon/appartment.svg" alt="appartment" className="w-5 h-5" />,
    },
    {
        id: "villas",
        name: "Villas",
        icon: <img src="/icon/villa.svg" alt="villa" className="w-5 h-5" />,
    },
    {
        id: "house",
        name: "Individual House",
        icon: <img src="/icon/inHouse.svg" alt="house" className="w-5 h-5" />,
    },
    {
        id: "commercial",
        name: "Commercial Property",
        icon: <img src="/icon/commercialPr.svg" alt="commerce" className="w-5 h-5" />,
    },
];

const recentSearches = [
    "Plots in porur",
    "Plots in porur",
    "Plots in porur",
    "Plots in porur",
    "Plots in porur",
    "Plots in porur",
];

export default function PropertySearch() {
    const [activeTab, setActiveTab] = useState("sell");
    const [activeCategory, setActiveCategory] = useState("plots");
    const [searchValue, setSearchValue] = useState("");

    return (
        <div className="w-full font-sans">
            <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(15,40,90,0.13)] overflow-hidden max-w-[1100px] mx-auto">

                {/* ── Top section ── */}
                <div className="px-7 pt-5">

                    {/* Radio Tabs */}
                    <div className="flex gap-7 mb-5">
                        {[
                            { key: "sell", label: "Sell" },
                            { key: "rent", label: "Rent / Lease" },
                        ].map(({ key, label }) => (
                            <label
                                key={key}
                                onClick={() => {
                                    setActiveTab(key);
                                    if (key === "rent" && activeCategory === "plots") {
                                        setActiveCategory("apartments");
                                    }
                                }}
                                className={`flex items-center gap-2 cursor-pointer text-[15px] select-none transition-colors ${activeTab === key
                                    ? "font-semibold text-[#153e75]"
                                    : "font-normal text-gray-500"
                                    }`}
                            >
                                {/* Custom radio */}
                                <span
                                    className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${activeTab === key ? "border-[#153e75]" : "border-gray-400"
                                        }`}
                                >
                                    {activeTab === key && (
                                        <span className="w-2 h-2 rounded-full bg-[#153e75] block" />
                                    )}
                                </span>
                                {label}
                            </label>
                        ))}
                    </div>

                    {/* Category Buttons */}
                    <div className="flex gap-2 items-center mb-5 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.filter(cat => activeTab === "sell" || cat.id !== "plots").map((cat) => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-6 py-4 rounded-[5px] border-[1.5px] text-base transition-all duration-200 whitespace-nowrap cursor-pointer
                    ${isActive
                                            ? "border-[#153e75] bg-[#eaf0fb] text-[#153e75] font-semibold"
                                            : "border-[#dde3ec] bg-white text-gray-700 font-normal hover:border-[#153e75] hover:text-[#153e75]"
                                        }`}
                                >
                                    <span className={isActive ? "text-[#153e75]" : "text-gray-400"}>
                                        {cat.icon}
                                    </span>
                                    {cat.name}
                                </button>
                            );
                        })}

                        {/* Post Property */}
                        <button className="ml-auto flex items-center gap-2 px-6 py-4 rounded-[5px] bg-[#153e75] text-white text-base font-semibold whitespace-nowrap shadow-[0_4px_14px_rgba(21,62,117,0.28)] hover:bg-[#1a4d8f] transition-colors cursor-pointer">
                            <img src="/assets/header/plus.svg" alt="post property" className="w-4 h-4" />
                            Post property
                        </button>
                    </div>
                </div>

                {/* ── Search Bar ── */}
                <div className="mx-7 border-[1.5px] border-[#dde3ec] rounded-xl flex items-stretch overflow-hidden bg-white">
                    {/* City selector */}
                    <div className="px-5 py-3 border-r-[1.5px] border-[#dde3ec] min-w-[160px] flex flex-col justify-center cursor-pointer">
                        <div className="text-[11px] text-gray-400 font-medium mb-0.5 uppercase tracking-[0.05em]">
                            City
                        </div>
                        <div className="text-xl font-bold text-gray-900">Chennai</div>
                    </div>

                    {/* Search input + button */}
                    <div className="flex flex-1 items-center px-4 gap-2.5">
                        <Search size={18} className="text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search for locality, landmark, project or builder"
                            className="flex-1 border-none outline-none text-sm text-gray-700 bg-transparent py-3 placeholder:text-gray-400"
                        />
                        <button className="px-6 py-4 bg-[#153e75] text-white text-[15px] font-bold rounded-[5px] hover:bg-[#1a4d8f] transition-colors tracking-[0.01em] cursor-pointer whitespace-nowrap">
                            Search
                        </button>
                    </div>
                </div>

                {/* ── Recent Searches ── */}
                <div className="px-7 pt-3.5 pb-6 flex items-center gap-2.5 flex-wrap">
                    <span className="text-[13px] font-semibold text-gray-700 whitespace-nowrap">
                        Recent searches:
                    </span>
                    {recentSearches.map((s, i) => (
                        <button
                            key={i}
                            className="flex items-center gap-1.5 px-3 py-[5px] rounded-full border-[1.5px] border-[#dde3ec] bg-gray-50 text-gray-600 text-xs whitespace-nowrap hover:border-[#153e75] hover:text-[#153e75] transition-colors cursor-pointer"
                        >
                            <Clock size={11} />
                            {s}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}