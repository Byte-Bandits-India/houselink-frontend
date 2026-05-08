"use client"

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
} from "lucide-react"

// ── Mock data ─────────────────────────────────────────────────────────────────
// Replace with your API call: `fetch(`/api/careers/${id}`)`
const allJobs = [
  {
    id: 1,
    name: "Senior Property Consultant",
    location: "Chennai, Tamil Nadu",
    salary: "₹6,00,000 – ₹9,00,000 p.a.",
    postedAt: "May 01, 2026",
    description: `<p>We are looking for an experienced <strong>Senior Property Consultant</strong> to join our growing team at Houselink360°.</p>
    <p>In this role, you will consult residential and commercial clients, guide them through the entire property-buying journey, and build a strong referral network.</p>`,
    content: `<h4>Key Responsibilities</h4>
    <ul>
      <li>Manage end-to-end property sales cycle for assigned accounts.</li>
      <li>Conduct site visits, negotiations and closures.</li>
      <li>Maintain CRM records and weekly performance reports.</li>
      <li>Collaborate with the marketing team on lead-generation campaigns.</li>
    </ul>
    <h4>Requirements</h4>
    <ul>
      <li>3+ years of experience in real estate sales.</li>
      <li>Strong communication and negotiation skills.</li>
      <li>Proficiency in any CRM tool.</li>
      <li>Valid Tamil Nadu real-estate broker license preferred.</li>
    </ul>`,
  },
  {
    id: 2,
    name: "Digital Marketing Executive",
    location: "Chennai, Tamil Nadu",
    salary: "₹3,50,000 – ₹5,50,000 p.a.",
    postedAt: "Apr 22, 2026",
    description: `<p>We are hiring a results-driven <strong>Digital Marketing Executive</strong> to own our online growth channels at Houselink360°.</p>
    <p>You will plan, execute and optimise SEO, SEM and social-media campaigns that generate qualified property leads.</p>`,
    content: `<h4>Key Responsibilities</h4>
    <ul>
      <li>Manage Google Ads, Meta Ads and LinkedIn campaigns.</li>
      <li>Improve organic search rankings through on-page and off-page SEO.</li>
      <li>Create monthly performance dashboards and present insights.</li>
      <li>Coordinate with content writers and designers.</li>
    </ul>
    <h4>Requirements</h4>
    <ul>
      <li>2+ years of digital marketing experience.</li>
      <li>Hands-on experience with Google Analytics 4 and Search Console.</li>
      <li>Certified in Google Ads or Meta Blueprint (preferred).</li>
    </ul>`,
  },
  {
    id: 3,
    name: "Full-Stack Developer",
    location: "Remote / Chennai",
    salary: "₹8,00,000 – ₹14,00,000 p.a.",
    postedAt: "Apr 15, 2026",
    description: `<p>We're looking for a talented <strong>Full-Stack Developer</strong> to build and maintain the Houselink360° platform.</p>
    <p>You'll work across the entire stack — from crafting pixel-perfect Next.js UIs to designing robust Node.js APIs.</p>`,
    content: `<h4>Key Responsibilities</h4>
    <ul>
      <li>Develop new features using Next.js (App Router) and Node.js / Express.</li>
      <li>Optimise database queries in PostgreSQL via Prisma ORM.</li>
      <li>Write unit and integration tests; maintain CI/CD pipelines.</li>
      <li>Participate in code reviews and architecture discussions.</li>
    </ul>
    <h4>Requirements</h4>
    <ul>
      <li>3+ years of full-stack development experience.</li>
      <li>Strong knowledge of TypeScript, React and REST / GraphQL APIs.</li>
      <li>Familiarity with Docker, GitHub Actions and cloud hosting.</li>
    </ul>`,
  },
  {
    id: 4,
    name: "Customer Success Manager",
    location: "Chennai, Tamil Nadu",
    salary: "₹4,00,000 – ₹6,00,000 p.a.",
    postedAt: "Apr 10, 2026",
    description: `<p>We are seeking a proactive <strong>Customer Success Manager</strong> to onboard and nurture our growing base of property partners.</p>
    <p>You will act as the primary liaison between Houselink360° and key accounts, ensuring they get maximum value from the platform.</p>`,
    content: `<h4>Key Responsibilities</h4>
    <ul>
      <li>Own the onboarding experience for new partner accounts.</li>
      <li>Conduct regular check-ins and quarterly business reviews.</li>
      <li>Identify upsell and cross-sell opportunities.</li>
      <li>Relay product feedback to the engineering team.</li>
    </ul>
    <h4>Requirements</h4>
    <ul>
      <li>2+ years in a customer-facing role (SaaS / PropTech preferred).</li>
      <li>Excellent verbal and written communication in English and Tamil.</li>
      <li>Proficiency with Freshdesk or similar helpdesk tools.</li>
    </ul>`,
  },
]

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

// ── Related Job Card ──────────────────────────────────────────────────────────
function RelatedCard({ job }: { job: (typeof allJobs)[0] }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-xl shadow-sm border border-surface-tertiary p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-300 group"
    >
      <h4 className="font-bold text-ink group-hover:text-brand transition-colors">
        <Link href={`/careers/${job.id}`}>{job.name}</Link>
      </h4>
      <div className="flex flex-wrap gap-3 text-sm text-ink-secondary">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-brand" /> {job.postedAt}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand" /> {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Banknote className="w-3.5 h-3.5 text-brand" /> {job.salary}
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
  const job = allJobs.find((j) => j.id === Number(id))

  if (!job) notFound()

  const related = allJobs.filter((j) => j.id !== job.id).slice(0, 2)

  return (
    <div className="bg-surface text-ink overflow-hidden pb-16">
      {/* ── HERO ── */}
      <div className="relative h-[500px] w-full">
        <Image
          src="/assets/images/footer/career_image.png"
          alt={job.name}
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
            {job.name}
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
            {job.name}
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-5 text-sm text-ink-secondary"
          >
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand" /> Posted {job.postedAt}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand" /> {job.location}
            </span>
            <span className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-brand" /> {job.salary}
            </span>
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="prose prose-neutral max-w-none mb-8 text-ink-secondary text-[0.97rem] leading-[1.85]"
          dangerouslySetInnerHTML={{ __html: job.description }}
        />

        {/* Requirements / Content */}
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
              <em>&quot;Application – {job.name}&quot;</em>.
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
              className="text-[2rem] font-bold mb-8"
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
