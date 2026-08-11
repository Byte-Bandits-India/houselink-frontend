"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Phone, Mail, Plus, Minus, Search, AlertCircle, BookOpen } from "lucide-react"
import { getFaqs, getFaqCategories } from "@/lib/api"
import type { FaqItem as ApiFaqItem, FaqCategory } from "@/types/faq"

const fallbackFaqs = [
  {
    id: 1,
    title: "How do I list my property on Houselink360°?",
    answer:
      "Log in to your account, click <strong>Post a Property</strong>, fill in the property details, upload high-quality photos, set your asking price, and submit for review. Listings are typically approved within one business day.",
  },
  {
    id: 2,
    title: "Is there a fee to list my property?",
    answer:
      "Basic listings are free. Premium and featured listing plans are available for greater visibility. Visit our pricing page for details.",
  },
  {
    id: 3,
    title: "Can I edit my property listing after posting?",
    answer:
      "Yes. Log in to your dashboard, navigate to <strong>My Listings</strong>, and click <strong>Edit</strong> on the listing you want to update.",
  },
  {
    id: 4,
    title: "How can I contact a property seller or agent?",
    answer:
      "Each listing has a <strong>Contact Agent</strong> button. You can call, WhatsApp, or send an enquiry directly from the property page.",
  },
  {
    id: 5,
    title: "How long will my property stay listed?",
    answer:
      "Standard listings remain active for 90 days. You can renew or upgrade your listing at any time from your dashboard.",
  },
  {
    id: 6,
    title: "How do I create an account on Houselink360°?",
    answer:
      "Click the <strong>Sign Up</strong> button on the top right corner, fill in your details, verify your email address, and you're ready to go.",
  },
  {
    id: 7,
    title: "Can I save properties I like?",
    answer:
      "Yes. Click the heart/bookmark icon on any listing to save it to your <strong>Wishlist</strong>. You can access saved properties from your profile.",
  },
  {
    id: 8,
    title: "Do I need a real estate agent to list a property?",
    answer:
      "No. Individual owners can list directly on Houselink360°. Agents and builders can also list on behalf of owners with appropriate authorisation.",
  },
  {
    id: 9,
    title: "Can I remove my listing at any time?",
    answer:
      "Yes. Go to <strong>My Listings</strong> in your dashboard and click <strong>Delete</strong> or <strong>Mark as Sold/Rented</strong> to deactivate the listing.",
  },
  {
    id: 10,
    title: "How do I get updates on new properties?",
    answer:
      "Save your search criteria and enable alerts. We'll notify you by email whenever a new property matching your preferences is listed.",
  },
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: { id: number; title: string; answer: string }
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span className="font-bold text-[#153e75] text-[0.95rem] min-w-[28px] shrink-0 pt-0.5 select-none">
            {index + 1}.
          </span>
          <span className="font-semibold text-[1rem] text-gray-900 group-hover:text-[#153e75] transition-colors leading-snug">
            {item.title}
          </span>
        </div>
        <div className="shrink-0 text-gray-400 group-hover:text-[#153e75] transition-colors pt-0.5">
          {isOpen ? (
            <Minus className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="pb-5 text-gray-600 text-[0.95rem] leading-[1.8] pl-10 pr-2 [&_strong]:text-gray-900 [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<{ id: number; title: string; answer: string }[]>([])
  const [categories, setCategories] = useState<FaqCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  
  const [openId, setOpenId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getFaqCategories()
        if (res.success && res.data) {
          setCategories(res.data)
        }
      } catch (err) {
        console.error("Failed to load FAQ categories:", err)
      }
    }
    loadCategories()
  }, [])

  // Fetch FAQs
  useEffect(() => {
    async function loadFaqs() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await getFaqs({
          categoryId: selectedCategory || undefined,
          search: searchQuery.trim() || undefined,
        })
        if (res.success && res.data) {
          // Map backend FaqItem to simple Accordion display object
          const mapped = res.data.map((faq) => ({
            id: faq.id,
            title: faq.title,
            answer: faq.answer || "",
          }))
          
          if (mapped.length === 0 && !selectedCategory && !searchQuery.trim()) {
            // If the database is completely unseeded, fall back to mock data
            setFaqs(fallbackFaqs)
          } else {
            setFaqs(mapped)
          }
        } else {
          setError(res.message || "Failed to load FAQs.")
        }
      } catch (err: any) {
        console.error("Failed to fetch FAQs:", err)
        // Only fallback to mock data on initial load if database fetch encounters issues
        if (!selectedCategory && !searchQuery.trim()) {
          setFaqs(fallbackFaqs)
        } else {
          setError(err.message || "An error occurred while fetching FAQs.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(loadFaqs, 300) // Debounce search queries
    return () => clearTimeout(timer)
  }, [selectedCategory, searchQuery])

  function toggle(id: number) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
    setOpenId(null)
  }

  return (
    <div className="bg-[#f8fafc] text-slate-800 overflow-hidden pb-16">

      {/* ── HERO ── */}
      <div className="relative h-[420px] md:h-[480px] w-full">
        <Image
          src="/assets/images/images-about/faqs-image.png"
          alt="Frequently Asked Questions"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center text-sm md:text-base font-medium text-white/90"
          >
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <span className="mx-2 text-white/50">/</span>
            <span className="text-brand font-semibold">FAQs</span>
          </motion.nav>
        </div>
      </div>

      {/* ── SEARCH & CATEGORY FILTER TABS ── */}
      <div className="w-full py-6 bg-white border-b border-gray-200/80 shadow-xs sticky top-[72px] z-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCategorySelect(null)}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 border ${
                  selectedCategory === null
                    ? "bg-[#153e75] text-white border-[#153e75] shadow-xs"
                    : "bg-white text-slate-700 border-gray-200 hover:border-[#153e75] hover:bg-slate-50"
                }`}
              >
                All FAQs
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 border ${
                    selectedCategory === cat.id
                      ? "bg-[#153e75] text-white border-[#153e75] shadow-xs"
                      : "bg-white text-slate-700 border-gray-200 hover:border-[#153e75] hover:bg-slate-50"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full md:w-[320px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#153e75]/20 focus:border-[#153e75] transition-all bg-white"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="container mx-auto px-4 mt-10 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT SIDEBAR — sticky ── */}
          <aside className="lg:w-[280px] shrink-0 lg:sticky lg:top-[160px] w-full">

            {/* FAQs label card */}
            <div className="border border-gray-200 rounded-xl px-5 py-3.5 flex items-center justify-between mb-5 bg-white shadow-xs">
              <span className="text-[#153e75] font-bold text-sm tracking-wide">Help Categories</span>
              <BookOpen className="w-4 h-4 text-[#153e75]" />
            </div>

            {/* CTA card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">

              {/* Image — full width */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <Image
                  src="/assets/images/images-about/sidebar-cta-img.png"
                  alt="How can we help"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Body */}
              <div className="p-5">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  How Can We Help?
                </h3>
                <p className="text-slate-500 text-xs mb-5 leading-relaxed">
                  If you have questions or need assistance with your property listing, contact our support team.
                </p>

                {/* Phone */}
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                    <Phone className="w-4 h-4 text-[#153e75]" />
                  </div>
                  <a
                    href="tel:+919940234550"
                    className="text-slate-800 text-xs hover:text-[#153e75] transition-colors font-semibold"
                  >
                    +91 9940234550
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                    <Mail className="w-4 h-4 text-[#153e75]" />
                  </div>
                  <a
                    href="mailto:support@houselink360.com"
                    className="text-slate-800 text-xs hover:text-[#153e75] transition-colors font-semibold break-all"
                  >
                    support@houselink360.com
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* ── RIGHT: FAQ ACCORDION ── */}
          <div className="flex-1 min-w-0 w-full">

            {/* Heading */}
            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-2xl md:text-3xl font-extrabold mb-6 text-slate-900 tracking-tight"
            >
              Frequently Asked Questions
            </motion.h2>

            {/* Error State */}
            {error && (
              <div className="flex flex-col items-center justify-center text-center py-10 bg-white border border-red-100 rounded-2xl p-6 max-w-xl mx-auto shadow-xs mb-6">
                <AlertCircle size={36} className="text-red-500 mb-2" />
                <h3 className="text-base font-bold text-gray-800 mb-1">Failed to Load FAQs</h3>
                <p className="text-gray-600 text-xs">{error}</p>
              </div>
            )}

            {/* Loading Skeletons */}
            {isLoading && !error && (
              <div className="space-y-3 bg-white p-6 rounded-2xl border border-gray-200">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="py-4 border-b border-gray-100 last:border-b-0 animate-pulse flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="w-4 h-4 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && faqs.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-12 bg-white border border-gray-200 rounded-2xl p-8 max-w-xl mx-auto shadow-xs">
                <BookOpen size={36} className="text-brand mb-2 opacity-50" />
                <h3 className="text-base font-bold text-gray-800 mb-1">No FAQs Found</h3>
                <p className="text-gray-500 text-xs">
                  We couldn't find any questions matching your filter or search query. Please try another search term.
                </p>
              </div>
            )}

            {/* FAQ Accordion List */}
            {!isLoading && !error && faqs.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={stagger}
                className="bg-white px-6 py-2 rounded-2xl shadow-xs border border-gray-200"
              >
                {faqs.map((item, index) => (
                  <AccordionItem
                    key={item.id}
                    item={item}
                    index={index}
                    isOpen={openId === item.id}
                    onToggle={() => toggle(item.id)}
                  />
                ))}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}