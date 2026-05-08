"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "update" | "password";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("update");

  /* Mock user data */
  const user = {
    first_name: "Abraham",
    last_name: "John",
    username: "abrahamj",
    company: "Houselink 360",
    phone: "+91 98765 43210",
    email: "abraham@houselink.in",
    dob: "1990-05-15",
  };

  return (
    <div className="space-y-6">
      {/* ── Update Profile ───────────────────────────────── */}
      {activeTab === "update" && (
        <div>
          <h2 className="text-2xl font-bold text-brand mb-6">Update Profile</h2>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue={user.first_name}
                  maxLength={10}
                  required
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-ink bg-transparent focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue={user.last_name}
                  maxLength={10}
                  required
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-ink bg-transparent focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue={user.username}
                  maxLength={10}
                  required
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-ink bg-transparent focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Company</label>
                <input
                  type="text"
                  defaultValue={user.company}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-ink bg-transparent focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Phone</label>
                <input
                  type="text"
                  defaultValue={user.phone}
                  readOnly
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-ink-secondary bg-gray-50 cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  readOnly
                  required
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-ink-secondary bg-gray-50 cursor-not-allowed"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Date of Birth</label>
                <input
                  type="date"
                  defaultValue={user.dob}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-ink bg-transparent focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1">State</label>
                <select className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition">
                  <option value="">Select State</option>
                  <option value="KA">Karnataka</option>
                  <option value="MH">Maharashtra</option>
                  <option value="DL">Delhi</option>
                  <option value="TN">Tamil Nadu</option>
                  <option value="TS">Telangana</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1">City</label>
                <select className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition">
                  <option value="">Select City</option>
                  <option value="BLR">Bengaluru</option>
                  <option value="MYS">Mysuru</option>
                  <option value="MNG">Mangaluru</option>
                </select>
              </div>

              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-ink bg-transparent focus:outline-none file:mr-3 file:py-1 file:px-3 file:border-0 file:text-xs file:font-semibold file:bg-brand file:text-white file:rounded"
                />
                <p className="text-xs text-ink-muted mt-1">* image must be minimum 2MB</p>
              </div>
            </div>

            {/* Submit */}
            <div className="text-center pt-4">
              <button
                type="submit"
                className="border-2 border-brand text-brand font-bold text-sm px-8 py-2.5 rounded-lg hover:bg-brand hover:text-white transition-colors duration-200"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Change Password ───────────────────────────────── */}
      {activeTab === "password" && (
        <div>
          <h2 className="text-2xl font-bold text-ink mb-6">Change Password</h2>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-ink bg-transparent focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-ink bg-transparent focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-ink bg-transparent focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                />
              </div>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => setActiveTab("update")}
              className="text-sm text-brand font-semibold hover:underline"
            >
              ← Back to Update Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
