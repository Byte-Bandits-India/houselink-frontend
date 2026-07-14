"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { getPackagesList, createCheckoutOrder, verifyCheckoutPayment, getCustomerInvoices, type Package, type UserInvoice } from "@/lib/api";
import { message } from "antd";
import PurposeToggle from "@/components/shared/PurposeToggle";

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
  const [invoices, setInvoices] = useState<UserInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("sell");
  const [userTab, setUserTab] = useState<UserTab>("owners");
  const [buyingId, setBuyingId] = useState<number | null>(null);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await getPackagesList();
      setPackages(data);
    } catch (err) {
      console.error("Failed to load packages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        await refreshUser();
      } catch (err) {
        console.error("Failed to refresh user profile:", err);
      }
      loadPackages();
    }
    init();
  }, [refreshUser]);

  useEffect(() => {
    async function loadUserInvoices() {
      if (user?.id) {
        try {
          const invs = await getCustomerInvoices(Number(user.id));
          setInvoices(invs);
        } catch (err) {
          console.error("Failed to load invoices:", err);
        }
      }
    }
    loadUserInvoices();
  }, [user?.id]);

  // 1. Separate user credits by type
  let ownerCreditsLeft = user?.creditPointsOwner ?? 0;
  let builderCreditsLeft = user?.creditPointsBuilder ?? 0;
  let consultantCreditsLeft = user?.creditPointsConsultant ?? 0;

  // 2. Sort invoices by created_at desc (most recent first) to allocate points properly
  const sortedInvoices = [...invoices].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  let ownerSellCredits = 0;
  let builderSellCredits = 0;
  let consultantSellCredits = 0;
  let rentCredits = 0;

  sortedInvoices.forEach((inv) => {
    const type: "sell" | "rent" = inv.package_type === "rent" ? "rent" : "sell";
    const userType = inv.user_type || "Owner";

    let allocatedCredits = 0;
    const totalPoints = inv.no_of_credit;

    if (inv.status === "Paid") {
      if (type === "rent") {
        allocatedCredits = Math.min(totalPoints, ownerCreditsLeft);
        ownerCreditsLeft -= allocatedCredits;
        rentCredits += allocatedCredits;
      } else {
        const uType = userType.toLowerCase();
        if (uType === "builder") {
          allocatedCredits = Math.min(totalPoints, builderCreditsLeft);
          builderCreditsLeft -= allocatedCredits;
          builderSellCredits += allocatedCredits;
        } else if (uType === "consultant") {
          allocatedCredits = Math.min(totalPoints, consultantCreditsLeft);
          consultantCreditsLeft -= allocatedCredits;
          consultantSellCredits += allocatedCredits;
        } else {
          allocatedCredits = Math.min(totalPoints, ownerCreditsLeft);
          ownerCreditsLeft -= allocatedCredits;
          ownerSellCredits += allocatedCredits;
        }
      }
    }
  });

  // Add any leftover credits (e.g. from manual admin adjustments)
  ownerSellCredits += ownerCreditsLeft;
  builderSellCredits += builderCreditsLeft;
  consultantSellCredits += consultantCreditsLeft;

  const hasOwnerCredits = ownerSellCredits > 0;
  const hasBuilderCredits = builderSellCredits > 0;
  const hasConsultantCredits = consultantSellCredits > 0;
  const hasRentCredits = rentCredits > 0;

  // Helper to check if a specific package is the active one
  const getActivePackageId = (userType: string, isRent: boolean): number | null => {
    const hasCredits =
      (userType.toLowerCase() === "owner" && !isRent && ownerSellCredits > 0) ||
      (userType.toLowerCase() === "builder" && !isRent && builderSellCredits > 0) ||
      (userType.toLowerCase() === "consultant" && !isRent && consultantSellCredits > 0) ||
      (isRent && rentCredits > 0);

    if (!hasCredits) return null;

    const matching = invoices.filter((inv) => {
      const invStatus = String(inv.status).toLowerCase();
      if (invStatus !== "paid" && invStatus !== "successful") return false;
      const invType = inv.package_type === "rent" ? "rent" : "sell";
      if (isRent) {
        return invType === "rent";
      } else {
        if (invType === "rent") return false;
        const invUserType = inv.user_type || "Owner";
        return invUserType.toLowerCase() === userType.toLowerCase();
      }
    });

    if (matching.length === 0) return null;

    const latest = matching.reduce((latest, current) => {
      return new Date(current.created_at).getTime() > new Date(latest.created_at).getTime() ? current : latest;
    }, matching[0]);

    if (latest.package_id && typeof latest.package_id === 'string' && latest.package_id.startsWith("pkg_")) {
      return Number(latest.package_id.replace("pkg_", ""));
    }
    return Number(latest.package_id);
  };

  const handleBuyPackage = async (pkg: Package) => {
    if (!user) {
      message.warning("Please log in to purchase credit packages.");
      return;
    }

    const uType = pkg.userType?.toLowerCase();
    const alreadyHasCredits =
      (uType === "owner" && hasOwnerCredits) ||
      (uType === "builder" && hasBuilderCredits) ||
      (uType === "consultant" && hasConsultantCredits) ||
      (pkg.type === "rent" && hasRentCredits);

    if (alreadyHasCredits) {
      message.error("You already have active credits in this category. You cannot purchase another package until they are exhausted.");
      return;
    }

    try {
      setBuyingId(pkg.id);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        message.error("Failed to load Razorpay Payment Gateway script. Please check your connection.");
        return;
      }

      // Create backend order
      const orderRes = await createCheckoutOrder(Number(user.id), pkg.id);
      if (!orderRes.success) {
        message.error("Failed to initiate order. Please try again.");
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
              message.success(`Payment successful! ${pkg.noOfCredit} credits have been added to your account.`);
              window.location.href = "/dashboard/packages";
            } else {
              message.error("Payment verification failed. Please contact support.");
            }
          } catch (err: any) {
            message.error(err.message || "Payment verification failed.");
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
      message.error(err.message || "Something went wrong while initiating payment");
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
    if (p.isGuest) return false;
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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-brand">Dashboard</h1>
        <div className="flex gap-2">
          <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center min-h-[260px] animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-full mb-3" />
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-10 bg-gray-200 rounded w-full mt-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">Buy Packages</h1>

      {/* Sell / Rent-Lease toggle */}
      <PurposeToggle value={filter} onChange={setFilter} />

      {/* Owner / Builder / Consultant tabs — only for sell */}
      {filter === "sell" && (
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
           {sellTabs.map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setUserTab(tab.key)}
              className={cn(
                "flex-1 py-3 text-sm font-semibold transition-colors duration-200 border-r border-gray-200 last:border-r-0 rounded-none h-auto",
                userTab === tab.key
                  ? "bg-gradient-to-r from-primary to-secondary text-white"
                  : "bg-white text-ink hover:bg-slate-50"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      )}

      {/* Cards */}
      {activePackages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {activePackages.map((pkg, idx) => {
            const numPrice = Number(pkg.price);
            const numFinalPrice = pkg.finalPrice !== null ? Number(pkg.finalPrice) : null;
            const priceVal = numFinalPrice !== null ? numFinalPrice : numPrice;
            const originalVal = numPrice;
            const formattedPrice = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(priceVal);

            const hasSavings = numFinalPrice !== null && numFinalPrice < numPrice;
            const rawSavings = hasSavings
              ? ((originalVal - priceVal) / originalVal) * 100
              : 0;
            const savingsPercent = rawSavings % 1 === 0 ? rawSavings.toFixed(0) : rawSavings.toFixed(1);

            const activePackageId = getActivePackageId(pkg.userType || "Owner", pkg.type === "rent");
            const isThisPackageActive = activePackageId === pkg.id;

            const uType = pkg.userType?.toLowerCase();
            const alreadyHasCredits =
              (uType === "owner" && hasOwnerCredits) ||
              (uType === "builder" && hasBuilderCredits) ||
              (uType === "consultant" && hasConsultantCredits) ||
              (pkg.type === "rent" && hasRentCredits);

            const isDarkCard = (hasSavings || idx === 1) && !isThisPackageActive && !alreadyHasCredits;

            return (
              <div
                key={pkg.id}
                className={cn(
                  "relative rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-all duration-300 border h-[380px] text-left",
                  isThisPackageActive
                    ? "bg-white border-[#163D75] shadow-sm text-ink"
                    : isDarkCard
                      ? "bg-gradient-to-b from-[#243555] to-[#141E30] border-transparent hover:shadow-md text-white"
                      : "bg-white border-[#163D75]/35 hover:shadow-md text-ink"
                )}
              >
                {hasSavings && (
                  <div className="absolute top-0 right-0 z-10 bg-[#347ED7] text-white text-[12px] font-semibold px-4 py-1.5 rounded-tr-[24px] rounded-bl-2xl shadow-sm">
                    save {savingsPercent}%
                  </div>
                )}

                {/* Top Section: Icon, Plan Name, Target Role, Price */}
                <div className="flex flex-col items-start w-full">
                  {/* Icon Box */}
                  <div
                    className={cn(
                      "rounded-xl w-10 h-10 flex items-center justify-center mb-4 shrink-0",
                      isDarkCard ? "bg-[#2563eb]/20 text-[#38bdf8]" : "bg-[#e0e7ff] text-[#163D75]"
                    )}
                  >
                    <i
                      className={cn(
                        "fa-solid text-base",
                        idx === 1 ? "fa-fire" : idx === 2 ? "fa-star" : "fa-bolt"
                      )}
                    />
                  </div>

                  {/* Plan Details */}
                  <h4
                    className={cn(
                      "text-xl font-bold leading-tight tracking-tight",
                      isDarkCard ? "text-white" : "text-[#163D75]"
                    )}
                  >
                    {pkg.name}
                  </h4>
                  <p className={cn("text-xs mt-1", isDarkCard ? "text-white/60" : "text-ink-muted")}>
                    For {pkg.userType || "Users"}
                  </p>

                  {/* Price info */}
                  <div className="flex items-baseline gap-2 mt-3 w-full">
                    <span
                      className={cn(
                        "text-3xl font-extrabold tracking-tight",
                        isDarkCard ? "text-white" : "text-[#163D75]"
                      )}
                    >
                      {formattedPrice}
                    </span>
                    {hasSavings && (
                      <span
                        className={cn(
                          "text-base line-through font-medium",
                          isDarkCard ? "text-white/40" : "text-slate-400"
                        )}
                      >
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(originalVal)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Button Action */}
                <div className="w-full shrink-0 my-3">
                  <Button
                    onClick={() => handleBuyPackage(pkg)}
                    disabled={alreadyHasCredits || buyingId === pkg.id}
                    className={cn(
                      "w-full font-bold text-sm py-2 rounded-[50px] transition-all duration-200 shadow-sm border",
                      isThisPackageActive
                        ? "border-[#163D75] bg-[#163D75]/10 text-[#163D75] cursor-not-allowed shadow-none"
                        : alreadyHasCredits
                          ? isDarkCard
                            ? "bg-slate-800 text-slate-500 border-transparent cursor-not-allowed"
                            : "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed"
                          : "bg-gradient-to-r from-primary to-secondary text-white border-transparent hover:brightness-110 shadow-primary/20"
                    )}
                  >
                    {buyingId === pkg.id
                      ? "Processing..."
                      : isThisPackageActive
                        ? "Active Plan"
                        : "Buy Plan"
                    }
                  </Button>
                </div>

                {/* Dotted Divider */}
                <div
                  className={cn(
                    "w-full border-t border-dashed mb-3 shrink-0",
                    isDarkCard ? "border-white/20" : "border-gray-200"
                  )}
                />

                {/* Feature Bullet List */}
                <ul
                  className={cn(
                    "text-xs space-y-1.5 w-full shrink-0",
                    isDarkCard ? "text-white/80" : "text-ink-secondary"
                  )}
                >
                  <li className="flex items-center gap-2">
                    <i className="fa-regular fa-circle-check text-sm opacity-80" />
                    <span>{pkg.noOfCredit} posts till the plan expires</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fa-regular fa-circle-check text-sm opacity-80" />
                    <span>Valid up-to {pkg.totalDaysLimit ? `${Math.round(pkg.totalDaysLimit / 30)} month${Math.round(pkg.totalDaysLimit / 30) > 1 ? 's' : ''}` : "1 month"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fa-regular fa-circle-check text-sm opacity-80" />
                    <span>Basic Listings</span>
                  </li>
                </ul>
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
