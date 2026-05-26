"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { motion, Variants } from "framer-motion"
import {
  Clock,
  MapPin,
  Banknote,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  Briefcase,
} from "lucide-react"
import { getCareers, getCareer } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import type { Career } from "@/types/career"

// ── Animation variants ────────────────────────────────────────────────────────
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
  if (!min) return "Competitive salary"
  const minNum = Number(min)
  const maxNum = max ? Number(max) : null
  
  if (maxNum && minNum !== maxNum) {
    return `₹${minNum.toLocaleString("en-IN")} – ₹${maxNum.toLocaleString("en-IN")} p.a.`
  }
  return `₹${minNum.toLocaleString("en-IN")} p.a.`
}

// ── Related Job Card ──────────────────────────────────────────────────────────
function RelatedCard({ job }: { job: Career }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-xl shadow-sm border border-surface-tertiary p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-300 group"
    >
      <h4 className="font-bold text-ink group-hover:text-brand transition-colors">
        <Link href={`/careers/${job.id}`}>{job.title}</Link>
      </h4>
      <div className="flex flex-wrap gap-3 text-sm text-ink-secondary">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-brand" /> {formatDate(job.createdAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand" /> {job.location || "Chennai"}
        </span>
        <span className="flex items-center gap-1.5">
          <Banknote className="w-3.5 h-3.5 text-brand" /> {formatSalary(job.salaryMin, job.salaryMax)}
        </span>
      </div>
      <Link
        href={`/careers/${job.id}`}
        className="self-start inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:gap-3 transition-all duration-200"
      >
        View <ChevronRight className="w-4 h-4" />
      </Link>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CareerDetailPage() {
  const { id } = useParams<{ id: string }>()
  
  const [job, setJob] = useState<Career | null>(null)
  const [related, setRelated] = useState<Career[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function loadJobDetails() {
      setIsLoading(true)
      setError(null)
      try {
        const jobId = Number(id)
        if (isNaN(jobId)) {
          setError("Invalid job ID.")
          return
        }

        // Fetch selected job
        const res = await getCareer(jobId)
        if (res.success && res.data) {
          setJob(res.data)
          
          // Fetch all jobs for related openings
          try {
            const allRes = await getCareers()
            if (allRes.success && allRes.data) {
              const filtered = allRes.data.filter((j) => j.id !== jobId).slice(0, 2)
              setRelated(filtered)
            }
          } catch (err) {
            console.error("Failed to load related careers:", err)
          }
        } else {
          setError("Career opening not found.")
        }
      } catch (err: any) {
        console.error("Failed to load career details:", err)
        setError(err.message || "An unexpected error occurred.")
      } finally {
        setIsLoading(false)
      }
    }
    loadJobDetails()
  }, [id])

  if (isLoading) {
    return (
      <div className="bg-surface text-ink pb-16 min-h-screen">
        <div className="relative h-[300px] w-full bg-gray-200 animate-pulse flex items-center justify-center">
          <Briefcase className="w-12 h-12 text-gray-400" />
        </div>
        <div className="container mx-auto px-4 mt-12 max-w-4xl animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-6" />
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
          <div className="flex gap-4 mb-8">
            <div className="h-4 bg-gray-200 rounded w-28" />
            <div className="h-4 bg-gray-200 rounded w-28" />
            <div className="h-4 bg-gray-200 rounded w-28" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-3" />
          <div className="h-4 bg-gray-200 rounded w-full mb-3" />
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-3" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-10" />
          
          <div className="h-24 bg-gray-200 rounded-2xl w-full" />
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="bg-surface text-ink pb-16 min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center text-center py-12 bg-white border border-red-100 rounded-xl p-8 max-w-lg shadow-sm">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Job Opening Not Found</h3>
          <p className="text-gray-600 mb-6 text-sm">
            {error || "The position you are looking for does not exist or has already been filled."}
          </p>
          <Link
            href="/careers"
            className="px-6 py-2.5 bg-brand text-white font-semibold rounded-md hover:bg-brand-700 transition-colors inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Careers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface text-ink overflow-hidden pb-16">
      {/* ── HERO ── */}
      <div className="relative h-[500px] w-full">
        <Image
          src="/assets/images/footer/career_image.png"
          alt={job.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl"
          >
            {job.title}
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
            <Link
              href="/careers"
              className="hover:text-brand-300 transition-colors"
            >
              Careers
            </Link>
            <span className="mx-2">/</span>
            <span className="text-brand-300">{job.id}</span>
          </motion.nav>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="container mx-auto px-4 mt-12 max-w-6xl">
        {/* Back link */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mb-8"
        >
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Careers
          </Link>
        </motion.div>

        {/* Job title + meta */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-10"
        >
          <motion.h2
            variants={fadeUp}
            className="text-[2.2rem] font-bold mb-4"
          >
            {job.title}
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-5 text-sm text-ink-secondary"
          >
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand" /> Posted {formatDate(job.createdAt)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand" /> {job.location || "Chennai"}
            </span>
            <span className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-brand" /> {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          </motion.div>
        </motion.div>

        {/* Description */}
        {job.description && (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="prose prose-neutral max-w-none mb-8 text-ink-secondary text-[0.97rem] leading-[1.85]"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        )}

        {/* Requirements / Content */}
        {job.content && (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="prose prose-neutral max-w-none mb-14 text-ink-secondary text-[0.97rem] leading-[1.85]
              [&_h4]:text-ink [&_h4]:font-bold [&_h4]:text-[1.1rem] [&_h4]:mt-6 [&_h4]:mb-3
              [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1"
            dangerouslySetInnerHTML={{ __html: job.content }}
          />
        )}

        {/* Apply CTA */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-brand/5 border border-brand/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-16"
        >
          <div>
            <h3 className="text-xl font-bold text-ink mb-1">
              Interested in this role?
            </h3>
            <p className="text-ink-secondary text-[1.05rem]">
              Send your résumé to{" "}
              <a
                href="mailto:support@houselink360.com"
                className="text-brand font-semibold hover:underline"
              >
                support@houselink360.com
              </a>{" "}
              with the subject line{" "}
              <em>&quot;Application – {job.title}&quot;</em>.
            </p>
          </div>
          <a
            href="mailto:support@houselink360.com"
            className="shrink-0 inline-flex items-center gap-2 bg-brand text-white font-semibold px-7 py-3 rounded-lg hover:bg-brand-700 transition-colors duration-200"
          >
            Apply Now <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Related Careers */}
        {related.length > 0 && (
          <div>
            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-[2.2rem] font-bold mb-8"
            >
              Related <span className="text-brand">Openings</span>
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-2 gap-6"
            >
              {related.map((r) => (
                <RelatedCard key={r.id} job={r} />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
