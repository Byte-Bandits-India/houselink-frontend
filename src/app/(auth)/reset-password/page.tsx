"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // TODO: API POST /api/auth/reset-password
      /*
      await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password, password_confirmation: passwordConfirmation })
      });
      */
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage({ type: "success", text: "Password has been successfully reset. Redirecting to login..." });
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to reset password. The link might be expired." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] bg-white rounded-xl shadow-[3px_3px_6px_0px_#e4e4e4] p-8 lg:p-10 mx-auto">
      <h3 className="text-3xl font-bold text-center text-gray-900 mb-2">Reset Password</h3>
      <p className="text-center text-gray-500 mb-8 font-medium">
        Enter your new password below.
      </p>

      {message.text && (
        <div className={`p-3 mb-6 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Hidden inputs to capture email and token if needed by traditional form posts, but we use React state */}
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="email" value={email} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="********"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !password || !passwordConfirmation}
          className="w-full h-12 bg-brand text-white font-medium rounded-lg hover:bg-brand/90 disabled:bg-gray-400 transition-colors text-lg mt-2"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
