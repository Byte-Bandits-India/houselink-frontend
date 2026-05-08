"use client"
import Image from "next/image"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { User, Calendar } from "lucide-react"
import HoverViewCard from "@/components/ui/HoverViewCard"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

const mockBlogs = [
  {
    id: 1,
    slug: "renting-vs-buying",
    name: "Renting vs. Buying: Which is Right for You?",
    description: "Discover the pros and cons of renting versus buying a home and find out which option best fits your financial goals, lifestyle, and long-term plans.",
    author_name: "Arjun Sharma",
    created_at: "May 02, 2025",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 2,
    slug: "understanding-real-estate-listings",
    name: "The Ultimate Guide to Understanding Real Estate Listings",
    description: "Learn how to decode real estate listings like a pro. From square footage to price per sqft, we break down everything you need to know before making an offer.",
    author_name: "Priya Nair",
    created_at: "Apr 25, 2025",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 3,
    slug: "10-things-to-check-before-buying",
    name: "10 Things to Check Before Buying Your Dream Home",
    description: "Before signing on the dotted line, make sure you've covered these critical checks. Our expert guide helps you avoid costly mistakes in the home buying process.",
    author_name: "Vikram Mehta",
    created_at: "Apr 18, 2025",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 4,
    slug: "top-localities-chennai-2025",
    name: "Top 5 Localities to Invest in Chennai in 2025",
    description: "Chennai's real estate market is booming. Here are the top 5 localities offering the best ROI for buyers and investors in 2025.",
    author_name: "Deepa Rajan",
    created_at: "Apr 10, 2025",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 5,
    slug: "home-loan-guide-india",
    name: "Home Loan Guide: Everything You Need to Know",
    description: "Navigating home loans in India can be complex. This comprehensive guide covers eligibility, interest rates, EMI calculations, and top lenders to help you make the right choice.",
    author_name: "Arjun Sharma",
    created_at: "Mar 28, 2025",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 6,
    slug: "vastu-shastra-modern-homes",
    name: "Vastu Shastra for Modern Homes: Myths and Facts",
    description: "Is Vastu Shastra still relevant in modern architecture? We separate myths from facts and show how you can apply time-tested Vastu principles to contemporary living spaces.",
    author_name: "Priya Nair",
    created_at: "Mar 15, 2025",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800&h=500"
  }
]

export default function BlogPage() {
  return (
    <div className="bg-surface text-ink overflow-hidden pb-20">

      {/* HERO — matches .page-header with blogs_image.png */}
      <div className="relative h-[420px] w-full">
        <Image
          src="/assets/images/footer/blogs_image.png"
          alt="Our Blogs"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold mb-5"
          >
            Our Blogs
          </motion.h1>
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            aria-label="breadcrumb"
          >
            <ol className="flex items-center gap-2 text-base font-medium list-none p-0 m-0">
              <li><Link href="/" className="hover:text-white/80 transition-colors">home</Link></li>
              <li className="opacity-60">/</li>
              <li className="text-white/80" aria-current="page">blogs</li>
            </ol>
          </motion.nav>
        </div>
      </div>

      {/* PAGE BLOG — matches .page-blog > .container > .row */}
      <div className="w-full py-16">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Blog Cards Grid — col-lg-4 col-md-6 */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {mockBlogs.map((blog) => (
              // .blog-card — height: 100%, flex, flex-direction: column
              <motion.div
                key={blog.id}
                variants={fadeUp}
                className="flex flex-col h-full"
              >
                {/* .card — Bootstrap-style white card with border + shadow, mb-30 */}
                <div className="flex flex-col h-full bg-white border border-[#e0e0e0] shadow-sm mb-[30px] overflow-hidden">

                  {/* .post-featured-image — h-[200px], overflow-hidden, image scale on hover + View cursor */}
                  <HoverViewCard className="h-[200px] overflow-hidden block">
                    <Link href={`/blog/${blog.slug}`} className="block w-full h-full group">
                      <Image
                        src={blog.image}
                        alt={blog.name}
                        width={800}
                        height={500}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                  </HoverViewCard>

                  {/* .card-body — flex:1, flex-col */}
                  <div className="flex flex-col flex-1 p-5">

                    {/* .post-item-content — flex:1 */}
                    <div className="flex-1">
                      {/* h5.card-title — min-h-[48px], 2-line clamp */}
                      <h5 className="font-bold text-[1.25rem] text-ink mb-[10px] leading-snug"
                        style={{
                          minHeight: "48px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        <Link href={`/blog/${blog.slug}`} className="text-brand transition-colors">
                          {blog.name}
                        </Link>
                      </h5>

                      {/* p.card-text — min-h-[60px], 3-line clamp */}
                      <p className="text-[#555] text-sm leading-relaxed mb-[15px]"
                        style={{
                          minHeight: "60px",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {blog.description}
                      </p>
                    </div>

                    {/* .post-item-meta — font-size:14px, color:#666 */}
                    <div className="mb-[15px] text-[14px] text-[#666]">
                      {blog.author_name && (
                        <span className="inline-flex items-center gap-1 mr-[15px] mb-1">
                          <User size={12} className="text-[#153e75] shrink-0" />
                          <span className="font-[500]">{blog.author_name}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 mb-1">
                        <Calendar size={12} className="text-[#153e75] shrink-0" />
                        <span>{blog.created_at}</span>
                      </span>
                    </div>

                    {/* .post-item-btn — margin-top:auto, .post-btn style */}
                    <div className="mt-auto">
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="inline-block text-sm font-semibold text-[#153e75] uppercase tracking-wide relative
                          after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#153e75]
                          hover:after:w-full after:transition-all after:duration-300"
                      >
                        read more
                      </Link>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination — matches .page-pagination wow fadeInUp */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex justify-center gap-2 mt-8"
          >
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 text-sm font-semibold border transition-all duration-200
                  ${page === 1
                    ? "bg-[#153e75] text-white border-[#153e75]"
                    : "bg-white text-[#153e75] border-[#153e75] hover:bg-[#153e75] hover:text-white"
                  }`}
              >
                {page}
              </button>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  )
}
