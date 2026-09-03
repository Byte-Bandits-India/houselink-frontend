"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  sendOtpRegister,
  register,
  retryOtp,
  getStates,
  getCities,
  ApiError,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { State, City } from "@/types/auth";

import { PhoneInput } from "@/components/reui/phone-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuthUser } = useAuth();

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [stateId, setStateId] = useState<number | "">("");
  const [cityId, setCityId] = useState<number | "">("");

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(0);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Location State
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper to extract 10-digit phone number
  const get10DigitPhone = (phoneVal: string) => {
    const digits = phoneVal.replace(/\D/g, "");
    if (digits.startsWith("91") && digits.length > 10) {
      return digits.slice(-10);
    }
    return digits.slice(0, 10);
  };

  const handlePhoneChange = (val?: string) => {
    if (!val) {
      setPhone("");
      setErrors((e) => ({ ...e, phone: "" }));
      return;
    }
    // Extract national digits capped at 10
    if (val.startsWith("+91")) {
      const national = val.slice(3).replace(/\D/g, "").slice(0, 10);
      setPhone(`+91${national}`);
    } else if (val.startsWith("+")) {
      const prefixMatch = val.match(/^\+\d{1,4}/);
      const prefix = prefixMatch ? prefixMatch[0] : "+";
      const national = val.slice(prefix.length).replace(/\D/g, "").slice(0, 10);
      setPhone(`${prefix}${national}`);
    } else {
      const digits = val.replace(/\D/g, "").slice(0, 10);
      setPhone(digits ? `+91${digits}` : "");
    }
    setErrors((e) => ({ ...e, phone: "" }));
  };

  // ── Fetch active states on mount ──────────────────────────────────────────
  useEffect(() => {
    setLoadingStates(true);
    getStates()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setStates(res.data);
        }
      })
      .catch(() => {
        setErrors((e) => ({ ...e, states: "Failed to load states" }));
      })
      .finally(() => setLoadingStates(false));
  }, []);

  // ── Fetch cities when stateId changes ─────────────────────────────────────
  useEffect(() => {
    if (!stateId) {
      setCities([]);
      setCityId("");
      return;
    }
    setLoadingCities(true);
    getCities(Number(stateId))
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setCities(res.data);
        }
        setCityId("");
      })
      .catch(() => setErrors((e) => ({ ...e, city: "Failed to load cities" })))
      .finally(() => setLoadingCities(false));
  }, [stateId]);

  // ── Countdown timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft > 0) {
      const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(id);
    }
  }, [timeLeft]);

  // ── Validation ─────────────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First Name is required";
    else if (!/^[A-Za-z\s]+$/.test(firstName))
      newErrors.firstName = "Only letters and spaces allowed";

    const activePhone = get10DigitPhone(phone);
    if (!activePhone || activePhone.length !== 10)
      newErrors.phone = "Valid 10-digit phone required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";

    if (!stateId) newErrors.state = "State is required";
    if (!cityId) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Send OTP (registration) ────────────────────────────────────────────────
  const handleSendOtp = async () => {
    const activePhone = get10DigitPhone(phone);
    if (!activePhone || activePhone.length !== 10) {
      setErrors((e) => ({ ...e, phone: "Please enter a valid 10-digit phone number" }));
      return;
    }
    setErrors((e) => ({ ...e, phone: "" }));
    setIsLoading(true);

    try {
      await sendOtpRegister({ phone: activePhone });
      setOtpSent(true);
      setTimeLeft(60);
      setOtp(["", "", "", ""]);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setErrors((e) => ({
          ...e,
          phone: "This phone number is already registered. Please login.",
        }));
      } else if (err instanceof ApiError && err.status === 400) {
        setErrors((e) => ({ ...e, phone: "Invalid phone number format." }));
      } else {
        setErrors((e) => ({ ...e, phone: "Failed to send OTP. Please try again." }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await retryOtp({ phone: get10DigitPhone(phone), retryType: "text" });
      setTimeLeft(60);
      setOtp(["", "", "", ""]);
    } catch {
      setErrors((e) => ({ ...e, otp: "Failed to resend OTP." }));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!otpSent) {
      setErrors((e) => ({
        ...e,
        general: "Please verify phone number with OTP first",
      }));
      return;
    }

    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setErrors((e) => ({ ...e, otp: "Please enter the complete 4-digit OTP" }));
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await register({
        firstName,
        lastName: lastName || undefined,
        phone: get10DigitPhone(phone),
        email,
        otp: otpValue,
        stateId: stateId as number,
        cityId: cityId as number,
      });
      // Tokens auto-saved; instantly update the auth context
      setAuthUser(res.customer);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setErrors({ general: "Invalid OTP or form data. Please check and try again." });
      } else if (err instanceof ApiError && err.status === 409) {
        setErrors({ general: "Phone number already registered. Please login." });
      } else {
        setErrors({ general: "Registration failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP input handlers ─────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(-1);
    if (value && !sanitized) return;
    const newOtp = [...otp];
    newOtp[index] = sanitized;
    setOtp(newOtp);
    if (sanitized && index < 3) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  return (
    <div className="w-full max-w-[900px] bg-white rounded-xl shadow-[3px_3px_6px_0px_#e4e4e4] overflow-hidden flex flex-col md:flex-row">
      {/* Left Side Image */}
      <div className="hidden md:block md:w-1/2 relative bg-gray-100">
        <Image
          src="/assets/images/footer/login_image.png"
          alt="Register"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-1">
          Create Account
        </h3>
        <p className="text-center text-gray-500 mb-5 text-xs font-medium">
          Enter your details to get started
        </p>

        {errors.general && (
          <div className="p-2.5 mb-4 bg-red-50 text-red-600 rounded-lg text-xs border border-red-100">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value.replace(/[^A-Za-z\s]/g, ""))
                }
                placeholder="First Name"
                className="w-full h-10 px-3 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
              />
              {errors.firstName && (
                <p className="mt-0.5 text-[11px] text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value.replace(/[^A-Za-z\s]/g, ""))
                }
                placeholder="Optional"
                className="w-full h-10 px-3 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-10 px-3 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
            />
            {errors.email && (
              <p className="mt-0.5 text-[11px] text-red-500">{errors.email}</p>
            )}
          </div>

          {/* State & City Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <Select
                value={stateId ? String(stateId) : ""}
                onValueChange={(val) => {
                  setStateId(val ? Number(val) : "");
                  setErrors((prev) => ({ ...prev, state: "" }));
                }}
                disabled={loadingStates}
              >
                <SelectTrigger className="w-full h-10 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand bg-white disabled:bg-gray-50 text-left">
                  <SelectValue placeholder={loadingStates ? "Loading..." : "Select State"} />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[220px] z-[60]">
                  {states.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)} className="text-xs">
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="mt-0.5 text-[11px] text-red-500">{errors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <Select
                value={cityId ? String(cityId) : ""}
                onValueChange={(val) => {
                  setCityId(val ? Number(val) : "");
                  setErrors((prev) => ({ ...prev, city: "" }));
                }}
                disabled={!stateId || loadingCities || cities.length === 0}
              >
                <SelectTrigger className="w-full h-10 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand bg-white disabled:bg-gray-50 text-left">
                  <SelectValue
                    placeholder={
                      loadingCities
                        ? "Loading..."
                        : !stateId
                        ? "Select State"
                        : "Select City"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[220px] z-[60]">
                  {cities.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)} className="text-xs">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="mt-0.5 text-[11px] text-red-500">{errors.city}</p>
              )}
            </div>
          </div>

          {/* Phone & OTP */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <PhoneInput
                defaultCountry="IN"
                value={phone}
                onChange={handlePhoneChange}
                disabled={otpSent}
                placeholder="Phone Number"
                className="flex-1 [&_button]:h-10 [&_input]:h-10 [&_input]:text-xs"
              />
              {!otpSent && (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || get10DigitPhone(phone).length !== 10}
                  size="sm"
                  variant="gradient"
                  className="rounded-[50px] h-10 px-4 text-xs whitespace-nowrap"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              )}
            </div>
            {errors.phone && (
              <p className="mt-0.5 text-[11px] text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Inline OTP Verification Section */}
          {otpSent && (
            <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100 animate-fade-in space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-medium">
                  OTP sent to +91 {get10DigitPhone(phone)}
                </span>
                {timeLeft > 0 ? (
                  <span className="text-gray-500 text-[11px]">
                    Resend in {timeLeft}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-brand hover:underline text-[11px] font-medium disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-9 h-9 text-center text-base font-bold border rounded-md transition-all outline-none
                      ${digit ? "border-brand bg-white" : "border-gray-300 bg-white"}
                      focus:border-brand focus:ring-1 focus:ring-brand`}
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="text-center text-[11px] text-red-500">
                  {errors.otp}
                </p>
              )}
            </div>
          )}

          <div className="pt-1.5">
            <Button
              type="submit"
              disabled={isLoading}
              variant="gradient"
              className="rounded-[50px] w-full text-sm h-11"
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>

        <p className="text-center mt-4 text-gray-600 text-xs">
          Already have an account?{" "}
          <Link href="/login" className="text-brand font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
