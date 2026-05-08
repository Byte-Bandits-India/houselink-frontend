"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // Form State
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(0);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock Data (Replace with API fetch later)
  const states = [
    { id: "1", name: "Maharashtra" },
    { id: "2", name: "Delhi" },
    { id: "3", name: "Karnataka" },
  ];

  const [cities, setCities] = useState<{ id: string, name: string }[]>([]);

  // Fetch cities when state changes
  useEffect(() => {
    if (stateId) {
      // TODO: API GET /api/getcities/{stateId}
      // Replace mock with actual API
      const mockCities = [
        { id: "101", name: "Mumbai", stateId: "1" },
        { id: "102", name: "Pune", stateId: "1" },
        { id: "201", name: "New Delhi", stateId: "2" },
        { id: "301", name: "Bangalore", stateId: "3" },
      ].filter(c => c.stateId === stateId);

      setCities(mockCities);
      setCityId(""); // reset city
    } else {
      setCities([]);
    }
  }, [stateId]);

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First Name is required";
    else if (!/^[A-Za-z\s]+$/.test(firstName)) newErrors.firstName = "Only letters and spaces allowed";

    if (!phone || phone.length !== 10) newErrors.phone = "Valid 10-digit phone required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

    if (!stateId) newErrors.state = "State is required";
    if (!cityId) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      setErrors({ ...errors, phone: "Please enter a valid 10-digit phone number" });
      return;
    }
    setErrors({ ...errors, phone: "" });
    setIsLoading(true);

    try {
      // TODO: API POST /api/auth/send-otp-registration
      // await fetch('/api/auth/send-otp-registration', { method: 'POST', body: JSON.stringify({ phone }) });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOtpSent(true);
      setTimeLeft(60);
      setOtp(["", "", "", ""]);
    } catch (error) {
      setErrors({ ...errors, phone: "Failed to send OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!otpSent) {
      setErrors({ ...errors, general: "Please verify phone number with OTP first" });
      return;
    }

    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setErrors({ ...errors, otp: "Please enter the complete 4-digit OTP" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: API POST /api/auth/register
      /*
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          phone,
          email,
          state: stateId,
          city: cityId,
          otp: otpValue
        })
      });
      */
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect on success
      router.push("/dashboard");
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." });
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
                onChange={(e) => setFirstName(e.target.value.replace(/[^A-Za-z\s]/g, ""))}
                placeholder="First Name"
                className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
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
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white"
              >
                <option value="">Select State</option>
                {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                disabled={!stateId || cities.length === 0}
                className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white disabled:bg-gray-50"
              >
                <option value="">Select City</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
            </div>
          </div>

          {/* Phone & OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                disabled={otpSent}
                placeholder="Phone Number"
                className="flex-1 h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand disabled:bg-gray-50 transition-colors"
              />
              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || phone.length !== 10}
                  className="h-11 px-4 bg-brand text-white font-medium rounded-md hover:bg-[#4f8bd3] disabled:bg-gray-400 whitespace-nowrap transition-colors"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              )}
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          {/* OTP Verification Section */}
          {otpSent && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 animate-fade-in mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter OTP <span className="text-green-600 text-xs ml-1">✓ Verification Required</span>
              </label>
              <div className="flex justify-center gap-3 mb-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-lg font-bold border-2 rounded-md transition-all outline-none
                      ${digit ? "border-[#4f8bd3] bg-[#f8fff9]" : "border-gray-200 bg-white"}
                      focus:border-brand focus:ring-2`}
                  />
                ))}
              </div>
              {errors.otp && <p className="text-center text-xs text-red-500 mb-2">{errors.otp}</p>}

              <div className="text-center text-xs">
                <span className="text-gray-500">Didn't receive OTP? </span>
                {timeLeft > 0 ? (
                  <span className="text-red-500 font-bold">Resend in {timeLeft}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-brand hover:underline font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-brand text-white font-medium rounded-lg hover:bg-brand/90 disabled:bg-gray-400 transition-colors text-lg"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
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
