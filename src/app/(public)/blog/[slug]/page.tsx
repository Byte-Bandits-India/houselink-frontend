import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { User, Calendar, ArrowLeft } from "lucide-react"
import { getBlogs, getBlogBySlug } from "@/lib/api"
import { formatDate } from "@/lib/utils"

export const revalidate = 60 // revalidate every minute (ISR)

export async function generateStaticParams() {
  try {
    const res = await getBlogs({ limit: 100 })
    if (res.success && res.data?.posts) {
      return res.data.posts.map((blog) => ({ slug: blog.slug }))
    }
  } catch (err) {
    console.error("Failed to generate static params for blogs:", err)
  }
  return []
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  
  let blog = null
  try {
    const res = await getBlogBySlug(slug)
    if (res.success && res.data?.post) {
      blog = res.data.post
    }
  } catch (err) {
    console.error(`Failed to load blog with slug: ${slug}`, err)
  }

  if (!blog) return notFound()

  return (
    <div className="bg-surface text-ink pb-20">
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-3xl leading-tight">
            {blog.title}
          </h1>
          <nav className="flex items-center gap-2 text-sm md:text-base font-medium">
            <Link href="/" className="hover:text-brand-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-brand-300 transition-colors">Blogs</Link>
            <span>/</span>
            <span className="text-brand-300 max-w-[200px] truncate" title={blog.title}>
              {blog.title}
            </span>
          </nav>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 max-w-4xl mt-12">
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
        <div className="flex items-center gap-6 text-sm text-[#666] mb-8 pb-6 border-b border-surface-tertiary">
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
          className="prose prose-lg max-w-none text-ink-secondary
            prose-headings:text-ink prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-p:leading-relaxed prose-p:mb-4
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
            prose-li:mb-2
            prose-strong:text-ink"
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
