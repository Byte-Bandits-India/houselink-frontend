"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  Tag,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sendOtp, verifyOtpLogin, ApiError, createLead, checkEnquiryStatus } from "@/lib/api";
import type { EnquiryStatusResponse } from "@/lib/api";
import { Button } from "../ui/button";
import { PhoneInput } from "@/components/reui/phone-input";

import type { PropertyEnquirySidebarProps } from "@/types/components";

/** Format seconds remaining into a human-readable string */
function formatCooldown(seconds: number, propertyFor: string): string {
  if (propertyFor === "sell") {
    const mins = Math.ceil(seconds / 60);
    return mins <= 60 ? `${mins} minute${mins !== 1 ? "s" : ""}` : `${Math.ceil(mins / 60)} hour${Math.ceil(mins / 60) !== 1 ? "s" : ""}`;
  }
  // rent / lease
  const days = Math.ceil(seconds / 86400);
  return `${days} day${days !== 1 ? "s" : ""}`;
}

/** Badge for property_for type */
function PropertyForBadge({ propertyFor }: { propertyFor?: string }) {
  if (!propertyFor) return null;
  const pf = propertyFor.toLowerCase();
  const config =
    pf === "sell"
      ? { label: "For Sale", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" }
      : pf === "rent"
      ? { label: "For Rent", bg: "bg-blue-50 text-blue-700 border-blue-200" }
      : pf === "lease"
      ? { label: "For Lease", bg: "bg-purple-50 text-purple-700 border-purple-200" }
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

export default function PropertyEnquirySidebar({ property }: PropertyEnquirySidebarProps) {
  const { isLoggedIn, user, setAuthUser } = useAuth();
  const propertyFor = (property.propertyFor || "sell").toLowerCase();

  // Common T&C Checkbox
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formError, setFormError] = useState("");

  // ── Enquiry status state (cooldown / points) ──────────────────────────────
  const [statusLoading, setStatusLoading] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState<EnquiryStatusResponse["data"] | null>(null);

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

  // Helper to extract 10-digit phone number
  const get10DigitPhone = (phoneVal: string) => {
    const digits = phoneVal.replace(/\D/g, "");
    if (digits.startsWith("91") && digits.length > 10) {
      return digits.slice(-10);
    }
    return digits;
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

      // Pre-flight: check cooldown + points
      setStatusLoading(true);
      checkEnquiryStatus(property.id)
        .then((res) => {
          if (res.success) setEnquiryStatus(res.data);
        })
        .catch(() => {/* silent — don't block the form */})
        .finally(() => setStatusLoading(false));
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

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyAndEnquireLoggedOut = async () => {
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
      const res = await verifyOtpLogin({ phone: get10DigitPhone(phone), otp: otpValue });
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

  const handleEnquireLoggedIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setFormError("You must agree to the Terms & Conditions.");
      return;
    }
    setFormError("");
    setIsLoading(true);
    try {
      await createLead({
        property_id: property.id,
        name: formData.name,
        phone: get10DigitPhone(formData.phone),
        email: formData.email,
        message: formData.message,
      });
      setIsSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 429) {
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
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center space-y-4 animate-fade-in">
        <div className="mx-auto bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center text-emerald-500">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Enquiry Sent!</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Thank you for your interest in{" "}
          <span className="font-semibold text-gray-800">{property.name}</span>.
        </p>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          The owner/agent will contact you shortly on your registered details.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            // Re-check status after enquiry so cooldown reflects immediately
            if (isLoggedIn) {
              checkEnquiryStatus(property.id)
                .then((res) => { if (res.success) setEnquiryStatus(res.data); })
                .catch(() => {});
            }
          }}
          className="w-full bg-[#1a3c6b] hover:bg-[#142e52] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  // ── RENDER: Logged in state ───────────────────────────────────────────────
  if (isLoggedIn) {
    const cooldownActive = enquiryStatus && !enquiryStatus.can_enquire && !!enquiryStatus.remaining_seconds;

    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        {/* Header with type badge */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Request Info</h3>
          <PropertyForBadge propertyFor={propertyFor} />
        </div>

        {/* ── COOLDOWN BLOCK ─────────────────────────────────────────── */}
        {cooldownActive ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col items-center text-center gap-3">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center">
                <Clock size={24} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">Already Enquired</p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  You have already enquired about this property.{" "}
                  {propertyFor === "sell"
                    ? "You can enquire again after the 60-minute cooldown."
                    : "You can enquire again after the 30-day cooldown."}
                </p>
              </div>
              <div className="bg-white border border-amber-200 rounded-lg px-4 py-2 w-full">
                <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider mb-0.5">
                  Time Remaining
                </p>
                <p className="text-base font-bold text-amber-700">
                  {formatCooldown(enquiryStatus!.remaining_seconds!, propertyFor)}
                </p>
              </div>
              {enquiryStatus?.owner_details_expires_at && (
                <p className="text-[10px] text-amber-600">
                  Cooldown ends:{" "}
                  {new Date(enquiryStatus.owner_details_expires_at).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>
        ) : (
          /* ── ENQUIRY FORM ──────────────────────────────────────────── */
          <form onSubmit={handleEnquireLoggedIn} className="space-y-4">
            {/* ENQUIRY FORM BODY */}
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
              <label className="text-xs font-semibold text-gray-600 block mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-700 font-medium outline-none focus:border-[#1a3c6b] focus:bg-white transition-colors"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Phone</label>
              <PhoneInput
                defaultCountry="IN"
                value={formData.phone}
                onChange={(val) => setFormData({ ...formData, phone: val || "" })}
                className="w-full text-xs [&_button]:h-9 [&_input]:h-9 [&_input]:rounded-r-lg [&_button]:rounded-l-lg [&_input]:bg-gray-100 [&_button]:bg-gray-100 [&_input]:border-gray-200 [&_button]:border-gray-200"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-700 font-medium outline-none focus:border-[#1a3c6b] focus:bg-white transition-colors"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Do you have anything on mind ?
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-[#1a3c6b] transition-colors resize-none"
                placeholder="I'm interested in your property..."
              />
            </div>

            {/* T&C */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms-loggedin"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 accent-[#1a3c6b] cursor-pointer"
              />
              <label
                htmlFor="terms-loggedin"
                className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none"
              >
                By clicking you agree to our{" "}
                <a href="#" className="text-[#1a3c6b] underline hover:text-[#142e52]">
                  Terms &amp; Conditions
                </a>
              </label>
            </div>

            {formError && (
              <div className="flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              disabled={isLoading || !agreedToTerms || statusLoading}
              className="w-full font-extrabold text-sm py-2.5 px-4 rounded-xl shadow transition-all duration-200 active:scale-[0.98] cursor-pointer text-center"
            >
              {isLoading || statusLoading ? "Please wait..." : "Verify and Enquire"}
            </Button>
          </form>
        )}
      </div>
    );
  }

  // ── RENDER: Logged out state ──────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-gray-900">Login/Signup to Request Info</h3>
        <PropertyForBadge propertyFor={propertyFor} />
      </div>

      {/* Property Name */}
      <p className="text-xs text-gray-400 mb-1 mt-3">Property Name</p>
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 mb-4">
        <span className="text-xs text-gray-500 truncate flex-1">{property.name}</span>
        <Lock size={13} className="text-gray-400 shrink-0" />
      </div>

      {/* Phone Number Entry */}
      <p className="text-xs text-gray-400 mb-2">Phone Number</p>
      <div className="flex gap-2 mb-1">
        <PhoneInput
          defaultCountry="IN"
          value={phone}
          onChange={(val) => setPhone(val || "")}
          disabled={otpSent || isLoading}
          placeholder="Enter 10-digit mobile number"
          className="flex-1 text-sm [&_button]:h-[40px] [&_input]:h-[40px] [&_input]:rounded-r-lg [&_button]:rounded-l-lg [&_input]:bg-gray-50 [&_button]:bg-gray-50 [&_input]:border-gray-200 [&_button]:border-gray-200"
        />
        {!otpSent && (
          <button
            onClick={handleSendOtp}
            disabled={isLoading || get10DigitPhone(phone).length !== 10}
            className="bg-[#1a3c6b] hover:bg-[#142e52] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        )}
      </div>

      {phoneError && <p className="text-xs text-red-500 mb-3 block">{phoneError}</p>}

      {/* OTP verification fields */}
      {otpSent && (
        <div className="mt-4 mb-4 space-y-3 animate-fade-in">
          <label className="block text-xs font-medium text-gray-600 text-center">
            Enter 4-digit OTP sent to{" "}
            <span className="font-semibold text-gray-800">+91 {get10DigitPhone(phone)}</span>
          </label>
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={otpRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className={`w-10 h-10 text-center text-lg font-bold border rounded-lg transition-all outline-none
                  ${digit ? "border-[#1a3c6b] bg-blue-50/20" : "border-gray-200 bg-gray-50"}
                  focus:border-[#1a3c6b] focus:ring-1 focus:ring-[#1a3c6b]/20`}
              />
            ))}
          </div>
          {otpError && <p className="text-xs text-center text-red-500">{otpError}</p>}
          <div className="text-center text-xs">
            <span className="text-gray-500">Didn&apos;t receive OTP? </span>
            {timeLeft > 0 ? (
              <span className="text-red-500 font-bold">Resend in {timeLeft}s</span>
            ) : (
              <Button
                type="button"
                onClick={handleSendOtp}
                variant="gradient"
                disabled={isLoading}
                className="w-full font-extrabold text-sm py-2.5 px-4 rounded-xl shadow transition-all duration-200 active:scale-[0.98] cursor-pointer text-center"
              >
                Resend OTP
              </Button>
            )}
          </div>
        </div>
      )}

      {/* T&C Checkbox */}
      <div className="flex items-start gap-2 mb-4 mt-3">
        <input
          type="checkbox"
          id="terms-loggedout"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 accent-[#1a3c6b] cursor-pointer"
        />
        <label
          htmlFor="terms-loggedout"
          className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none"
        >
          By clicking you agree to our{" "}
          <a href="#" className="text-[#1a3c6b] underline hover:text-[#142e52]">
            Terms &amp; Conditions
          </a>
        </label>
      </div>

      {formError && (
        <div className="flex items-center gap-1.5 text-xs text-red-500 mb-3">
          <AlertCircle size={14} className="shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {otpSent ? (
        <Button
          onClick={handleVerifyAndEnquireLoggedOut}
          variant="gradient"
          disabled={isLoading || !agreedToTerms || otp.join("").length !== 4}
          className="w-full font-extrabold text-sm py-2.5 px-4 rounded-xl shadow transition-all duration-200 active:scale-[0.98] cursor-pointer text-center"
        >
          {isLoading ? "Verifying..." : "Verify and Enquire"}
        </Button>
      ) : (
        <Button
          onClick={handleSendOtp}
          variant="gradient"
          disabled={isLoading || phone.length !== 10 || !agreedToTerms}
          className="w-full font-extrabold text-sm py-2.5 px-4 rounded-xl shadow transition-all duration-200 active:scale-[0.98] cursor-pointer text-center"
        >
          Verify and Enquire
        </Button>
      )}

      <p className="text-center mt-4 text-gray-500 text-[11px] leading-relaxed">
        Not registered yet?{" "}
        <Link
          href={`/register?redirect=/properties/${property.permalink}`}
          className="text-[#1a3c6b] font-semibold hover:underline"
        >
          Sign Up here
        </Link>{" "}
        to enquire.
      </p>
    </div>
  );
}
