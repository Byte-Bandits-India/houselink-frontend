"use client";

interface PropertyTypeSwitchProps {
  activeTab: "sell" | "rent";
  onChange: (tab: "sell" | "rent") => void;
  variant?: "header" | "sidebar";
}

export default function PropertyTypeSwitch({
  activeTab,
  onChange,
  variant = "header",
}: PropertyTypeSwitchProps) {
  if (variant === "sidebar") {
    return (
      <div className="flex bg-gray-50 border border-gray-200 rounded-full p-1 w-full items-center">
        <button
          type="button"
          onClick={() => onChange("sell")}
          className={`flex-1 py-2 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === "sell"
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => onChange("rent")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === "rent"
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Rent / Lease
        </button>
      </div>
    );
  }

  // Header default variant
  return (
    <div className="flex bg-white rounded-full p-1 h-11 items-center w-full lg:min-w-[220px]">
      <button
        type="button"
        onClick={() => onChange("sell")}
        className={`flex-1 h-full text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
          activeTab === "sell"
            ? "bg-secondary text-white shadow-sm"
            : "text-primary hover:bg-white/5"
        }`}
      >
        Sell
      </button>
      <button
        type="button"
        onClick={() => onChange("rent")}
        className={`flex-1 h-full text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
          activeTab === "rent"
            ? "bg-secondary text-white shadow-sm"
            : "text-primary hover:bg-white/5"
        }`}
      >
        Rent / Lease
      </button>
    </div>
  );
}
