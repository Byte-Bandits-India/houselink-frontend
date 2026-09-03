"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { sendOtp, retryOtp, verifyOtpLogin, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PhoneInput } from "@/components/reui/phone-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthUser } = useAuth();
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
      setPhoneError("");
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
    setPhoneError("");
  };

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

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
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setPhoneError("This phone number is not registered. Please sign up.");
      } else if (err instanceof ApiError && err.status === 400) {
        setPhoneError("Invalid phone number format.");
      } else {
        setPhoneError("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await retryOtp({ phone: get10DigitPhone(phone), retryType: "text" });
      setTimeLeft(60);
      setOtp(["", "", "", ""]);
    } catch {
      setOtpError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setOtpError("Please enter the complete 4-digit OTP");
      return;
    }
    setOtpError("");
    setIsLoading(true);

    try {
      const res = await verifyOtpLogin({ phone: get10DigitPhone(phone), otp: otpValue });
      // Tokens auto-saved; instantly update the auth context
      setAuthUser(res.customer);

      const redirectParam = searchParams.get("redirect");
      const targetDestination = redirectParam ? decodeURIComponent(redirectParam) : "/dashboard";
      router.push(targetDestination);
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

  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(-1);
    if (value && !sanitized) return;

    const newOtp = [...otp];
    newOtp[index] = sanitized;
    setOtp(newOtp);

    // Auto-focus next input
    if (sanitized && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
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
          alt="Login"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 p-8 lg:p-10">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-2">Login</h3>
        <h5 className="text-center text-gray-500 mb-8 font-medium">Welcome Back!</h5>

        <div className="space-y-6">
          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <PhoneInput
                defaultCountry="IN"
                value={phone}
                onChange={handlePhoneChange}
                disabled={otpSent}
                placeholder="Enter your phone number"
                variant="lg"
                className="flex-1"
              />
              {!otpSent && (
                <Button
                  onClick={handleSendOtp}
                  disabled={isLoading || get10DigitPhone(phone).length !== 10}
                  size="lg"
                  variant="gradient"
                  className="rounded-[50px]"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              )}
            </div>
            {phoneError && (
              <p className="mt-2 text-sm text-red-500">{phoneError}</p>
            )}
          </div>

          {/* OTP Input Section */}
          {otpSent && (
            <div className="animate-fade-in space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter 4-digit OTP sent to{" "}
                  <span className="text-brand font-semibold">{phone}</span>
                </label>
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
                      className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all outline-none
                        ${digit ? "border-primary-light bg-[#f8fff9]" : "border-gray-200 bg-white"}
                        focus:border-brand focus:ring-4 focus:ring-brand/10`}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="mt-2 text-sm text-center text-red-500">
                    {otpError}
                  </p>
                )}
              </div>

              <div className="text-center text-sm">
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

              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.join("").length !== 4}
                variant="gradient"
                className="rounded-[50px] w-full"
              >
                {isLoading ? "Verifying..." : "Verify & Login"}
              </Button>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-gray-600 text-sm">
          New to Houselink360?{" "}
          <Link href="/register" className="text-brand font-medium hover:underline">
            Sign Up here
          </Link>{" "}
          to list your property.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-[#163d75] animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
