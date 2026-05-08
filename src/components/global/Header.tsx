"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Dropdown } from "antd"
import type { MenuProps } from "antd"
import {
  User,
  Headset,
  ChevronDown,
  Plus,
  Menu,
  X
} from "lucide-react"

function MobileAccordion({ title, items, onLinkClick }: { title: string, items: any[], onLinkClick: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="flex flex-col">
      <button
        className="flex items-center justify-between py-2 text-ink w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-bold uppercase tracking-wider">{title}</span>
        <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`flex flex-col gap-4 pl-4 text-ink-secondary overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pt-4 pb-2 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {items.map((item: any) => {
          if (item.type === 'divider') return <hr key={item.key || Math.random()} className="border-surface-tertiary my-1" />
          return (
            <div key={item.key} onClick={onLinkClick}>
              {item.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isLoggedIn = true
  const user = { first_name: "John" }

  const listingsMenu: MenuProps["items"] = [
    { key: "1", label: <Link href="/properties/owner">Owner Properties</Link> },
    { key: "2", label: <Link href="/properties/featured">Featured Properties</Link> },
    { key: "3", label: <Link href="/properties">All Properties</Link> },
  ]

  const othersMenu: MenuProps["items"] = [
    { key: "1", label: <Link href="/about">About</Link> },
    { key: "2", label: <Link href="/careers">Careers</Link> },
    { key: "3", label: <Link href="/wishlist">Wishlist</Link> },
    { key: "4", label: <Link href="/faqs">FAQs</Link> },
    { key: "5", label: <Link href="/contact">Contact</Link> },
  ]

  const userMenu: MenuProps["items"] = [
    { key: "1", label: <Link href="/dashboard/enquiries">My Enquiries</Link> },
    { key: "2", label: <Link href="/dashboard/leads">Property Leads</Link> },
    { key: "3", label: <Link href="/dashboard">Dashboard</Link> },
    { key: "4", label: <Link href="/settings">Settings</Link> },
    { type: "divider" },
    {
      key: "5",
      label: (
        <span className="text-danger font-medium">
          Logout
        </span>
      ),
    },
  ]

  // Support dropdown custom content
  const supportContent = (
    <div className="bg-surface rounded-2xl shadow-card p-4 w-72">
      <h6 className="text-xs font-bold text-ink mb-3">CONTACT US</h6>
      <p className="text-sm text-ink-secondary mb-2">
        support@houselink360.com
      </p>
      <p className="font-semibold text-ink mb-2">
        +91 99402 34550
      </p>
      <p className="text-xs text-ink-muted">
        9 AM – 6:30 PM (Mon–Sun)
      </p>
    </div>
  )

  const dropdownProps = {
    trigger: ["hover"] as any,
    placement: "bottom" as any,
    align: { offset: [0, 16] },
    styles: { root: { minWidth: 200 } },
    classNames: { root: "rounded-2xl overflow-hidden" }
  }

  return (
    <header className="absolute top-0 w-full z-50">
      <div className="container mx-auto px-4">

        <div className="flex items-center justify-between py-5">

          {/* LOGO */}
          <Link href="/" className="z-50">
            <Image
              src="/assets/logo.svg"
              alt="Logo"
              width={180}
              height={50}
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8 text-base font-semibold text-white">

            <Link href="/" className="hover:text-white/80 transition">
              Home
            </Link>

            {/* Listings */}
            <Dropdown
              menu={{ items: listingsMenu }}
              {...dropdownProps}
            >
              <span className="flex items-center gap-1 cursor-pointer hover:text-white/80 transition py-2">
                Listings <ChevronDown size={16} />
              </span>
            </Dropdown>

            <Link href="/partner-with-us" className="hover:text-white/80 transition">
              Partner With Us
            </Link>

            {/* Others */}
            <Dropdown
              menu={{ items: othersMenu }}
              {...dropdownProps}
            >
              <span className="flex items-center gap-1 cursor-pointer hover:text-white/80 transition py-2">
                Others <ChevronDown size={16} />
              </span>
            </Dropdown>

            <Link href="/blog" className="hover:text-white/80 transition">
              Blogs
            </Link>
          </div>

          {/* RIGHT SIDE (DESKTOP) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* ADD PROPERTY */}
            <Link
              href={isLoggedIn ? "/dashboard/properties" : "/login"}
              className="flex items-center gap-2 bg-brand text-white px-5 h-11 transition-colors duration-200 hover:bg-brand-700 font-semibold"
            >
              <Plus size={18} /> Add Property
            </Link>

            {/* SUPPORT */}
            <Dropdown
              popupRender={() => supportContent}
              trigger={["hover"]}
              placement="bottomRight"
              align={{ offset: [0, 16] }}
            >
              <button className="w-11 h-11 flex items-center justify-center rounded-full bg-brand text-white hover:bg-brand-700 transition">
                <Headset size={20} />
              </button>
            </Dropdown>

            {/* USER */}
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="bg-brand text-white px-5 h-11 hover:bg-brand-700 transition font-semibold flex items-center gap-2"
              >
                <User size={18} /> Login
              </Link>
            ) : (
              <Dropdown
                menu={{ items: userMenu }}
                trigger={["hover"]}
                placement="bottomRight"
                align={{ offset: [0, 16] }}
                styles={{ root: { minWidth: 200 } }}
                classNames={{ root: "rounded-2xl overflow-hidden" }}
              >
                <button className="flex items-center gap-2 bg-brand text-white px-5 h-11 hover:bg-brand-700 transition font-semibold">
                  <User size={18} />
                  Hi {user.first_name}
                </button>
              </Dropdown>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            className="lg:hidden z-50 text-ink p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE FULL SCREEN MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[80px] bg-surface z-40 overflow-y-auto pb-20 lg:hidden animate-fade-in flex flex-col">
          <div className="flex flex-col p-6 gap-6 text-lg font-medium text-ink">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>

            <MobileAccordion title="Listings" items={listingsMenu || []} onLinkClick={() => setIsMobileMenuOpen(false)} />

            <Link href="/partner-with-us" onClick={() => setIsMobileMenuOpen(false)}>Partner with Us</Link>

            <MobileAccordion title="Others" items={othersMenu || []} onLinkClick={() => setIsMobileMenuOpen(false)} />

            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blogs</Link>

            <div className="flex flex-col gap-4">
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  className="flex items-center justify-center bg-surface-secondary text-ink px-4 py-3 rounded-xl border border-surface-tertiary hover:bg-surface-tertiary transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <MobileAccordion title="My Account" items={userMenu || []} onLinkClick={() => setIsMobileMenuOpen(false)} />
              )}

              <Link
                href={isLoggedIn ? "/dashboard/properties" : "/login"}
                className="flex items-center justify-center gap-2 bg-brand text-white px-4 py-3 rounded-xl hover:bg-brand-700 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus size={18} /> Add Property
              </Link>
            </div>

          </div>
        </div>
      )}
    </header>
  )
}