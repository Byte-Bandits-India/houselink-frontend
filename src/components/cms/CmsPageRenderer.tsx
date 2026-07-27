"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { getCmsPageBySlug } from "@/lib/api"
import type { CmsPage } from "@/types/cms"

interface CmsPageRendererProps {
  slug: string
  fallbackTitle?: string
  fallbackContent?: string
}

export default function CmsPageRenderer({ slug, fallbackTitle, fallbackContent }: CmsPageRendererProps) {
  const [page, setPage] = useState<CmsPage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    async function loadCmsPage() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await getCmsPageBySlug(slug)
        if (res.success && res.data && res.data.status !== "inactive") {
          setPage(res.data)
        } else if (fallbackTitle) {
          setPage({
            id: 0,
            title: fallbackTitle,
            slug,
            content: fallbackContent || `<p>Welcome to Houselink <strong>${fallbackTitle}</strong>. Content for this page can be updated live from the Admin CMS panel.</p>`,
            status: "active",
            createdAt: new Date().toISOString(),
          })
        } else {
          setError(res.message || "The requested page could not be found.")
        }
      } catch (err: any) {
        if (fallbackTitle) {
          setPage({
            id: 0,
            title: fallbackTitle,
            slug,
            content: fallbackContent || `<p>Welcome to Houselink <strong>${fallbackTitle}</strong>. Content for this page can be updated live from the Admin CMS panel.</p>`,
            status: "active",
            createdAt: new Date().toISOString(),
          })
        } else {
          setError(err?.message || "Failed to load the page content.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadCmsPage()
  }, [slug, fallbackTitle, fallbackContent])

  useEffect(() => {
    if (page?.metaTitle || page?.title) {
      document.title = `${page.metaTitle || page.title} | Houselink`
    }
  }, [page])

  if (isLoading) {
    return (
      <div className="bg-surface text-ink pb-20 overflow-x-hidden min-h-screen">
        <div className="relative h-[320px] w-full bg-slate-900 animate-pulse flex flex-col items-center justify-center text-center px-4">
          <div className="h-8 bg-slate-800 rounded-md w-3/4 max-w-lg mb-4" />
          <div className="h-4 bg-slate-800 rounded-md w-48" />
        </div>
        <div className="container mx-auto px-4 max-w-4xl mt-12 w-full animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-full" />
          <div className="h-5 bg-gray-200 rounded w-5/6" />
          <div className="h-5 bg-gray-200 rounded w-4/6" />
          <div className="h-5 bg-gray-200 rounded w-full mt-6" />
        </div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="bg-surface text-ink pb-20 min-h-[70vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center text-center py-12 bg-white border border-slate-200 rounded-2xl p-8 max-w-lg shadow-sm w-full">
          <BookOpen size={48} className="text-[#153e75] mb-4 opacity-40" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h3>
          <p className="text-slate-600 mb-6 text-sm">
            {error || "The page you are looking for does not exist or is no longer available."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#153e75] px-6 py-2.5 rounded-xl hover:bg-[#0f2d56] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface text-ink pb-20 overflow-x-hidden">
      {/* HERO HEADER */}
      <div className="relative h-[320px] w-full bg-[#153e75]">
        <Image
          src="/assets/images/footer/blogs_image.png"
          alt={page.title}
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl leading-tight break-words [overflow-wrap:anywhere]">
            {page.title}
          </h1>
          <nav className="flex flex-wrap items-center justify-center gap-2 text-sm md:text-base font-medium">
            <Link href="/" className="hover:text-brand-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-brand-300 max-w-[250px] sm:max-w-[400px] truncate" title={page.title}>
              {page.title}
            </span>
          </nav>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="container mx-auto px-4 max-w-4xl mt-12 w-full overflow-hidden">
        {page.metaDesc && (
          <div className="mb-8 p-4 bg-slate-50 border-l-4 border-[#153e75] text-slate-700 text-sm leading-relaxed rounded-r-md">
            {page.metaDesc}
          </div>
        )}

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
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* BACK BUTTON */}
        <div className="mt-12 pt-8 border-t border-surface-tertiary">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#153e75] border border-[#153e75] px-6 py-2.5 hover:bg-[#153e75] hover:text-white transition-all duration-200 rounded-lg"
          >
            <ArrowLeft size={15} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
