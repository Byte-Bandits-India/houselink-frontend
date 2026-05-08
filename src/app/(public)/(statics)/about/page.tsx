"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  List,
  Search,
  FileText,
  ShieldCheck,
  Star,
  Target,
  Building2,
  Filter,
  Monitor,
  HeadphonesIcon,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const coreServices = [
  {
    icon: <List className="w-8 h-8 text-white" />,
    title: "Property Listings",
    desc: "We offer a wide range of property listings that cater to every need, from residential homes and apartments to commercial properties and land. Our listings are updated regularly to ensure that you always have access to the most current properties available on the market.",
  },
  {
    icon: <Search className="w-8 h-8 text-white" />,
    title: "User-Friendly Search Functionality",
    desc: "Our platform allows users to search for properties using a variety of filters including price, location, type, amenities, and more, ensuring that you can find exactly what you're looking for.",
  },
  {
    icon: <FileText className="w-8 h-8 text-white" />,
    title: "Detailed Property Descriptions",
    desc: "We understand how important it is to have detailed and accurate information. Our listings provide high-quality images, comprehensive property details, and key features to give you a clear picture before you make any decisions.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    title: "Verified Listings",
    desc: "We verify all listings to ensure that the information provided by sellers and agents is accurate. This way, you can trust that you're getting reliable data to guide your property decisions.",
  },
];

const whyChoose = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    title: "Reliable Property Listings",
    desc: "We pride ourselves on offering a platform filled with verified and up-to-date property listings. We ensure that all the details provided by sellers and agents are accurate, so you can make informed decisions.",
  },
  {
    icon: <Filter className="w-8 h-8 text-white" />,
    title: "Advanced Search Filters",
    desc: "Our smart search filters make it easy to narrow down property options based on your preferences, whether you're looking for a home within a specific budget, location, or set of amenities.",
  },
  {
    icon: <Monitor className="w-8 h-8 text-white" />,
    title: "Seamless User Experience",
    desc: "Our website is designed with you in mind. From listing properties to browsing potential options, we have streamlined the entire process so that you can enjoy a hassle-free experience.",
  },
  {
    icon: <HeadphonesIcon className="w-8 h-8 text-white" />,
    title: "Expert Support",
    desc: "Our team is always here to provide assistance. Whether you have a question about a property, need help creating a listing, or want tips on the buying or selling process, we're happy to offer guidance.",
  },
  {
    icon: <Building2 className="w-8 h-8 text-white" />,
    title: "Wide Range of Properties",
    desc: "Whether you're looking for a small apartment, a sprawling villa, or commercial space, Houselink360° has a variety of listings that can meet every need.",
  },
];

const howWeWork = [
  {
    step: "01",
    title: "Initial Consultation",
    desc: "We start with a one-on meeting to understand your vision preferences and requirement.",
    iconSrc: "/assets/images/how-we-work/InitialConsultationIcons.svg",
  },
  {
    step: "02",
    title: "Design Planning",
    desc: "This involves selecting materials, and layouts, furnishings, as well as creating 3D renderings.",
    iconSrc: "/assets/images/how-we-work/DesignPlanningIcons.svg",
  },
  {
    step: "03",
    title: "Project Execution",
    desc: "With the design plans in this place, we manage and coordinate all aspects of the projects.",
    iconSrc: "/assets/images/how-we-work/ProjectExecutionIcons.svg",
  },
  {
    step: "04",
    title: "Final Review",
    desc: "After completing project we conduct a thorough walkthrough with you to review the space.",
    iconSrc: "/assets/images/how-we-work/FinalReviewIcons.svg",
  },
];

