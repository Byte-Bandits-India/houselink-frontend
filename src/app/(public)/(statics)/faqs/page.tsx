"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Phone, Mail, Plus, Minus } from "lucide-react"

interface FaqItem {
  id: number
  question: string
  answer: string
}

const ALL_FAQS: FaqItem[] = [
  {
    id: 1,
    question: "How do I list my property on Houselink360°?",
    answer:
      "Log in to your account, click <strong>Post a Property</strong>, fill in the property details, upload high-quality photos, set your asking price, and submit for review. Listings are typically approved within one business day.",
  },
  {
    id: 2,
    question: "Is there a fee to list my property?",
    answer:
      "Basic listings are free. Premium and featured listing plans are available for greater visibility. Visit our pricing page for details.",
  },
  {
    id: 3,
    question: "Can I edit my property listing after posting?",
    answer:
      "Yes. Log in to your dashboard, navigate to <strong>My Listings</strong>, and click <strong>Edit</strong> on the listing you want to update.",
  },
  {
    id: 4,
    question: "How can I contact a property seller or agent?",
    answer:
      "Each listing has a <strong>Contact Agent</strong> button. You can call, WhatsApp, or send an enquiry directly from the property page.",
  },
  {
    id: 5,
    question: "How long will my property stay listed?",
    answer:
      "Standard listings remain active for 90 days. You can renew or upgrade your listing at any time from your dashboard.",
  },
  {
    id: 6,
    question: "How do I create an account on Houselink360°?",
    answer:
      "Click the <strong>Sign Up</strong> button on the top right corner, fill in your details, verify your email address, and you're ready to go.",
  },
  {
    id: 7,
    question: "Can I save properties I like?",
    answer:
      "Yes. Click the heart/bookmark icon on any listing to save it to your <strong>Wishlist</strong>. You can access saved properties from your profile.",
  },
  {
    id: 8,
    question: "Do I need a real estate agent to list a property?",
    answer:
      "No. Individual owners can list directly on Houselink360°. Agents and builders can also list on behalf of owners with appropriate authorisation.",
  },
  {
    id: 9,
    question: "Can I remove my listing at any time?",
    answer:
      "Yes. Go to <strong>My Listings</strong> in your dashboard and click <strong>Delete</strong> or <strong>Mark as Sold/Rented</strong> to deactivate the listing.",
  },
  {
    id: 10,
    question: "How do I get updates on new properties?",
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
  isOpen,
  onToggle,
}: {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[1rem] text-ink group-hover:text-brand transition-colors leading-snug">
          {item.id}.&nbsp;&nbsp;{item.question}
        </span>
        <div className="shrink-0 text-ink-secondary group-hover:text-brand transition-colors">
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
              className="pb-5 text-ink-secondary text-[0.95rem] leading-[1.8] pl-6 [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQsPage() {
  const [openId, setOpenId] = useState<number | null>(null)

  function toggle(id: number) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="bg-surface text-ink overflow-hidden pb-16">

      {/* ── HERO ── */}
      <div className="relative h-[500px] w-full">
        <Image
          src="/assets/images/images-about/faqs-image.png"
          alt="Frequently Asked Questions"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center text-sm md:text-base font-medium"
          >
            <Link href="/" className="hover:text-brand-300 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-300">FAQs</span>
          </motion.nav>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="container mx-auto px-4 mt-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ── LEFT SIDEBAR — sticky ── */}
          <aside className="lg:w-[300px] shrink-0 lg:sticky lg:top-8">

            {/* FAQs label card */}
            <div className="border border-gray-200 rounded-lg px-5 py-4 flex items-center justify-between mb-6 bg-white">
              <span className="text-brand font-semibold text-[0.97rem]">FAQs</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-ink-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
              </svg>
            </div>

            {/* CTA card */}
            <div className="bg-white rounded-2xl border border-surface-tertiary shadow-sm overflow-hidden">

              {/* Image — full width */}
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src="/assets/images/images-about/sidebar-cta-img.png"
                  alt="How can we help"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Body */}
              <div className="px-6 pb-6 pt-5">
                <h3 className="text-[1.15rem] font-bold text-ink mb-1">
                  How Can We Help
                </h3>
                <p className="text-ink-secondary text-[0.9rem] mb-6 leading-relaxed">
                  If you need any help, please feel free to contact us.
                </p>

                {/* Phone */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-ink-secondary" />
                  </div>
                  <a
                    href="tel:+919940234550"
                    className="text-ink text-[0.95rem] hover:text-brand transition-colors font-medium"
                  >
                    +91 9940234550
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-ink-secondary" />
                  </div>
                  <a
                    href="mailto:support@houselink360.com"
                    className="text-ink text-[0.95rem] hover:text-brand transition-colors font-medium break-all"
                  >
                    support@houselink360.com
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* ── RIGHT: FAQ ACCORDION ── */}
          <div className="flex-1 min-w-0">

            {/* Heading */}
            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-[2.4rem] font-bold mb-8 text-ink"
            >
              FAQs
            </motion.h2>

            {/* Single flat accordion */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
              className="border-t border-gray-200"
            >
              {ALL_FAQS.map((item) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => toggle(item.id)}
                />
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  )
}