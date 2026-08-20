"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Clock,
  Tag,
  Phone,
  Mail,
  User,
  Sparkles,
  Coins,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  sendOtp,
  verifyOtpLogin,
  ApiError,
  createLead,
  checkEnquiryStatus,
  unlockPropertyContact,
} from "@/lib/api";
import { Button } from "../ui/button";
import { PhoneInput } from "@/components/reui/phone-input";
import { message } from "antd";
import BuyPackagesModal from "./BuyPackagesModal";

import type { PropertyEnquirySidebarProps } from "@/types/components";

/** Format seconds remaining into MM:SS for real-time live display */
function formatMinutesSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/** Format seconds remaining into a human-readable string */
function formatCooldown(seconds: number, propertyFor: string): string {
  if (propertyFor === "sell") {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  }
  // rent / lease (30-day cooldown / unlock window)
  const days = Math.floor(seconds / 86400);
  const remainingAfterDays = seconds % 86400;
  const hours = Math.floor(remainingAfterDays / 3600);
  if (days > 0) {
    return hours > 0
      ? `${days} day${days !== 1 ? "s" : ""}, ${hours} hr${hours !== 1 ? "s" : ""}`
      : `${days} day${days !== 1 ? "s" : ""}`;
  }
  const mins = Math.floor(seconds / 60);
  if (hours > 0) {
    return `${hours} hr${hours !== 1 ? "s" : ""}, ${mins % 60} min`;
  }
  return `${mins} min`;
}

