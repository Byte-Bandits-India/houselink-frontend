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
    return digits;
  };

  // ── Fetch states on mount ──────────────────────────────────────────────────
  useEffect(() => {
    getStates()
      .then((res) => setStates(res.data))
      .catch(() => setErrors((e) => ({ ...e, states: "Failed to load states" })))
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
    getCities(stateId as number)
      .then((res) => {
        setCities(res.data);
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
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) otpRefs[index + 1].current?.focus();
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
    <div className="w-full max-w-[1100px] bg-white rounded-xl shadow-[3px_3px_6px_0px_#e4e4e4] overflow-hidden flex flex-col md:flex-row">
      {/* Left Side Image */}
      <div className="hidden md:block md:w-5/12 relative bg-gray-100">
        <Image
          src="/assets/images/footer/login_image.png"
          alt="Register"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-7/12 p-8 lg:p-10">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-2">Sign Up</h3>
        <h5 className="text-center text-gray-500 mb-8 font-medium">Create your account</h5>

        {errors.general && (
          <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value.replace(/[^A-Za-z\s]/g, ""))
                }
                placeholder="First Name"
                className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value.replace(/[^A-Za-z\s]/g, ""))
                }
                placeholder="Last Name (optional)"
                className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <SelectTrigger className="w-full h-11 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand bg-white disabled:bg-gray-50 text-left">
                  <SelectValue placeholder={loadingStates ? "Loading states..." : "Select State"} />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px] z-[60]">
                  {states.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="mt-1 text-xs text-red-500">{errors.state}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <SelectTrigger className="w-full h-11 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand bg-white disabled:bg-gray-50 text-left">
                  <SelectValue
                    placeholder={
                      loadingCities
                        ? "Loading cities..."
                        : !stateId
                        ? "Select State first"
                        : "Select City"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px] z-[60]">
                  {cities.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="mt-1 text-xs text-red-500">{errors.city}</p>
              )}
            </div>
          </div>

          {/* Phone & OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <PhoneInput
                defaultCountry="IN"
                value={phone}
                onChange={(val) => setPhone(val || "")}
                disabled={otpSent}
                placeholder="Phone Number"
                className="flex-1 [&_button]:h-11 [&_input]:h-11"
              />
              {!otpSent && (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || get10DigitPhone(phone).length !== 10}
                  size="lg"
                  variant="gradient"
                  className="rounded-[50px] h-11"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              )}
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* OTP Verification Section */}
          {otpSent && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 animate-fade-in mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter 4-digit OTP{" "}
                <span className="text-green-600 text-xs ml-1">
                  ✓ sent to +91 {phone}
                </span>
              </label>
              <div className="flex justify-center gap-2 mb-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-10 h-10 text-center text-lg font-bold border-2 rounded-md transition-all outline-none
                      ${digit ? "border-primary-light bg-[#f8fff9]" : "border-gray-200 bg-white"}
                      focus:border-brand focus:ring-2`}
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="text-center text-xs text-red-500 mb-2">
                  {errors.otp}
                </p>
              )}

              <div className="text-center text-xs">
                <span className="text-gray-500">Didn&apos;t receive OTP? </span>
                {timeLeft > 0 ? (
                  <span className="text-red-500 font-bold">
                    Resend in {timeLeft}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-brand hover:underline font-medium disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              variant="gradient"
              className="rounded-[50px] w-full text-lg h-12"
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-brand font-medium hover:underline">
            Login here
          </Link>{" "}
          to manage your listings.
        </p>
      </div>
    </div>
  );
}
