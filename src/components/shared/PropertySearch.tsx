"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Select } from "antd";

const categories = [
  { id: "all",         name: "All" },
  { id: "plots",       name: "Plots" },
  { id: "apartments",  name: "Apartments" },
  { id: "villas",      name: "Villas" },
  { id: "house",       name: "Individual House" },
  { id: "commercial",  name: "Commercial Property" },
];

export default function PropertySearch() {
  const [activeTab, setActiveTab]           = useState("sell");
  const [showAdvanced, setShowAdvanced]     = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="w-full mb-10 relative z-20 -mt-24">

      {/* ── Tabs (For Sale / Rent Lease) ───────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
        {[
          { key: "sell", label: "For Sale" },
          { key: "rent", label: "Rent/Lease" },
        ].map(({ key, label }, i) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              minWidth: 130,
              padding: "10px 30px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              /* Active tab: white (matches card), inactive: translucent */
              backgroundColor: activeTab === key ? "#ffffff" : "rgba(255,255,255,0.18)",
              color: activeTab === key ? "#153e75" : "#ffffff",
              borderTopLeftRadius:  i === 0 ? 10 : 0,
              borderTopRightRadius: i === 1 ? 10 : 0,
              borderBottomLeftRadius:  0,
              borderBottomRightRadius: 0,
              backdropFilter: "blur(6px)",
              transition: "background-color 0.25s, color 0.25s",
              /* Bottom of active tab merges into white card below */
              boxShadow: activeTab === key
                ? "0 -2px 8px rgba(0,0,0,0.06)"
                : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── White Search Card ────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 16,
          boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",
          padding: "16px 20px",
          position: "relative",
          zIndex: 20,
        }}
      >
        {/* Form row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            gap: 0,
          }}
        >
          <input type="hidden" name="property_purpose" value={activeTab} />

          {/* City */}
          <div style={{ flex: "1 1 120px", borderRight: "1px solid #d9d9d9", paddingRight: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#5c6368", marginBottom: 6 }}>City</div>
            <Select
              defaultValue="chennai"
              variant="borderless"
              options={[
                { value: "0",         label: "Select City" },
                { value: "chennai",   label: "Chennai" },
                { value: "bangalore", label: "Bangalore" },
              ]}
              style={{ width: "100%", padding: 0, margin: "-4px -11px", color: "black", fontWeight: 400 }}
            />
          </div>

          {/* Keyword */}
          <div style={{ flex: "1.5 1 160px", borderRight: "1px solid #d9d9d9", padding: "0 16px", marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#5c6368", marginBottom: 6 }}>Keyword</div>
            <input
              type="text"
              id="keywordInput"
              name="keyword"
              placeholder="Search for Keyword"
              autoComplete="off"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 14,
                color: "#212529",
                padding: "4px 0",
              }}
            />
          </div>

          {/* Location */}
          <div style={{ flex: "2 1 200px", borderRight: "1px solid #d9d9d9", padding: "0 16px", marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#5c6368", marginBottom: 6 }}>Location</div>
            <input
              type="text"
              id="locationInput"
              name="location"
              placeholder="Enter Location"
              autoComplete="off"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 14,
                color: "#212529",
                padding: "4px 0",
              }}
            />
          </div>

          {/* Category */}
          <div style={{ flex: "1.2 1 140px", borderRight: "1px solid #d9d9d9", padding: "0 16px", marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#5c6368", marginBottom: 6 }}>Category</div>
            <Select
              defaultValue=""
              variant="borderless"
              options={[
                { value: "",            label: "Select Category" },
                { value: "residential", label: "Residential" },
                { value: "commercial",  label: "Commercial" },
              ]}
              style={{ width: "100%", padding: 0, margin: "-4px -11px", color: "black" }}
            />
          </div>

          {/* Buttons */}
          <div style={{ flex: "0 0 auto", paddingLeft: 16, display: "flex", gap: 8, height: 45, marginBottom: 8 }}>
            {/* Advanced */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 18px",
                border: "1px solid #d0d0d0",
                borderRadius: 8,
                background: "#fff",
                color: "#444",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
            >
              <SlidersHorizontal size={14} /> Advanced
            </button>

            {/* Search */}
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 22px",
                border: "none",
                borderRadius: 8,
                backgroundColor: "#153e75",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(21,62,117,0.3)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a4d8f")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#153e75")}
            >
              <Search size={14} /> Search
            </button>
          </div>
        </div>

        {/* ── Advanced Filters ──────────────────────────────────────────────── */}
        {showAdvanced && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 24,
              paddingTop: 20,
              marginTop: 16,
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#5c6368", marginBottom: 8 }}>Price Range</div>
              <input type="range" min={0} max={10000000} style={{ width: "100%", accentColor: "#153e75" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                <span>₹0</span><span>₹1 Cr+</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#5c6368", marginBottom: 8 }}>Bathrooms</div>
              <select name="bathrooms" style={{ width: "100%", border: "1px solid #c4c4c4", borderRadius: 6, padding: "8px 12px", fontSize: 14, color: "#212529" }}>
                <option value="">All</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Bathroom{n > 1 ? "s" : ""}</option>)}
                <option value="5+">5+ Bathrooms</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#5c6368", marginBottom: 8 }}>Bedrooms</div>
              <select name="bedrooms" style={{ width: "100%", border: "1px solid #c4c4c4", borderRadius: 6, padding: "8px 12px", fontSize: 14, color: "#212529" }}>
                <option value="">All</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Bedroom{n > 1 ? "s" : ""}</option>)}
                <option value="5+">5+ Bedrooms</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ── Category Nav — underline style matching screenshot ──────────────── */}
      <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 36, flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            style={{
              background: "none",
              border: "none",
              borderBottom: activeCategory === cat.id ? "2.5px solid #153e75" : "2.5px solid transparent",
              color: activeCategory === cat.id ? "#153e75" : "#6b7280",
              fontSize: 15,
              fontWeight: activeCategory === cat.id ? 600 : 400,
              padding: "4px 2px 6px",
              cursor: "pointer",
              transition: "color 0.2s ease, border-color 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== cat.id) {
                e.currentTarget.style.color = "#153e75";
                e.currentTarget.style.borderBottomColor = "rgba(21,62,117,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== cat.id) {
                e.currentTarget.style.color = "#6b7280";
                e.currentTarget.style.borderBottomColor = "transparent";
              }
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