/** Badge for property_for type */
function PropertyForBadge({ propertyFor }: { propertyFor?: string }) {
  if (!propertyFor) return null;
  const pf = propertyFor.toLowerCase();
  const config =
    pf === "sell"
      ? {
          label: "For Sale",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        }
      : pf === "rent"
        ? { label: "For Rent", bg: "bg-blue-50 text-blue-700 border-blue-200" }
        : pf === "lease"
          ? {
              label: "For Lease",
              bg: "bg-purple-50 text-purple-700 border-purple-200",
            }
          : null;
  if (!config) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${config.bg}`}
    >
      <Tag size={9} />
      {config.label}
    </span>
  );
}

export default function PropertyEnquirySidebar({
  property,
}: PropertyEnquirySidebarProps) {
  const { isLoggedIn, user, setAuthUser, refreshUser } = useAuth();
  const propertyFor = (property.propertyFor || "sell").toLowerCase();
  const isRentOrLease = propertyFor === "rent" || propertyFor === "lease";
  const pathname = usePathname();
  const returnUrl = property.permalink
    ? `/properties/${property.permalink}`
    : pathname;

  // Common T&C Checkbox
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formError, setFormError] = useState("");

  // ── Enquiry status state (cooldown / points / unlocked) ─────────────────────
  const [statusLoading, setStatusLoading] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState<any>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);

  // ── Live Cooldown countdown timer ──────────────────────────────────────────
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  // Sync remaining seconds into live state whenever enquiryStatus updates
  useEffect(() => {
    if (
      enquiryStatus?.already_enquired &&
      enquiryStatus?.remaining_seconds &&
      enquiryStatus.remaining_seconds > 0
    ) {
      setCooldownSeconds(enquiryStatus.remaining_seconds);
    } else {
      setCooldownSeconds(0);
    }
  }, [enquiryStatus]);

  // Live 1-second interval timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          fetchStatus(); // automatically re-enable form when cooldown completes!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  // ── Logged-out state variables ────────────────────────────────────────────
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // OTP Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // ── Logged-in state variables ─────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "I'm interested in your property...",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOwner, setSubmittedOwner] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  } | null>(null);

  // Helper to extract 10-digit phone number
  const get10DigitPhone = (phoneVal: string) => {
    const digits = phoneVal.replace(/\D/g, "");
    if (digits.startsWith("91") && digits.length > 10) {
      return digits.slice(-10);
    }
    return digits;
  };

  const fetchStatus = async () => {
    setStatusLoading(true);
    try {
      const res = await checkEnquiryStatus(property.id);
      if (res.success) {
        setEnquiryStatus(res.data);
      }
    } catch {
      // silent
    } finally {
      setStatusLoading(false);
    }
  };

  // Sync user details when logged in + fetch enquiry status
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData({
        name: `${user.firstName} ${user.lastName || ""}`.trim(),
        phone: user.phone,
        email: user.email || "",
        message: "I'm interested in your property...",
      });
      setAgreedToTerms(true);
      fetchStatus();
    }
  }, [isLoggedIn, user, property.id]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    const activePhone = get10DigitPhone(phone);
    if (!activePhone || activePhone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }
    setPhoneError("");
    setIsLoading(true);
    try {
      await sendOtp({ phone: activePhone });
      setOtpSent(true);
      setTimeLeft(60);
      setOtp(["", "", "", ""]);
      setOtpError("");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setPhoneError("Phone number is not registered. Please register first.");
      } else if (err instanceof ApiError && err.status === 400) {
        setPhoneError("Invalid phone number format.");
      } else {
        setPhoneError("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (!agreedToTerms) {
      setFormError("You must agree to the Terms & Conditions.");
      return;
    }
    setFormError("");
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setOtpError("Please enter the complete 4-digit OTP");
      return;
    }
    setOtpError("");
    setIsLoading(true);
    try {
      const res = await verifyOtpLogin({
        phone: get10DigitPhone(phone),
        otp: otpValue,
      });
      setAuthUser(res.customer);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setOtpError("Invalid or expired OTP. Please try again.");
      } else {
        setOtpError("Verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectUnlock = async () => {
    setFormError("");
    const availablePoints =
      enquiryStatus?.remaining_points ??
      user?.remainingRentPoints ??
      user?.rentPoints ??
      0;
    if (availablePoints <= 0) {
      setShowPointModal(true);
      return;
    }
    setIsUnlocking(true);
    try {
      const res = await unlockPropertyContact(property.id);
      if (res.success) {
        message.success("Contact details unlocked successfully for 30 days!");
        await fetchStatus();
        await refreshUser();
      }
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 403) {
        setShowPointModal(true);
      } else {
        setFormError(err.message || "Failed to unlock contact info.");
      }
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleEnquireLoggedIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setFormError("You must agree to the Terms & Conditions.");
      return;
    }
    setFormError("");

    const isUnlocked =
      isRentOrLease &&
      (enquiryStatus?.already_unlocked || enquiryStatus?.is_unlocked);
    const availablePoints =
      enquiryStatus?.remaining_points ??
      user?.remainingRentPoints ??
      user?.rentPoints ??
      0;

    // If Rent / Lease property and not yet unlocked, check if points are insufficient
    if (isRentOrLease && !isUnlocked && availablePoints <= 0) {
      setShowPointModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const leadRes = await createLead({
        property_id: property.id,
        name: formData.name,
        phone: get10DigitPhone(formData.phone),
        email: formData.email,
        message: formData.message,
      });

      if (leadRes.data) {
        setSubmittedOwner({
          name: leadRes.data.owner_name,
          phone: leadRes.data.owner_phone,
          email: (leadRes.data as any).owner_email,
        });
      }

      setIsSubmitted(true);
      await refreshUser();
      await fetchStatus();
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          setShowPointModal(true);
        } else if (err.status === 429) {
          // Cooldown hit — refresh status
          const errData = (err as any).data?.data;
          if (errData) setEnquiryStatus(errData);
          else setFormError(err.message);
        } else {
          setFormError(err.message);
        }
      } else {
        setFormError("Failed to submit enquiry. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── RENDER: Success state ─────────────────────────────────────────────────
  if (isSubmitted) {
    const ownerInfo =
      submittedOwner ||
      (enquiryStatus?.owner_phone
        ? {
            name: enquiryStatus.owner_name,
            phone: enquiryStatus.owner_phone,
            email: enquiryStatus.owner_email,
          }
        : null);

    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center space-y-4 animate-fade-in">
        <div className="mx-auto bg-emerald-50 w-14 h-14 rounded-full flex items-center justify-center text-emerald-500">
          <CheckCircle2 size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Enquiry Sent Successfully!
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Thank you for your interest in{" "}
            <span className="font-semibold text-gray-800">{property.name}</span>
            .
          </p>
        </div>

        {/* Display Owner Details Card on Success */}
        {ownerInfo && ownerInfo.phone && ownerInfo.phone !== "-" && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-left space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs border-b border-emerald-200/60 pb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Owner Contact Details</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold">
                  {ownerInfo.name || "Property Owner"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <a
                  href={`tel:${ownerInfo.phone}`}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  {ownerInfo.phone}
                </a>
              </div>
              {ownerInfo.email && ownerInfo.email !== "-" && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <a
                    href={`mailto:${ownerInfo.email}`}
                    className="text-slate-600 hover:underline"
                  >
                    {ownerInfo.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setIsSubmitted(false);
            if (isLoggedIn) {
              fetchStatus();
            }
          }}
          className="w-full bg-[#1a3c6b] hover:bg-[#142e52] text-white font-semibold py-2.5 rounded-xl transition-colors text-xs cursor-pointer shadow-sm"
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  // ── RENDER: Logged in state ───────────────────────────────────────────────
  if (isLoggedIn) {
    const isUnlocked =
      isRentOrLease &&
      (enquiryStatus?.already_unlocked || enquiryStatus?.is_unlocked);
    const availablePoints =
      enquiryStatus?.remaining_points ??
      user?.remainingRentPoints ??
      user?.rentPoints ??
      0;
    const cooldownActive =
      Boolean(enquiryStatus?.already_enquired || cooldownSeconds > 0);

    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        {/* Header with type badge */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Request Info</h3>
          <PropertyForBadge propertyFor={propertyFor} />
        </div>

        {/* ── RENT / LEASE CONTACT UNLOCKED CARD (When enquiry not yet submitted) ──────────────── */}
        {isRentOrLease && isUnlocked && !cooldownActive && (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Contact Details Unlocked</span>
            </div>
            <p className="text-xs text-emerald-700">
              Valid for 30 days. You can contact the owner directly or send an
              enquiry below for free.
            </p>
            {enquiryStatus?.owner_phone && (
              <div className="bg-white rounded-lg p-3 border border-emerald-100 space-y-1.5 text-xs text-slate-800">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">
                    {enquiryStatus.owner_name || "Property Owner"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <a
                    href={`tel:${enquiryStatus.owner_phone}`}
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    {enquiryStatus.owner_phone}
                  </a>
                </div>
                {enquiryStatus.owner_email &&
                  enquiryStatus.owner_email !== "-" && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span>{enquiryStatus.owner_email}</span>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}

        {/* ── COOLDOWN & OWNER DETAILS BLOCK (SELL / RENT / LEASE) ────────────────── */}
        {cooldownActive ? (
          <div className="space-y-4">
            {/* Show Owner Contact Details when already enquired */}
            {enquiryStatus?.owner_phone &&
              enquiryStatus.owner_phone !== "-" && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 space-y-2.5 text-left">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs border-b border-emerald-200 pb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Owner Contact Details</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-800">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold">
                        {enquiryStatus.owner_name || "Property Owner"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <a
                        href={`tel:${enquiryStatus.owner_phone}`}
                        className="font-bold text-emerald-700 hover:underline"
                      >
                        {enquiryStatus.owner_phone}
                      </a>
                    </div>
                    {enquiryStatus.owner_email &&
                      enquiryStatus.owner_email !== "-" && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <a
                            href={`mailto:${enquiryStatus.owner_email}`}
                            className="text-slate-600 hover:underline"
                          >
                            {enquiryStatus.owner_email}
                          </a>
                        </div>
                      )}
                  </div>
                </div>
              )}

            {/* Live Minutes / Days Countdown Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col items-center text-center gap-3">
              <div className="bg-amber-100 w-11 h-11 rounded-full flex items-center justify-center">
                <Clock size={22} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">
                  Enquiry Submitted
                </p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  {isRentOrLease
                    ? "You have already enquired about this property. 30-day cooldown is active before you can send another enquiry."
                    : "You have already enquired about this property. You can send another enquiry once the cooldown timer expires."}
                </p>
              </div>
              <div className="bg-white border border-amber-200/80 rounded-xl px-4 py-2.5 w-full shadow-xs">
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-0.5">
                  {isRentOrLease
                    ? "Cooldown Active (30 Days Validity)"
                    : "Next Enquiry In (Minutes : Seconds)"}
                </p>
                {isRentOrLease ? (
                  <p className="text-xl font-black text-amber-800 tracking-wider">
                    {formatCooldown(cooldownSeconds, propertyFor)} remaining
                  </p>
                ) : (
                  <>
                    <p className="text-2xl font-black text-amber-800 tracking-wider font-mono">
                      {formatMinutesSeconds(cooldownSeconds)}
                    </p>
                    <p className="text-[11px] text-amber-600 mt-0.5 font-medium">
                      {formatCooldown(cooldownSeconds, "sell")} remaining
                    </p>
                  </>
                )}
                {enquiryStatus?.owner_details_expires_at && (
                  <p className="text-[11px] text-amber-600 mt-1 font-medium border-t border-amber-200/60 pt-1.5">
                    Expires on {new Date(enquiryStatus.owner_details_expires_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── ENQUIRY FORM ──────────────────────────────────────────── */
          <form onSubmit={handleEnquireLoggedIn} className="space-y-4">
            {/* Property Name */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Property Name
              </label>
              <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5">
                <span className="text-xs text-gray-500 truncate flex-1 font-medium">
                  {property.name}
                </span>
                <Lock size={13} className="text-gray-400 shrink-0" />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-700 font-medium outline-none focus:border-[#1a3c6b] focus:bg-white transition-colors"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Phone
              </label>
              <PhoneInput
                defaultCountry="IN"
                value={formData.phone}
                onChange={(val) =>
                  setFormData({ ...formData, phone: val || "" })
                }
                className="w-full text-xs [&_button]:h-9 [&_input]:h-9 [&_input]:rounded-r-lg [&_button]:rounded-l-lg [&_input]:bg-gray-100 [&_button]:bg-gray-100 [&_input]:border-gray-200 [&_button]:border-gray-200"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-700 font-medium outline-none focus:border-[#1a3c6b] focus:bg-white transition-colors"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Message
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-700 font-medium outline-none focus:border-[#1a3c6b] focus:bg-white transition-colors resize-none"
              />
            </div>

            {/* T&C Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms-loggedin"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#1a3c6b] rounded border-gray-300 focus:ring-[#1a3c6b] cursor-pointer"
              />
              <label
                htmlFor="terms-loggedin"
                className="text-[11px] text-gray-500 leading-tight"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-[#1a3c6b] hover:underline font-semibold"
                >
                  Terms &amp; Conditions
                </Link>{" "}
                and acknowledge Houselink may contact me regarding this
                property.
              </label>
            </div>

            {formError && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                <AlertCircle size={13} className="shrink-0" />
                {formError}
              </p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gradient"
              disabled={isLoading || !agreedToTerms || statusLoading}
              className="w-full font-extrabold text-sm py-2.5 px-4 rounded-xl shadow transition-all duration-200 active:scale-[0.98] cursor-pointer text-center"
            >
              {isLoading || statusLoading ? "Please wait..." : "Send Enquiry"}
            </Button>
          </form>
        )}

        {/* ── IN-PAGE BUY PACKAGES MODAL ──────────────────────────────────── */}
        <BuyPackagesModal
          open={showPointModal}
          onOpenChange={setShowPointModal}
          propertyId={property.id}
          propertyName={property.name}
          onSuccess={async () => {
            await refreshUser();
            await fetchStatus();
            if (isRentOrLease) {
              await handleDirectUnlock();
            }
          }}
        />
      </div>
    );
  }

  // ── RENDER: Logged out state ──────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-gray-900">
          Login/Signup to Request Info
        </h3>
        <PropertyForBadge propertyFor={propertyFor} />
      </div>

      {/* Property Name */}
      <p className="text-xs text-gray-400 mb-1 mt-3">Property Name</p>
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 mb-4">
        <span className="text-xs text-gray-600 truncate flex-1">
          {property.name}
        </span>
        <Lock size={13} className="text-gray-400 shrink-0" />
      </div>

      {/* Mobile Input */}
      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-600 block mb-1">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <PhoneInput
              defaultCountry="IN"
              value={phone}
              onChange={(val) => {
                setPhone(val || "");
                if (otpSent) setOtpSent(false);
              }}
              disabled={otpSent}
              className="w-full text-xs [&_button]:h-9 [&_input]:h-9 [&_input]:rounded-r-lg [&_button]:rounded-l-lg [&_input]:bg-gray-50 [&_button]:bg-gray-50 [&_input]:border-gray-200 [&_button]:border-gray-200"
            />
          </div>
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={isLoading || (otpSent && timeLeft > 0)}
            className="px-3 py-1.5 bg-[#1a3c6b] hover:bg-[#142e52] disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer"
          >
            {isLoading
              ? "..."
              : otpSent
                ? timeLeft > 0
                  ? `${timeLeft}s`
                  : "Resend"
                : "Send OTP"}
          </button>
        </div>
        {phoneError && (
          <p className="text-xs text-red-500 mt-1">{phoneError}</p>
        )}
      </div>

      {/* OTP Input — only shown after OTP sent */}
      {otpSent && (
        <div className="mb-4 space-y-2">
          <label className="text-xs font-semibold text-gray-600 block">
            Enter 4-Digit OTP <span className="text-red-500">*</span>
          </label>
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={otpRefs[i]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="w-12 h-11 text-center font-bold text-base bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1a3c6b] focus:bg-white transition-colors"
              />
            ))}
          </div>
          {otpError && <p className="text-xs text-red-500">{otpError}</p>}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Didn't receive code?</span>
            {timeLeft > 0 ? (
              <span className="text-gray-500 font-medium">
                Resend in {timeLeft}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-[#1a3c6b] hover:underline font-semibold cursor-pointer"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      )}

      {/* T&C Checkbox */}
      <div className="flex items-start gap-2 mb-4">
        <input
          type="checkbox"
          id="terms-loggedout"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 w-4 h-4 text-[#1a3c6b] rounded border-gray-300 focus:ring-[#1a3c6b] cursor-pointer"
        />
        <label
          htmlFor="terms-loggedout"
          className="text-[11px] text-gray-500 leading-tight"
        >
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-[#1a3c6b] hover:underline font-semibold"
          >
            Terms &amp; Conditions
          </Link>{" "}
          and acknowledge Houselink may contact me regarding this property.
        </label>
      </div>

      {formError && (
        <p className="text-xs text-red-500 font-medium mb-3 flex items-center gap-1">
          <AlertCircle size={13} className="shrink-0" />
          {formError}
        </p>
      )}

      {/* Verify & Login Button */}
      {otpSent && (
        <Button
          type="button"
          variant="gradient"
          onClick={handleVerifyOtp}
          disabled={isLoading || !agreedToTerms}
          className="w-full font-extrabold text-sm py-2.5 px-4 rounded-xl shadow transition-all duration-200 active:scale-[0.98] cursor-pointer text-center"
        >
          {isLoading ? "Verifying..." : "Verify & Continue"}
        </Button>
      )}
    </div>
  );
}
