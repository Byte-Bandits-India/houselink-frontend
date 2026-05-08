"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // TODO: API POST /api/auth/forgot-password
      // await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setMessage({ type: "success", text: "Password reset link has been sent to your email." });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to send reset link. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] bg-white rounded-xl shadow-[3px_3px_6px_0px_#e4e4e4] p-8 lg:p-10 mx-auto">
      <h3 className="text-3xl font-bold text-center text-gray-900 mb-2">Forgot Password</h3>
      <p className="text-center text-gray-500 mb-8 font-medium">
        Enter your email address to receive a password reset link.
      </p>

      {message.text && (
        <div className={`p-3 mb-6 rounded-lg text-sm border ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full h-12 bg-brand text-white font-medium rounded-lg hover:bg-brand/90 disabled:bg-gray-400 transition-colors text-lg"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600 text-sm">
        Remember your password?{" "}
        <Link href="/login" className="text-brand font-medium hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}
