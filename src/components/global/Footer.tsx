"use client";

import Link from "next/link";
import Image from "next/image";
import { FacebookFilled, InstagramFilled, DribbbleOutlined } from "@ant-design/icons";
import { useState } from "react";

const navLinks = [
  { href: "/about", label: "About Us" },
  { href: "/properties", label: "Properties" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Blog" },
  { href: "/partner-with-us", label: "Our Partners" },
];

const policyLinks = [
  { href: "/terms", label: "Terms And Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/payment-terms", label: "Payment Terms" },
  { href: "/listing-guidelines", label: "Listing Guidelines" },
];

const contactLinks = [
  { href: "tel:+919940234550", label: "+91 9940234550" },
  { href: "mailto:support@houselink360.com", label: "support@houselink360.com" },
  { href: "/apps", label: "Our Apps With Logo" },
  { href: "/social", label: "Social Icons" },
  { href: "/newsletter", label: "Newsletter Subscription" },
];

const socialLinks = [
  { Icon: FacebookFilled, href: "https://facebook.com/houselink360", label: "Facebook" },
  { Icon: DribbbleOutlined, href: "https://dribbble.com/houselink360", label: "Dribbble" },
  { Icon: InstagramFilled, href: "https://instagram.com/houselink360", label: "Instagram" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#192324] text-white relative z-50">

      {/* ── Top bar ── */}
      {/* Desktop: logo left + socials right  |  Mobile: logo centred, socials centred below */}
      <div className="container mx-auto px-6 md:px-12 py-6 border-b border-white/10
                      flex flex-col items-center gap-4
                      md:flex-row md:justify-between md:gap-0">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/images/footer/footer-logo.png"
            alt="Houselink360"
            width={160}
            height={45}
          />
        </Link>

        {/* Socials */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-white mr-1">Follow Our Socials</span>
          {socialLinks.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 rounded-full bg-white text-brand hover:bg-gray-200
                         transition-colors duration-200 flex items-center justify-center
                         shadow-sm text-lg"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {/* ── Main columns ── */}
      {/* Desktop: 4-col grid  |  Mobile: single column, each section stacked */}
      <div className="container mx-auto px-6 md:px-12 py-10 border-b border-white/10
                      grid grid-cols-1 gap-8
                      md:grid-cols-4 md:gap-6">

        {/* Col 1 – Nav (no heading on mobile, matches screenshot) */}
        <ul className="space-y-3">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-base font-medium text-white hover:text-white/80 transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Col 2 – Policies */}
        <div>
          <h4 className="text-lg font-bold text-white mb-5">Policies</h4>
          <ul className="space-y-3">
            {policyLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-base font-medium text-white hover:text-white/80 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 – Contact */}
        <div>
          <h4 className="text-lg font-bold text-white mb-5">Contact Us</h4>
          <ul className="space-y-3">
            {contactLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-base font-medium text-white hover:text-white/80 transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 – Newsletter */}
        <div>
          <h4 className="text-lg font-bold text-white mb-5">
            Get The Latest Trending News
          </h4>
          <p className="text-base font-medium text-white leading-relaxed mb-5">
            Your Dream Space Starts Here. Get Exclusive Design Straight to Your Inbox!
          </p>
          <div className="flex border border-white/20 rounded overflow-hidden bg-white">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-white border-none outline-none px-4 py-2.5 text-sm
                         text-black placeholder:text-black"
            />
            <button
              className="px-4 border-l border-brand text-brand hover:opacity-80
                         transition-colors text-lg"
              aria-label="Subscribe"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="w-full py-6 pb-10 text-center text-sm font-medium text-white">
        Copyright © {new Date().getFullYear()} All Rights Reserved.
      </div>
    </footer>
  );
}