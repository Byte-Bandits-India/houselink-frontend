"use client"

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
  Mail,
} from "lucide-react"

// ── Mock data (replace with API fetch) ───────────────────────────────────────
const openings = [
  {
    id: 1,
    name: "Customer Relationship Management",
    location: "Chennai",
    salary: "₹25,000",
    postedAt: "Apr 12, 2025",
    description:
      "Customer Relationship Management (CRM) refers to the strategies, tools, and technologies used by a c...",
  },
  {
    id: 2,
    name: "Manager Sales",
    location: "Chennai",
    salary: "₹35,000",
    postedAt: "Apr 21, 2025",
    description:
      "The Sales Manager is responsible for leading the sales team, driving revenue growth, and achieving c...",
  },
  {
    id: 3,
    name: "Marketing Manager",
    location: "Chennai",
    salary: "₹25,000",
    postedAt: "Jul 01, 2025",
    description:
      "The Marketing Manager is responsible for planning, executing, and optimizing marketing strategies th...",
  },
  {
    id: 4,
    name: "Tele Marketing",
    location: "Chennai",
    salary: "₹20,000",
    postedAt: "Jul 01, 2025",
    description:
      "The Telemarketing Executive is responsible for contacting potential customers, understanding their p...",
  },
  {
    id: 5,
    name: "Sales Executives",
    location: "Chennai",
    salary: "₹20,000",
    postedAt: "Jul 10, 2025",
    description:
      "The Sales Executive is responsible for generating leads, conducting site visits, and converting pros...",
  },
]

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

// ── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job }: { job: (typeof openings)[0] }) {
  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/careers/${job.id}`}
        className="block bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-300"
      >
        {/* Title */}
        <h3 className="text-[1rem] font-bold text-ink mb-2 leading-snug">
          {job.name}
        </h3>

        {/* Meta row — exactly like the image */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.82rem] text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#4f8bd3]" />
            {job.postedAt}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#4f8bd3]" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-[#4f8bd3]" />
            {job.salary}
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
        </div>

        {/* CTA / Email */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-white p-8 flex flex-col sm:flex-row items-center gap-6"
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
