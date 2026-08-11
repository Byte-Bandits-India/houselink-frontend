"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import {
  User,
  ChevronDown,
  Plus,
  Menu,
  X,
  Mail,
  Phone,
  Home,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

function HoverDropdown({
  trigger,
  items,
  content,
  align = "start"
}: {
  trigger: React.ReactNode
  items?: any[]
  content?: React.ReactNode
  align?: "start" | "end" | "center"
}) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false)
    }, 150)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setOpen(!open)}
          className="outline-none"
        >
          {trigger}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={8}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="rounded-2xl p-2 min-w-[200px] shadow-lg border border-gray-100 bg-white"
      >
        {content && <div className="p-2">{content}</div>}
        {items?.map((item) => {
          if (item.type === "divider") return <DropdownMenuSeparator key={Math.random()} className="my-1 border-gray-100" />
          return (
            <DropdownMenuItem
              key={item.key}
              asChild
              className="cursor-pointer text-sm font-medium hover:bg-gray-50 rounded-xl p-2.5 outline-none transition-colors"
            >
              {item.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileAccordion({
  title,
  items,
  onLinkClick,
}: {
  title: string
  items: any[]
  onLinkClick: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col">
      <button
        className="flex items-center justify-between py-2 text-[#1a3a6b] w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-bold uppercase tracking-wider">{title}</span>
        <ChevronDown
          size={20}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`flex flex-col gap-4 pl-4 text-gray-500 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pt-4 pb-2 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        {items.map((item: any) => {
          if (item.type === "divider")
            return <hr key={item.key || Math.random()} className="border-gray-200 my-1" />
          return (
            <div key={item.key} onClick={onLinkClick} className="text-sm">
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
  const router = useRouter()
  const { user, isLoggedIn, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setIsMobileMenuOpen(false)
    router.push("/")
  }

  /* ------------------------------------------------------------------ menus */
  const listingsMenu = [
    { key: "1", label: <Link href="/properties/owner">Owner Properties</Link> },
    { key: "2", label: <Link href="/properties/featured">Featured Properties</Link> },
    { key: "3", label: <Link href="/properties">All Properties</Link> },
  ]

  const othersMenu = [
    { key: "1", label: <Link href="/about">About</Link> },
    { key: "2", label: <Link href="/careers">Careers</Link> },
    { key: "3", label: <Link href="/wishlist">Wishlist</Link> },
    { key: "4", label: <Link href="/faqs">FAQs</Link> },
    { key: "5", label: <Link href="/contact">Contact</Link> },
  ]

  const userMenu = [
    { key: "1", label: <Link href="/dashboard/enquiries">My Enquiries</Link> },
    { key: "2", label: <Link href="/dashboard/properties">Property Leads</Link> },
    { key: "3", label: <Link href="/dashboard/profile">Settings</Link> },
    { type: "divider" },
    {
      key: "5",
      label: (
        <span
          className="text-red-500 font-medium cursor-pointer w-full block"
          onClick={handleLogout}
        >
          Logout
        </span>
      ),
    },
  ]

  /* --------------------------------------------------------- support popover */
  const supportContent = (
    <div className="w-[300px] -m-2">
      <div className="px-5 py-4 border-b border-gray-100">
        <h6 className="text-[13px] font-bold text-black tracking-wide">CONTACT US</h6>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Mail size={22} className="text-[#1a3a6b] flex-shrink-0" />
          <span className="text-[15px] text-gray-800 font-medium">support@houselink360.com</span>
        </div>

        <div className="flex items-start gap-4">
          <Phone size={22} className="text-[#1a3a6b] fill-[#1a3a6b] flex-shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-black mb-1">+91 99402 34550</span>
            <span className="text-[13px] text-gray-500">9 AM to 6:30 PM</span>
            <span className="text-[13px] text-gray-500">(Mon-Sun)</span>
          </div>
        </div>
      </div>
    </div>
  )

  /* ======================================================================== */
  return (
    <header className="bg-white shadow-sm w-full z-50 sticky top-0">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-[72px]">

          {/* ── LOGO ───────────────────────────────────────────────────────── */}
          <Link href="/" className="z-50 flex-shrink-0">
            <Image src="/assets/logo.svg" alt="HouseLink360" width={160} height={44} style={{ height: "auto" }} priority />
          </Link>

          {/* ── DESKTOP NAV ─────────────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1">

            {/* Listings ▾ */}
            <HoverDropdown
              items={listingsMenu}
              trigger={
                <span className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl cursor-pointer hover:bg-blue-50 text-[#1a3a6b] transition-colors select-none">
                  <img src="/assets/header/1.svg" alt="1" />
                  <span className="flex items-center gap-1 text-sm font-semibold">
                    Listings <ChevronDown size={12} />
                  </span>
                </span>
              }
            />

            {/* Others ▾ */}
            <HoverDropdown
              items={othersMenu}
              trigger={
                <span className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl cursor-pointer hover:bg-blue-50 text-[#1a3a6b] transition-colors select-none">
                  <img src="/assets/header/2.svg" alt="2" />
                  <span className="flex items-center gap-1 text-sm font-semibold">
                    Others <ChevronDown size={12} />
                  </span>
                </span>
              }
            />

            {/* Partner With Us */}
            <Link
              href="/partner-with-us"
              className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl hover:bg-blue-50 text-[#1a3a6b] transition-colors"
            >
              <img src="/assets/header/4.svg" alt="4" />
              <span className="text-sm font-semibold">Partner with us</span>
            </Link>

          </nav>

          {/* ── RIGHT SIDE (DESKTOP) ────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Post Your Property */}
            <Button
              href={isLoggedIn ? "/dashboard/properties" : "/login"}
              variant="gradient"
              className="gap-2 px-6 h-11 whitespace-nowrap"
            >
              <img src="/assets/header/plus.svg" alt="plus" />
              Post Your property
            </Button>

            {/* Login / User */}
            {!isLoggedIn ? (
              <Button
                href="/login"
                className="px-6 h-11"
                variant="gradient"
              >
                Login
              </Button>
            ) : (
              <HoverDropdown
                items={userMenu}
                align="end"
                trigger={
                  <Button
                    href="/dashboard"
                    className="gap-2 px-5 h-11"
                    variant="gradient"
                  >
                    <User size={18} strokeWidth={1.8} />
                    Hi {user?.firstName ?? ""}
                  </Button>
                }
              />
            )}

            {/* Support */}
            <HoverDropdown
              content={supportContent}
              align="end"
              trigger={
                <div className="w-12 h-12 cursor-pointer bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <img src="/assets/header/Headphone.svg" alt="headset" />
                </div>
              }
            />
          </div>

          {/* ── MOBILE HAMBURGER ────────────────────────────────────────────── */}
          <button
            className="lg:hidden z-50 text-[#1a3a6b] p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>
      </div>

      {/* ── MOBILE FULL-SCREEN MENU ─────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] bg-white z-40 overflow-y-auto pb-24 lg:hidden">
          <div className="flex flex-col p-6 gap-6 text-[#1a3a6b] font-medium">

            <Link
              href="/"
              className="text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            <MobileAccordion
              title="Listings"
              items={listingsMenu}
              onLinkClick={() => setIsMobileMenuOpen(false)}
            />

            <Link
              href="/partner-with-us"
              className="text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Partner with Us
            </Link>

            <MobileAccordion
              title="Others"
              items={othersMenu}
              onLinkClick={() => setIsMobileMenuOpen(false)}
            />

            <Link
              href="/blog"
              className="text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blogs
            </Link>

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Account / Auth */}
            {!isLoggedIn ? (
              <Button
                href="/login"
                variant="secondary"
                className="px-4 py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Button>
            ) : (
              <MobileAccordion
                title="My Account"
                items={userMenu}
                onLinkClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* Post Property CTA */}
            <Button
              href={isLoggedIn ? "/dashboard/properties" : "/login"}
              variant="gradient"
              className="gap-2 px-4 py-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Plus size={18} strokeWidth={2.5} />
              Post Your property
            </Button>

          </div>
        </div>
      )}
    </header>
  )
}