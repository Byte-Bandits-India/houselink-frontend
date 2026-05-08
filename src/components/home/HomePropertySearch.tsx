"use client";

import { useState } from "react";
import { Search, Plus, Clock } from "lucide-react";

const categories = [
    {
        id: "plots",
        name: "Plots",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        id: "apartments",
        name: "Apartments",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="1" />
                <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
            </svg>
        ),
    },
    {
        id: "villas",
        name: "Villas",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 20h20M4 20V10l8-7 8 7v10" />
                <path d="M9 20v-5h6v5" />
                <path d="M10 10h4v4h-4z" />
            </svg>
        ),
    },
    {
        id: "house",
        name: "Individual House",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 12L12 3l9 9" />
                <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
            </svg>
        ),
    },
    {
        id: "commercial",
        name: "Commercial Property",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="7" width="20" height="14" rx="1" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="12.01" strokeWidth="3" />
                <path d="M2 12h20" />
            </svg>
        ),
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
        <div
            style={{
                width: "100%",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}
        >
            <div
                style={{
                    background: "#ffffff",
                    borderRadius: 16,
                    boxShadow: "0 8px 40px rgba(15,40,90,0.13)",
                    overflow: "hidden",
                    maxWidth: 1100,
                    margin: "0 auto",
                }}
            >
                {/* ── Top section ─────────────────────────────────────────────── */}
                <div style={{ padding: "20px 28px 0" }}>

                    {/* Radio Tabs */}
                    <div style={{ display: "flex", gap: 28, marginBottom: 20 }}>
                        {[
                            { key: "sell", label: "Sell" },
                            { key: "rent", label: "Rent / Lease" },
                        ].map(({ key, label }) => (
                            <label
                                key={key}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    fontSize: 15,
                                    fontWeight: activeTab === key ? 600 : 400,
                                    color: activeTab === key ? "#153e75" : "#6b7280",
                                    userSelect: "none",
                                }}
                                onClick={() => setActiveTab(key)}
                            >
                                {/* Custom radio */}
                                <span
                                    style={{
                                        width: 18,
                                        height: 18,
                                        borderRadius: "50%",
                                        border: `2px solid ${activeTab === key ? "#153e75" : "#9ca3af"}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        transition: "border-color 0.2s",
                                    }}
                                >
                                    {activeTab === key && (
                                        <span
                                            style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: "50%",
                                                background: "#153e75",
                                            }}
                                        />
                                    )}
                                </span>
                                {label}
                            </label>
                        ))}
                    </div>

                    {/* Category Buttons */}
                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                            alignItems: "center",
                            marginBottom: 20,
                        }}
                    >
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "10px 18px",
                                        borderRadius: 10,
                                        border: `1.5px solid ${isActive ? "#153e75" : "#dde3ec"}`,
                                        background: isActive ? "#eaf0fb" : "#ffffff",
                                        color: isActive ? "#153e75" : "#374151",
                                        fontSize: 14,
                                        fontWeight: isActive ? 600 : 400,
                                        cursor: "pointer",
                                        transition: "all 0.18s ease",
                                        whiteSpace: "nowrap",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.borderColor = "#153e75";
                                            e.currentTarget.style.color = "#153e75";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.borderColor = "#dde3ec";
                                            e.currentTarget.style.color = "#374151";
                                        }
                                    }}
                                >
                                    <span style={{ color: isActive ? "#153e75" : "#6b7280", display: "flex" }}>
                                        {cat.icon}
                                    </span>
                                    {cat.name}
                                </button>
                            );
                        })}

                        {/* Post Property — dark filled button */}
                        <button
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "10px 20px",
                                borderRadius: 10,
                                border: "none",
                                background: "#153e75",
                                color: "#ffffff",
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                                marginLeft: "auto",
                                whiteSpace: "nowrap",
                                boxShadow: "0 4px 14px rgba(21,62,117,0.28)",
                                transition: "background 0.18s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#1a4d8f")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#153e75")}
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            Post property
                        </button>
                    </div>
                </div>

                {/* ── Search Bar ──────────────────────────────────────────────── */}
                <div
                    style={{
                        margin: "0 28px",
                        border: "1.5px solid #dde3ec",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "stretch",
                        overflow: "hidden",
                        background: "#fff",
                    }}
                >
                    {/* City selector */}
                    <div
                        style={{
                            padding: "12px 20px",
                            borderRight: "1.5px solid #dde3ec",
                            minWidth: 160,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            City
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Chennai</div>
                    </div>

                    {/* Search input */}
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            padding: "0 16px",
                            gap: 10,
                        }}
                    >
                        <Search size={18} color="#9ca3af" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search for locality, landmark, project or builder"
                            style={{
                                flex: 1,
                                border: "none",
                                outline: "none",
                                fontSize: 14,
                                color: "#374151",
                                background: "transparent",
                                padding: "14px 0",
                            }}
                        />
                    </div>

                    {/* Search button */}
                    <button
                        style={{
                            padding: "0 28px",
                            background: "#153e75",
                            color: "#fff",
                            border: "none",
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "background 0.18s",
                            letterSpacing: "0.01em",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#1a4d8f")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#153e75")}
                    >
                        Search
                    </button>
                </div>

                {/* ── Recent Searches ─────────────────────────────────────────── */}
                <div
                    style={{
                        padding: "14px 28px 22px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                    }}
                >
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>
                        Recent searches:
                    </span>
                    {recentSearches.map((s, i) => (
                        <button
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "5px 12px",
                                borderRadius: 20,
                                border: "1.5px solid #dde3ec",
                                background: "#f9fafb",
                                color: "#4b5563",
                                fontSize: 12,
                                cursor: "pointer",
                                transition: "border-color 0.15s, color 0.15s",
                                whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#153e75";
                                e.currentTarget.style.color = "#153e75";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#dde3ec";
                                e.currentTarget.style.color = "#4b5563";
                            }}
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