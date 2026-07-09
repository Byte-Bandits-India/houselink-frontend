"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import {
  Users,
  TrendingUp,
  DollarSign,
  Lightbulb,
  MapPin,
  Clock,
  CreditCard,
  Briefcase,
  AlertCircle,
} from "lucide-react"
import { getCareers } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import type { Career } from "@/types/career"

const whyUs = [
  {
    icon: <Users className="w-10 h-10 mx-auto text-brand" />,
    title: "Supportive & Inclusive",
    body: "A supportive, inclusive, and engaging workplace that celebrates diversity.",
  },
  {
    icon: <TrendingUp className="w-10 h-10 mx-auto text-success" />,
    title: "Career Advancement",
    body: "Opportunities for career growth inside a fast-expanding real-estate company.",
  },
  {
    icon: <DollarSign className="w-10 h-10 mx-auto text-warning" />,
    title: "Competitive Benefits",
    body: "Attractive salaries, health cover, and performance-linked bonuses.",
  },
  {
    icon: <Lightbulb className="w-10 h-10 mx-auto text-info" />,
    title: "Innovative Environment",
    body: "Work in a tech-forward culture where your ideas are heard and acted on.",
  },
]

// ── Animation variants (identical to partner-with-us) ────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

// Helper to format salary
function formatSalary(min: number | string | null | undefined, max: number | string | null | undefined): string {
  if (!min) return "Competitive"
  const minNum = Number(min)
  const maxNum = max ? Number(max) : null
  
  if (maxNum && minNum !== maxNum) {
    return `₹${minNum.toLocaleString("en-IN")} - ₹${maxNum.toLocaleString("en-IN")}`
  }
  return `₹${minNum.toLocaleString("en-IN")}`
}

// ── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job }: { job: Career }) {
  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/careers/${job.id}`}
        className="block bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-brand/40 transition-all duration-300 h-full"
      >
        {/* Title */}
        <h3 className="text-[1rem] font-bold text-ink mb-2 leading-snug hover:text-brand transition-colors">
          {job.title}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.82rem] text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary-light" />
            {formatDate(job.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary-light" />
            {job.location || "Chennai"}
          </span>
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-primary-light" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-[0.88rem] leading-relaxed line-clamp-2">
          {job.description}
        </p>
      </Link>
    </motion.div>
  )
}

// ── Why-Us Card ───────────────────────────────────────────────────────────────
function WhyCard({ item }: { item: (typeof whyUs)[0] }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-xl shadow-sm border border-surface-tertiary p-6 text-center hover:shadow-md transition-all duration-300"
    >
      <div className="mb-4">{item.icon}</div>
      <h4 className="font-bold text-[1.1rem] text-ink mb-3">{item.title}</h4>
      <p className="text-ink-secondary text-[1rem]">{item.body}</p>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CareersPage() {
  const [openings, setOpenings] = useState<Career[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCareers() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await getCareers()
        if (res.success) {
          setOpenings(res.data || [])
        } else {
          setError("Failed to load career listings.")
        }
      } catch (err: any) {
        console.error("Failed to load openings:", err)
        setError(err.message || "An unexpected error occurred.")
      } finally {
        setIsLoading(false)
      }
    }
    loadCareers()
  }, [])

  return (
    <div className="bg-surface text-ink overflow-hidden pb-16">
      {/* ── HERO ── */}
      <div className="relative h-[500px] w-full">
        <Image
          src="/assets/images/footer/career_image.png"
          alt="Careers at Houselink360°"
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
            Careers
          </motion.h1>
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center text-sm md:text-base font-medium"
          >
            <Link href="/" className="hover:text-brand-300 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-brand-300">Careers</span>
          </motion.nav>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="mx-auto px-4 mt-12 max-w-6xl">

        {/* Intro */}
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-[2.2rem] font-bold mb-4"
        >
          Join Our Team{" "}
          <span className="text-brand">at Houselink360°!</span>
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-2 mb-12 text-[1.08rem] leading-[1.8] text-ink-secondary max-w-4xl"
        >
          At Houselink360°, we are always on the lookout for passionate and
          talented individuals who want to be part of a dynamic, fast-growing
          company in the real estate industry. We offer a collaborative
          environment where innovation and hard work are valued, and we strive
          to create an atmosphere that encourages personal and professional
          growth.
        </motion.p>

        {/* Why Work With Us */}
        <div className="mb-14">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[2rem] font-bold mb-8"
          >
            Why Work <span className="text-brand">With Us?</span>
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {whyUs.map((item) => (
              <WhyCard key={item.title} item={item} />
            ))}
          </motion.div>
        </div>

        {/* Current Openings */}
        <div className="mb-16">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[2rem] font-bold mb-8"
          >
            Current <span className="text-brand">Openings</span>
          </motion.h2>

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center text-center py-10 bg-white border border-red-100 rounded-lg p-6 max-w-xl mx-auto shadow-sm">
              <AlertCircle size={40} className="text-red-500 mb-3" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">Failed to Load Positions</h3>
              <p className="text-gray-600 mb-4 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 bg-brand text-white font-semibold rounded-md hover:bg-brand-700 transition-colors text-sm"
              >
                Reload
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && !error && (
            <div className="grid md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm animate-pulse flex flex-col gap-3">
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mt-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          )}

          {/* Empty Openings State */}
          {!isLoading && !error && openings.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-12 bg-white border border-gray-100 rounded-lg p-8 max-w-xl mx-auto shadow-sm">
              <Briefcase size={40} className="text-brand mb-3 opacity-40" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">No Positions Available</h3>
              <p className="text-gray-600 text-sm">
                We don't have any open opportunities right now, but we are always looking for great talent. Send us your resume!
              </p>
            </div>
          )}

          {/* Job Openings Grid */}
          {!isLoading && !error && openings.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-2 gap-6"
            >
              {openings.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </motion.div>
          )}
        </div>

        {/* CTA / Email */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-white p-8 flex flex-col sm:flex-row items-center gap-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div>
            <h3 className="font-bold text-xl text-ink mb-1">
              Don&apos;t see a role that fits?
            </h3>
            <p className="text-ink-secondary text-[1.05rem]">
              Send your resume to{" "}
              <a
                href="mailto:support@houselink360.com"
                className="text-brand font-semibold hover:underline"
              >
                support@houselink360.com
              </a>{" "}
              and we&apos;ll reach out when the right opportunity opens up.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