const teamMembers = [
  {
    name: "Abraham R",
    role: "Co-Founder & CEO",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    name: "Priya Nair",
    role: "Human Resources Manager",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    name: "Vikram Mehta",
    role: "Civil Engineering",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-surface text-ink overflow-hidden">
      {/* ───── HERO ───── */}
      <div className="relative h-[520px] w-full">
        <Image
          src="/assets/images/footer/about_us.png"
          alt="About Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            About Us
          </motion.h1>
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <ol className="flex items-center gap-2 text-base font-medium list-none p-0 m-0">
              <li>
                <Link
                  href="/"
                  className="hover:text-white/80 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li className="opacity-60">/</li>
              <li className="text-white/80" aria-current="page">
                About Us
              </li>
            </ol>
          </motion.nav>
        </div>
      </div>

      {/* ───── ABOUT US + OUR STORY ───── */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Images column */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeLeft}
              className="relative w-full h-[500px] md:h-[600px] lg:h-[620px]"
            >
              {/* Dot Pattern - bottom left */}
              <div
                className="absolute bottom-6 left-[2%] w-36 h-36 z-0 opacity-70"
                style={{
                  backgroundImage:
                    "radial-gradient(#d1d5db 3px, transparent 3px)",
                  backgroundSize: "18px 18px",
                }}
              />

              {/* Image 1 - Top Left (NO rounded corners) */}
              <div className="absolute top-0 left-0 w-[82%] h-[52%] overflow-hidden z-10 shadow-sm">
                <Image
                  src="/assets/images/about-us/about-us-image1.webp"
                  alt="About Houselink360"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Positive Feedback — right side, vertically aligned with top image */}
              <div className="absolute md:-top-6 md:right-6 top-0 right-0 h-[52%] z-30 flex flex-col items-center justify-center gap-3">
                <p
                  className="text-[13px] font-bold tracking-widest text-[#222] uppercase whitespace-nowrap"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  Positive Feedback
                </p>
                <div className="w-[62px] h-[62px] md:w-[70px] md:h-[70px] bg-[#153e75] rounded-full text-white flex items-center justify-center font-bold text-[15px] md:text-[17px] shadow-md flex-shrink-0">
                  95%
                </div>
              </div>

              {/* Image 2 - Bottom Right (NO rounded corners, white border frame) */}
              <div className="absolute bottom-0 right-14 w-[75%] h-[56%] bg-white p-3 md:p-4 z-20 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src="/assets/images/about-us/about-us-image2.webp"
                    alt="About Houselink360 2"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Experience counter (15+) — at the seam between the two images */}
              <div className="absolute top-[50%] left-0 md:left-[3%] -translate-y-1/2 z-30 w-[145px] h-[145px] md:w-[172px] md:h-[172px] bg-[#153e75] rounded-full text-white flex flex-col items-center justify-center border-[14px] md:border-[16px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                <div className="text-[2.6rem] md:text-[3.25rem] font-bold leading-none">
                  15+
                </div>
                <div className="text-[10px] md:text-[12px] font-semibold text-center px-3 leading-tight tracking-wide mt-1">
                  Years Of
                  <br />
                  Experience
                </div>
              </div>
            </motion.div>

            {/* Content column */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-col gap-8 lg:pl-6"
            >
              <motion.div variants={fadeUp}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative w-8 h-[1px] bg-[#333]/50 after:content-[''] after:absolute after:right-0 after:-top-[3px] after:w-1.5 after:h-1.5 after:border-t after:border-r after:border-[#333]/50 after:rotate-45"></div>
                  <span className="text-[15px] font-bold text-[#153e75]">
                    About Us
                  </span>
                </div>
                <p className="text-[#333] text-[15px] leading-[1.9]">
                  Welcome to Houselink360°, your one-stop platform for all
                  things in real estate listing. We are a leading property
                  listing platform dedicated to simplifying the property buying,
                  selling, and renting process for individuals and real estate
                  professionals. With a user-friendly interface, transparent
                  listings, and a strong commitment to quality, Houselink360°
                  connects property seekers with their dream homes, investment
                  opportunities, and real estate deals across the region.
                </p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h2 className="text-[2.75rem] font-extrabold text-ink mb-6 tracking-tight">
                  Our <span className="text-[#153e75]">Story</span>
                </h2>
                <p className="text-[#333] text-[15px] leading-[1.9] mb-5">
                  Houselink360° was founded with a single mission: to
                  revolutionize the way people buy, sell, and rent properties.
                  We noticed a significant gap in the real estate market for a
                  platform that was both reliable and easy to navigate.
                  Traditional property listing websites often lacked
                  transparency, had outdated information, and made it difficult
                  for buyers and sellers to connect.
                </p>
                <p className="text-[#333] text-[15px] leading-[1.9]">
                  That's when we decided to create Houselink360°, a platform
                  built to bridge the gap between property seekers and sellers,
                  while focusing on transparency, accuracy, and user experience.
                  Since then, we have helped thousands of people find their
                  perfect property, whether it's their first home, an investment
                  property, or a rental.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* What We Do + Core Services */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-20"
          >
            <motion.div variants={fadeUp} className="mb-4">
              <h2 className="text-3xl font-bold mb-3">
                What <span className="text-brand">We Do</span>
              </h2>
              <p className="text-ink-secondary text-[1.05rem] leading-relaxed max-w-4xl">
                At Houselink360°, we are focused on providing a comprehensive
                online platform where individuals can browse and list
                properties, from residential homes to commercial spaces and
                everything in between. Whether you are buying your dream home,
                looking for a rental, or selling a property, we offer a
                streamlined and easy-to-use interface that makes the process
                simple and hassle-free.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 mb-10">
              <h2 className="text-3xl font-bold">
                Our <span className="text-brand">Core Services</span>
              </h2>
            </motion.div>

            {/* Core Services Grid — 3 columns, 4th wraps to new row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
              {coreServices.map((service, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex items-start gap-4"
                >
                  {/* Icon circle */}
                  <div className="w-[60px] h-[60px] text-white rounded-full bg-[#153e75] flex items-center justify-center shrink-0">
                    {service.icon}
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-[1.05rem] font-bold mb-2 text-ink-primary">
                      {service.title}
                    </h3>
                    <p className="text-ink-secondary text-sm leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───── VISION MISSION (dark section) ───── */}
      <section className="bg-ink pt-16 pb-80">
        <div className="mx-auto px-4 max-w-6xl">
          {/* Header row */}
          <div className="grid lg:grid-cols-2 gap-10 mb-20">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeLeft}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="mt-[1px] text-lg leading-none text-white/40">
                  →
                </span>

                <p className="m-0 text-sm font-semibold uppercase tracking-[0.2em] leading-none text-white/60">
                  Vision Mission
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                A behind the scenes look at{" "}
                <span className="text-brand">our agency</span>
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeRight}
              className="flex items-end"
            >
              <p className="text-white/70 text-[1.05rem] leading-relaxed">
                Our portfolio showcases a diverse range of projects, from
                beautifully crafted residential spaces functional and stylish
                commercial interiors
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* White section that holds the breakout card */}
      <section className="bg-white relative -top-24">
        <div className="mx-auto px-4 max-w-6xl">
          <div className="-translate-y-64">
            <div className="bg-[#f0f2f5] rounded-2xl px-10 md:px-16 py-12">
              <div className="grid md:grid-cols-2 gap-10">
                {/* Vision */}
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <div className="w-16 h-16 rounded-full bg-[#153e75] flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-4">
                    Our Vision
                  </h3>
                  <p className="text-ink-secondary leading-relaxed mb-4">
                    At Houselink360°, we envision becoming the leading online
                    property listing platform that sets new standards in the
                    real estate industry. By continuously enhancing our
                    technology and services, we aim to build a platform where
                    property seekers and sellers can interact more efficiently
                    and make smarter decisions, all while fostering trust and
                    transparency in the industry.
                  </p>
                  <p className="font-bold text-ink mb-2">We aim to:</p>
                  <ul className="text-ink-secondary leading-[1.8] list-disc pl-5 space-y-1">
                    <li>
                      Become the go-to platform for people looking for
                      properties, providing them with high-quality listings and
                      resources.
                    </li>
                    <li>
                      Expand our network of trusted agents, sellers, and real
                      estate professionals to offer users a broader selection of
                      options.
                    </li>
                    <li>
                      Continuously innovate to ensure that our platform meets
                      the evolving needs of the real estate market.
                    </li>
                  </ul>
                </motion.div>

                {/* Mission */}
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-16 h-16 rounded-full bg-[#153e75] flex items-center justify-center mb-6">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-4">
                    Our Mission
                  </h3>
                  <p className="text-ink-secondary leading-relaxed mb-4">
                    Our mission at Houselink360° is simple: to make property
                    transactions easy, transparent, and accessible for everyone.
                    Whether you're looking to buy, sell, or rent a property, we
                    aim to provide a seamless experience where users can find
                    reliable information, connect with trusted real estate
                    professionals, and make informed decisions. We are committed
                    to:
                  </p>
                  <ul className="text-ink-secondary leading-[1.8] list-disc pl-5 space-y-1">
                    <li>
                      <strong className="text-ink">Transparency:</strong>{" "}
                      Providing honest and accurate information about
                      properties, pricing, and terms.
                    </li>
                    <li>
                      <strong className="text-ink">Customer Experience:</strong>{" "}
                      Offering a user-friendly platform that makes browsing and
                      listing properties a smooth process.
                    </li>
                    <li>
                      <strong className="text-ink">Trust:</strong> Building
                      long-lasting relationships with users, agents, and sellers
                      by prioritizing integrity and professionalism.
                    </li>
                    <li>
                      <strong className="text-ink">Efficiency:</strong>{" "}
                      Streamlining property transactions to save you time and
                      effort.
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── WHY CHOOSE HOUSELINK360° ───── */}
      <section className="pb-20 pt-10 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="mt-[1px] text-lg leading-none text-ink-secondary">
                →
              </span>

              <p className="m-0 text-sm font-semibold uppercase tracking-[0.2em] leading-none text-brand">
                Why Choose Houselink360°?
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              A behind the scenes look at{" "}
              <span className="text-brand">our agency</span>
            </h2>
            <p className="text-ink-secondary text-[1.05rem] leading-relaxed max-w-3xl">
              From concept to completion, discover how we bring your vision to
              life with innovation, collaboration, and expert craftsmanship.
            </p>
          </motion.div>

          {/* Why Choose Item List — single column, no cards */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col gap-10"
          >
            {whyChoose.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-6"
              >
                {/* Solid navy icon circle — matches .icon-box style */}
                <div className="w-[60px] h-[60px] rounded-full bg-[#153e75] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>

                {/* Text — no card, no border */}
                <div className="pt-1">
                  <h3 className="font-bold text-[1.1rem] mb-1 text-ink">
                    {item.title}
                  </h3>
                  <p className="text-ink-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── HOW WE WORK (dark section) ───── */}
      <section className="bg-ink py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header row */}
          <div className="grid lg:grid-cols-2 gap-10 items-start mb-16">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeLeft}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="mt-[1px] text-lg leading-none text-white/40">
                  →
                </span>

                <p className="m-0 text-sm font-semibold uppercase tracking-[0.2em] leading-none text-white/60">
                  How We Work
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                From concept to completion <br />
                in <span className="text-brand">our work</span>
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeRight}
              className="flex items-center"
            >
              <p className="text-white/70 text-[1.05rem] leading-relaxed">
                Our comprehensive approach guides you through each phase of the
                design process, from initial brainstorming and
                conceptualization.
              </p>
            </motion.div>
          </div>

          {/* How We Work List — 4 columns, no cards, icon on top */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {howWeWork.map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="flex flex-col">
                {/* Raw SVG icon — no circle, no background */}
                <div className="mb-6 h-14 flex items-end">
                  <img
                    src={step.iconSrc}
                    alt={step.title}
                    className="h-12 w-auto brightness-0 invert opacity-90"
                  />
                </div>

                {/* Title with number prefix */}
                <h3 className="text-white font-bold text-[1.05rem] mb-2">
                  <span className="text-white font-bold">
                    {String(i + 1).padStart(2, "0")}.{" "}
                  </span>
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── OUR TEAM ───── */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10 text-center"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-brand mb-2">
              Our Team
            </p>
            <p className="text-ink-secondary text-[1.05rem] leading-relaxed max-w-6xl mx-auto">
              The Houselink360° team is made up of passionate individuals who
              care deeply about the real estate industry. From tech experts
              working behind the scenes to our customer service team ensuring
              that every user gets the help they need, we all share one goal: to
              help you find your perfect property.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
