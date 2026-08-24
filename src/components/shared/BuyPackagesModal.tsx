"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getPackagesList,
  createCheckoutOrder,
  verifyCheckoutPayment,
  reportFailedPayment,
  getCustomerInvoices,
  type Package,
  type UserInvoice,
} from "@/lib/api";
import { message } from "antd";

interface BuyPackagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId?: number;
  propertyName?: string;
  onSuccess?: () => void;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BuyPackagesModal({
  open,
  onOpenChange,
  propertyId,
  propertyName,
  onSuccess,
}: BuyPackagesModalProps) {
  const { user, refreshUser } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [invoices, setInvoices] = useState<UserInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<number | null>(null);

  // Load packages
  useEffect(() => {
    if (!open) return;
    async function fetchPkgs() {
      try {
        setLoading(true);
        const data = await getPackagesList();
        setPackages(data);
      } catch (err) {
        console.error("Failed to load rent packages in modal:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPkgs();
  }, [open]);

  // Load user invoices to match active plan
  useEffect(() => {
    if (!open || !user?.id) return;
    async function loadUserInvoices() {
      try {
        const invs = await getCustomerInvoices(Number(user?.id));
        setInvoices(invs);
      } catch (err) {
        console.error("Failed to load invoices in modal:", err);
      }
    }
    loadUserInvoices();
  }, [open, user?.id]);

  // Rent / Lease unlock balance
  const rentUnlockPoints = user?.remainingRentPoints ?? user?.rentPoints ?? 0;
  const hasRentCredits = rentUnlockPoints > 0;

  // Active package helper identical to dashboard/credits
  const getActivePackageId = (): number | null => {
    if (!hasRentCredits) return null;

    const matching = invoices.filter((inv) => {
      const invStatus = String(inv.status).toLowerCase();
      if (invStatus !== "paid" && invStatus !== "successful") return false;
      return inv.package_type === "rent";
    });

    if (matching.length === 0) return null;

    const latest = matching.reduce((latest, current) => {
      return new Date(current.created_at).getTime() > new Date(latest.created_at).getTime() ? current : latest;
    }, matching[0]);

    if (latest.package_id && typeof latest.package_id === "string" && latest.package_id.startsWith("pkg_")) {
      return Number(latest.package_id.replace("pkg_", ""));
    }
    return Number(latest.package_id);
  };

  const handleBuyPackage = async (pkg: Package) => {
    if (!user) {
      message.warning("Please log in to purchase credit packages.");
      return;
    }

    if (hasRentCredits) {
      message.error(
        "You already have active credits in this category. You cannot purchase another package until they are exhausted."
      );
      return;
    }

    try {
      setBuyingId(pkg.id);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        message.error(
          "Failed to load Razorpay Payment Gateway script. Please check your connection."
        );
        return;
      }

      // Create backend checkout order
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
              message.success(
                `Payment successful! ${pkg.noOfCredit} credits have been added to your account.`
              );
              await refreshUser();
              onOpenChange(false);
              onSuccess?.();
            } else {
              message.error(
                "Payment verification failed. Please contact support."
              );
            }
          } catch (err: any) {
            message.error(err.message || "Payment verification failed.");
          } finally {
            setBuyingId(null);
          }
        },
        prefill: {
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.username,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#153e75",
        },
        modal: {
          ondismiss: () => {
            setBuyingId(null);
            // Reopen packages modal if dismissed without completing payment
            onOpenChange(true);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", async (failResponse: any) => {
        try {
          await reportFailedPayment({
            razorpay_order_id:
              failResponse.error?.metadata?.order_id || orderData.orderId,
            reason: failResponse.error?.reason || failResponse.error?.description,
            error_description: failResponse.error?.description,
          });
        } catch (e) {
          console.error("Failed to log failed payment", e);
        }
      });

      // Temporarily close Dialog so Radix focus-trap and overlay don't block clicks on Razorpay's iframe
      onOpenChange(false);
      rzp.open();
    } catch (err: any) {
      message.error(
        err.message || "Something went wrong while initiating payment"
      );
      setBuyingId(null);
    }
  };

  // Filter ONLY Rent / Lease packages
  const rentPackages = packages.filter(
    (p) => !p.isGuest && p.type === "rent"
  );

  const activePackageId = getActivePackageId();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl lg:max-w-6xl w-[95vw] max-h-[92vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-2xl">
        <DialogHeader className="p-0 text-left border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-2xl font-bold text-ink">
                Buy Packages
              </DialogTitle>
              <p className="text-xs text-ink-muted mt-1">
                {propertyName
                  ? `Choose a rent package to unlock contact details for "${propertyName}"`
                  : "For Tenants / Property Seekers"}
              </p>
            </div>
            {/* Quick balance pill matching dashboard */}
            <div className="flex items-center">
              <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200 font-semibold text-xs">
                Rent Unlock: <strong>{rentUnlockPoints}</strong> pts
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Packages Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-3xl p-6 flex flex-col items-center h-[380px] animate-pulse"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-3" />
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="h-10 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-10 bg-gray-200 rounded w-full mt-auto" />
              </div>
            ))}
          </div>
        ) : rentPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {rentPackages.map((pkg, idx) => {
              const numPrice = Number(pkg.price);
              const numFinalPrice =
                pkg.finalPrice !== null ? Number(pkg.finalPrice) : null;
              const priceVal =
                numFinalPrice !== null ? numFinalPrice : numPrice;
              const originalVal = numPrice;
              const formattedPrice = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(priceVal);

              const hasSavings =
                numFinalPrice !== null && numFinalPrice < numPrice;
              const rawSavings = hasSavings
                ? ((originalVal - priceVal) / originalVal) * 100
                : 0;
              const savingsPercent =
                rawSavings % 1 === 0
                  ? rawSavings.toFixed(0)
                  : rawSavings.toFixed(1);

              const isThisPackageActive = activePackageId === pkg.id;
              const isDarkCard =
                (hasSavings || idx === 1) && !isThisPackageActive && !hasRentCredits;

              return (
                <div
                  key={pkg.id}
                  className={cn(
                    "relative rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-all duration-300 border min-h-[380px] text-left",
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
                        isDarkCard
                          ? "bg-[#2563eb]/20 text-[#38bdf8]"
                          : "bg-[#e0e7ff] text-[#163D75]"
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
                    <p
                      className={cn(
                        "text-xs mt-1",
                        isDarkCard ? "text-white/60" : "text-ink-muted"
                      )}
                    >
                      For Tenants / Property Seekers
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
                      disabled={hasRentCredits || buyingId === pkg.id}
                      className={cn(
                        "w-full font-bold text-sm py-2 rounded-[50px] transition-all duration-200 shadow-sm border cursor-pointer",
                        isThisPackageActive
                          ? "border-[#163D75] bg-[#163D75]/10 text-[#163D75] cursor-not-allowed shadow-none"
                          : hasRentCredits
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
                          : "Buy Plan"}
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
                  {pkg.features && pkg.features.length > 0 && (
                    <ul
                      className={cn(
                        "text-xs space-y-1.5 w-full shrink-0",
                        isDarkCard ? "text-white/80" : "text-ink-secondary"
                      )}
                    >
                      {pkg.features.map((point, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <i className="fa-regular fa-circle-check text-sm opacity-80" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-gray-50 border border-gray-100 rounded-xl mt-4">
            <p className="font-semibold text-gray-500">
              No rent packages published yet.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
