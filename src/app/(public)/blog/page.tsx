"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, Variants, AnimatePresence } from "framer-motion"
import { User, Calendar, BookOpen, AlertCircle } from "lucide-react"
import HoverViewCard from "@/components/ui/HoverViewCard"
import { getBlogs, getBlogCategories } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import type { BlogPost, BlogTaxonomy } from "@/types/blog"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogTaxonomy[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(6) // 6 items per page fits perfectly in 3-column grid
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getBlogCategories()
        if (res.success && res.data.categories) {
          setCategories(res.data.categories)
        }
      } catch (err) {
        console.error("Failed to load blog categories:", err)
      }
    }
    loadCategories()
  }, [])

  // Fetch blogs on page or category change
  useEffect(() => {
    async function loadBlogs() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await getBlogs({
          page: currentPage,
          limit,
          categorySlug: selectedCategory || undefined,
        })
        if (res.success) {
          setBlogs(res.data.posts)
          setTotalPages(res.data.pagination.totalPages || 1)
        } else {
          setError(res.message || "Failed to load blogs.")
        }
      } catch (err: any) {
        console.error("Failed to load blogs:", err)
        setError(err.message || "An unexpected error occurred while fetching blogs.")
      } finally {
        setIsLoading(false)
      }
    }
    loadBlogs()
  }, [currentPage, selectedCategory, limit])

  const handleCategorySelect = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug)
    setCurrentPage(1) // Reset to page 1 on category switch
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 380, behavior: "smooth" })
  }

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

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-white border border-red-100 rounded-sm shadow-sm max-w-2xl mx-auto p-8">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Blogs</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => setCurrentPage(currentPage)}
                className="px-6 py-2 bg-[#153e75] text-white font-semibold rounded-sm hover:bg-[#0f2d56] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Skeleton Loading State */}
          {isLoading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex flex-col h-full bg-white border border-[#e0e0e0] shadow-sm mb-[30px] overflow-hidden animate-pulse">
                  <div className="h-[200px] bg-gray-200 w-full" />
                  <div className="flex flex-col flex-1 p-5">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                    <div className="flex gap-4 mb-4 mt-auto">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-24 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && blogs.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-gray-100 rounded-sm shadow-sm max-w-2xl mx-auto p-8">
              <BookOpen size={48} className="text-[#153e75] mb-4 opacity-40" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Blogs Found</h3>
              <p className="text-gray-600">
                We couldn't find any blog posts matching the selected topic at this moment. Check back soon for new updates!
              </p>
            </div>
          )}

          {/* Blog Cards Grid */}
          {!isLoading && !error && blogs.length > 0 && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {blogs.map((blog) => (
                  <motion.div
                    key={blog.id}
                    variants={fadeUp}
                    layout
                    className="flex flex-col h-full"
                  >
                    {/* .card — Bootstrap-style white card with border + shadow, mb-30 */}
                    <div className="flex flex-col h-full bg-white border border-[#e0e0e0] shadow-sm mb-[30px] overflow-hidden hover:shadow-md transition-shadow duration-300">

                      {/* .post-featured-image — h-[200px], overflow-hidden, image scale on hover + View cursor */}
                      <HoverViewCard className="h-[200px] overflow-hidden block">
                        <Link href={`/blog/${blog.slug}`} className="block w-full h-full group">
                          <Image
                            src={blog.coverImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800&h=500"}
                            alt={blog.title}
                            width={800}
                            height={500}
                            unoptimized
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                            <Link href={`/blog/${blog.slug}`} className="text-[#153e75] hover:text-[#0f2d56] transition-colors">
                              {blog.title}
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
                            {blog.excerpt || (blog.content ? blog.content.replace(/<[^>]*>/g, "") : "")}
                          </p>
                        </div>

                        {/* .post-item-meta — font-size:14px, color:#666 */}
                        <div className="mb-[15px] text-[14px] text-[#666] flex flex-wrap gap-x-4 gap-y-1">
                          <span className="inline-flex items-center gap-1">
                            <User size={12} className="text-[#153e75] shrink-0" />
                            <span className="font-[500]">Houselink Team</span>
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={12} className="text-[#153e75] shrink-0" />
                            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
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
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination — matches .page-pagination wow fadeInUp */}
          {!isLoading && !error && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center gap-2 mt-8"
            >
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 text-sm font-semibold border transition-all duration-200
                      ${pageNumber === currentPage
                        ? "bg-[#153e75] text-white border-[#153e75]"
                        : "bg-white text-[#153e75] border-[#153e75] hover:bg-[#153e75] hover:text-white"
                      }`}
                  >
                    {pageNumber}
                  </button>
                )
              })}
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}
