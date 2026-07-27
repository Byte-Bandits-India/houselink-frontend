"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { User, Calendar, ArrowLeft, BookOpen } from "lucide-react"
import { getBlogBySlug } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import type { BlogPost } from "@/types/blog"

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug

  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    async function loadBlog() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await getBlogBySlug(slug)
        if (res.success && res.data?.post) {
          setBlog(res.data.post)
        } else {
          setError(res.message || "Blog post not found.")
        }
      } catch (err: any) {
        console.error(`Failed to load blog with slug: ${slug}`, err)
        setError(err?.message || "Failed to load the blog post.")
      } finally {
        setIsLoading(false)
      }
    }

    loadBlog()
  }, [slug])

  if (isLoading) {
    return (
      <div className="bg-surface text-ink pb-20 overflow-x-hidden min-h-screen">
        {/* HERO Skeleton */}
        <div className="relative h-[380px] w-full bg-gray-800 animate-pulse flex flex-col items-center justify-center text-center px-4">
          <div className="h-8 bg-gray-700 rounded-md w-3/4 max-w-xl mb-4" />
          <div className="h-4 bg-gray-700 rounded-md w-48" />
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 max-w-4xl mt-12 w-full animate-pulse">
          <div className="w-full h-[240px] sm:h-[360px] md:h-[420px] mb-8 bg-gray-200 rounded-sm" />
          <div className="h-6 bg-gray-200 rounded w-48 mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="bg-surface text-ink pb-20 min-h-[70vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center text-center py-12 bg-white border border-gray-200 rounded-lg p-8 max-w-lg shadow-sm w-full">
          <BookOpen size={48} className="text-[#153e75] mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Blog Post Not Found</h3>
          <p className="text-gray-600 mb-6 text-sm">
            {error || "The blog post you are looking for does not exist or has been removed."}
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#153e75] px-6 py-2.5 rounded-md hover:bg-[#0f2d56] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface text-ink pb-20 overflow-x-hidden">
      {/* HERO */}
      <div className="relative h-[380px] w-full">
        <Image
          src="/assets/images/footer/blogs_image.png"
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-3xl leading-tight break-words [overflow-wrap:anywhere]">
            {blog.title}
          </h1>
          <nav className="flex flex-wrap items-center justify-center gap-2 text-sm md:text-base font-medium">
            <Link href="/" className="hover:text-brand-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-brand-300 transition-colors">Blogs</Link>
            <span>/</span>
            <span className="text-brand-300 max-w-[200px] sm:max-w-[300px] truncate" title={blog.title}>
              {blog.title}
            </span>
          </nav>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 max-w-4xl mt-12 w-full overflow-hidden">
        {/* Featured Image */}
        <div className="relative w-full h-[240px] sm:h-[360px] md:h-[420px] mb-8 overflow-hidden rounded-sm shadow-md">
          <Image
            src={blog.coverImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200&h=600"}
            alt={blog.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-6 text-sm text-[#666] mb-8 pb-6 border-b border-surface-tertiary flex-wrap">
          <span className="flex items-center gap-2">
            <User size={14} className="text-[#153e75]" />
            <span className="font-medium">Houselink Team</span>
          </span>
          <span className="flex items-center gap-2">
            <Calendar size={14} className="text-[#153e75]" />
            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
          </span>
        </div>

        {/* Blog Content */}
        <article
          className="prose prose-lg max-w-none text-ink-secondary break-words [overflow-wrap:anywhere] [word-break:break-word] overflow-hidden
            prose-headings:text-ink prose-headings:font-bold prose-headings:break-words
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-p:leading-relaxed prose-p:mb-4
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
            prose-li:mb-2
            prose-strong:text-ink
            prose-img:max-w-full prose-img:h-auto prose-img:rounded-md
            prose-pre:max-w-full prose-pre:overflow-x-auto
            prose-table:max-w-full prose-table:block prose-table:overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-surface-tertiary">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#153e75] border border-[#153e75] px-6 py-2.5 hover:bg-[#153e75] hover:text-white transition-all duration-200"
          >
            <ArrowLeft size={15} /> Back to Blogs
          </Link>
        </div>
      </div>
    </div>
  )
}
