"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getPackagesList, createCheckoutOrder, verifyCheckoutPayment, type Package } from "@/lib/api";

type Filter = "sell" | "rent";
type UserTab = "owners" | "builders" | "consultants";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CreditsPage() {
  const { user, refreshUser } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("sell");
  const [userTab, setUserTab] = useState<UserTab>("owners");
  const [buyingId, setBuyingId] = useState<number | null>(null);

  const loadPackages = async () => {
    try {
      setLoading(true);
      // Load/refresh user credit details to get absolute latest values
      try {
        await refreshUser();
      } catch (err) {
        console.error("Failed to load active user profile", err);
      }
      const data = await getPackagesList();
      setPackages(data);
    } catch (err) {
      console.error("Failed to load packages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleBuyPackage = async (pkg: Package) => {
    if (!user) {
      alert("Please log in to purchase credit packages.");
      return;
    }

    const hasOwnerCredits = (user.creditPointsOwner ?? 0) > 0;
    const hasBuilderCredits = (user.creditPointsBuilder ?? 0) > 0;
    const hasConsultantCredits = (user.creditPointsConsultant ?? 0) > 0;

    const uType = pkg.userType?.toLowerCase();
    const alreadyHasCredits =
      (uType === "owner" && hasOwnerCredits) ||
      (uType === "builder" && hasBuilderCredits) ||
      (uType === "consultant" && hasConsultantCredits) ||
      (pkg.type === "rent" && hasOwnerCredits);

    if (alreadyHasCredits) {
      alert("You already have active credit points for this category. You cannot purchase another package until they are exhausted.");
      return;
    }

    try {
      setBuyingId(pkg.id);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay Payment Gateway script. Please check your connection.");
        return;
      }

      // Create backend order
      const orderRes = await createCheckoutOrder(Number(user.id), pkg.id);
      if (!orderRes.success) {
        alert("Failed to initiate order. Please try again.");
        return;
      }

      const orderData = orderRes.data;

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Houselink Properties",
        description: `Purchase Package: ${pkg.name}`,
        image: "/icon/award.png",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            setBuyingId(pkg.id);
            const verifyRes = await verifyCheckoutPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              alert(`Payment successful! ${pkg.noOfCredit} credits have been added to your account.`);
              window.location.href = "/dashboard/packages";
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err: any) {
            alert(err.message || "Payment verification failed.");
          } finally {
            setBuyingId(null);
          }
        },
        prefill: {
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#153e75",
        },
        modal: {
          ondismiss: () => {
            setBuyingId(null);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message || "Something went wrong while initiating payment");
      setBuyingId(null);
    }
  };

  const sellTabs: { key: UserTab; label: string }[] = [
    { key: "owners", label: "Owners" },
    { key: "builders", label: "Builders" },
    { key: "consultants", label: "Consultants" },
  ];

  // Filtering
  const activePackages = packages.filter((p) => {
    const mappedFilter = filter === "sell" ? "buy" : "rent";
    if (p.type !== mappedFilter) return false;
    if (mappedFilter === "buy") {
      if (userTab === "owners") return p.userType?.toLowerCase() === "owner";
      if (userTab === "builders") return p.userType?.toLowerCase() === "builder";
      if (userTab === "consultants") return p.userType?.toLowerCase() === "consultant";
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="h-10 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded w-32" />
        </div>
        <div className="h-12 bg-gray-200 rounded w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center h-[280px]">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-4" />
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="h-10 bg-gray-200 rounded w-full mt-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Pre-calculate credit status
  const hasOwnerCredits = (user?.creditPointsOwner ?? 0) > 0;
  const hasBuilderCredits = (user?.creditPointsBuilder ?? 0) > 0;
  const hasConsultantCredits = (user?.creditPointsConsultant ?? 0) > 0;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">Buy Packages</h1>

      {/* Sell / Rent-Lease toggle */}
      <div className="flex gap-2">
        {(["sell", "rent"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold border-2 transition-colors duration-200",
              filter === f ? "bg-brand border-brand text-white" : "bg-white border-brand text-brand hover:bg-brand hover:text-white"
            )}
          >
            {f === "sell" ? "Sell" : "Rent/Lease"}
          </button>
        ))}
      </div>

      {/* Owner / Builder / Consultant tabs — only for sell */}
      {filter === "sell" && (
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          {sellTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setUserTab(tab.key)}
              className={cn(
                "flex-1 py-3 text-sm font-semibold transition-colors duration-200 border-r border-gray-200 last:border-r-0",
                userTab === tab.key ? "bg-brand text-white" : "bg-white text-brand hover:bg-brand/10"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Cards */}
      {activePackages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {activePackages.map((pkg) => {
            const priceVal = pkg.finalPrice !== null ? pkg.finalPrice : pkg.price;
            const originalVal = pkg.price;
            const formattedPrice = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(priceVal);

            const hasSavings = pkg.finalPrice !== null && pkg.finalPrice < pkg.price;
            const savingsPercent = hasSavings
              ? Math.round(((Number(originalVal) - Number(priceVal)) / Number(originalVal)) * 100)
              : 0;

            const uType = pkg.userType?.toLowerCase();
            const alreadyHasCredits =
              (uType === "owner" && hasOwnerCredits) ||
              (uType === "builder" && hasBuilderCredits) ||
              (uType === "consultant" && hasConsultantCredits) ||
              (pkg.type === "rent" && hasOwnerCredits);

            return (
              <div
                key={pkg.id}
                className={cn(
                  "relative bg-white border rounded-2xl p-4 flex flex-col items-center text-center shadow-md transition-all duration-200",
                  alreadyHasCredits 
                    ? "border-emerald-200/80 bg-emerald-50/10 shadow-sm"
                    : "border-gray-100 hover:shadow-lg"
                )}
              >
                {hasSavings && !alreadyHasCredits && (
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-tr-2xl rounded-bl-xl animate-bounce">
                    SAVE {savingsPercent}%
                  </div>
                )}

                {alreadyHasCredits && (
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-tr-2xl rounded-bl-xl">
                    ACTIVE
                  </div>
                )}

                <div className="mt-2 mb-2">
                  <div className="w-16 h-16 flex items-center justify-center mx-auto">
                    <img className="w-16 h-16" src="/icon/award.png" alt="" />
                  </div>
                </div>

                <p className="text-lg font-bold text-ink">
                  {formattedPrice}{" "}
                  <span className="text-ink-secondary font-normal text-sm">/ {pkg.noOfCredit} credits</span>
                </p>
                {hasSavings && (
                  <p className="text-xs line-through text-slate-400">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(originalVal)}
                  </p>
                )}
                <p className="text-base font-semibold text-ink mt-0.5">{pkg.name}</p>
                {pkg.description && <p className="text-sm text-ink-secondary mt-0.5">{pkg.description}</p>}
                {pkg.totalDaysLimit && (
                  <p className="text-sm text-ink-secondary mb-3">{pkg.totalDaysLimit} Days validity</p>
                )}

                <button
                  onClick={() => handleBuyPackage(pkg)}
                  disabled={alreadyHasCredits || buyingId === pkg.id}
                  className={cn(
                    "w-full mt-auto border-2 font-bold text-sm py-2.5 rounded-lg transition-colors duration-200",
                    alreadyHasCredits
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 cursor-not-allowed"
                      : "border-brand text-brand hover:bg-brand hover:text-white disabled:opacity-50"
                  )}
                >
                  {buyingId === pkg.id
                    ? "Processing..."
                    : alreadyHasCredits
                      ? "Active Package Exists"
                      : "Buy Package"
                  }
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-gray-50 border border-gray-100 rounded-xl">
          <p className="font-semibold text-gray-500">No {filter} packages published for {userTab} yet.</p>
        </div>
      )}
    </div>
  );
}
