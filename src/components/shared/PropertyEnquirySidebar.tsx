"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Lock, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sendOtp, verifyOtpLogin, ApiError, createLead } from "@/lib/api";

interface PropertyEnquirySidebarProps {
  property: {
    id: number;
    name: string;
    [key: string]: any;
  };
}

export default function PropertyEnquirySidebar({ property }: PropertyEnquirySidebarProps) {
  const { isLoggedIn, user, setAuthUser } = useAuth();

  // Common T&C Checkbox
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formError, setFormError] = useState("");

  // ==========================================
  // LOGGED OUT STATE VARIABLES & FUNCTIONS
  // ==========================================
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

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }
    setPhoneError("");
    setIsLoading(true);

    try {
      await sendOtp({ phone });
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

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
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
      const res = await verifyOtpLogin({ phone, otp: otpValue });
      // Update Auth State, which dynamically shifts this component to the Logged-in State
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

  // ==========================================
  // LOGGED IN STATE VARIABLES & FUNCTIONS
  // ==========================================
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "I'm interested in your property...",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync user details when logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData({
        name: `${user.firstName} ${user.lastName || ""}`.trim(),
        phone: user.phone.replace(/^\+91/, ""), // strip prefix if database already has it to avoid duplicates in input
        email: user.email || "",
        message: "I'm interested in your property...",
      });
      // Automatically check agreedToTerms when logged in to match screenshot pre-population
      setAgreedToTerms(true);
    }
  }, [isLoggedIn, user]);

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
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
      });
      setIsSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Failed to submit enquiry. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // RENDER SUCCESS STATE
  // ==========================================
  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center space-y-4 animate-fade-in">
        <div className="mx-auto bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center text-emerald-500">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Enquiry Sent!</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Thank you for your interest in <span className="font-semibold text-gray-800">{property.name}</span>.
        </p>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          The owner/agent will contact you shortly on your registered details.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="w-full bg-[#1a3c6b] hover:bg-[#142e52] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  // ==========================================
  // RENDER LOGGED IN STATE
  // ==========================================
  if (isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Request Info</h3>

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

          {/* Name & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-700 font-medium outline-none focus:border-[#1a3c6b] focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Phone
              </label>
              <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                <span className="text-xs text-gray-500 font-medium pl-3 pr-1 py-2.5 bg-gray-100 select-none">
                  +91
                </span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                  className="w-full bg-gray-100 border-0 rounded-r-lg px-1 py-2.5 text-xs text-gray-700 font-medium outline-none focus:bg-white transition-colors min-w-0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Email
            </label>
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

          {/* T&C Agreement */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms-loggedin"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 accent-[#1a3c6b] cursor-pointer"
            />
            <label htmlFor="terms-loggedin" className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none">
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !agreedToTerms}
            className="w-full bg-[#1a3c6b] hover:bg-[#142e52] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? "Sending..." : "Verify and Enquire"}
          </button>
        </form>
      </div>
    );
  }

  // ==========================================
  // RENDER LOGGED OUT STATE
  // ==========================================
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900 mb-1">
        Login/Signup to Request Info
      </h3>

      {/* Property Name */}
      <p className="text-xs text-gray-400 mb-1 mt-3">Property Name</p>
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 mb-4">
        <span className="text-xs text-gray-500 truncate flex-1">
          {property.name}
        </span>
        <Lock size={13} className="text-gray-400 shrink-0" />
      </div>

      {/* Phone Number Entry */}
      <p className="text-xs text-gray-400 mb-2">Phone Number</p>
      <div className="flex gap-2 mb-1">
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 whitespace-nowrap select-none">
          🇮🇳 +91
        </div>
        <input
          type="tel"
          maxLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          disabled={otpSent || isLoading}
          placeholder="Enter 10-digit mobile number"
          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 placeholder-gray-400 outline-none focus:border-[#1a3c6b] focus:bg-white transition-colors min-w-0 disabled:opacity-75"
        />
        {!otpSent && (
          <button
            onClick={handleSendOtp}
            disabled={isLoading || phone.length !== 10}
            className="bg-[#1a3c6b] hover:bg-[#142e52] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        )}
      </div>

      {phoneError && (
        <p className="text-xs text-red-500 mb-3 block">{phoneError}</p>
      )}

      {/* OTP verification fields */}
      {otpSent && (
        <div className="mt-4 mb-4 space-y-3 animate-fade-in">
          <label className="block text-xs font-medium text-gray-600 text-center">
            Enter 4-digit OTP sent to <span className="font-semibold text-gray-800">+91 {phone}</span>
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

          {otpError && (
            <p className="text-xs text-center text-red-500">{otpError}</p>
          )}

          <div className="text-center text-xs">
            <span className="text-gray-500">Didn&apos;t receive OTP? </span>
            {timeLeft > 0 ? (
              <span className="text-red-500 font-bold">Resend in {timeLeft}s</span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading}
                className="text-[#1a3c6b] hover:underline font-semibold disabled:opacity-50"
              >
                Resend OTP
              </button>
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
        <label htmlFor="terms-loggedout" className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none">
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

      {/* Login Action Button */}
      {otpSent ? (
        <button
          onClick={handleVerifyAndEnquireLoggedOut}
          disabled={isLoading || !agreedToTerms || otp.join("").length !== 4}
          className="w-full bg-[#1a3c6b] hover:bg-[#142e52] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          {isLoading ? "Verifying..." : "Verify and Enquire"}
        </button>
      ) : (
        <button
          onClick={handleSendOtp}
          disabled={isLoading || phone.length !== 10 || !agreedToTerms}
          className="w-full bg-[#1a3c6b] hover:bg-[#142e52] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          Verify and Enquire
        </button>
      )}

      <p className="text-center mt-4 text-gray-500 text-[11px] leading-relaxed">
        Not registered yet?{" "}
        <Link href={`/register?redirect=/properties/${property.permalink}`} className="text-[#1a3c6b] font-semibold hover:underline">
          Sign Up here
        </Link>{" "}
        to enquire.
      </p>
    </div>
  );
}
