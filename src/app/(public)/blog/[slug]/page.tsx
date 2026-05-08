import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { User, Calendar, ArrowLeft } from "lucide-react"

const mockBlogs = [
  {
    id: 1,
    slug: "renting-vs-buying",
    name: "Renting vs. Buying: Which is Right for You?",
    description: "Discover the pros and cons of renting versus buying a home and find out which option best fits your financial goals, lifestyle, and long-term plans.",
    author_name: "Arjun Sharma",
    created_at: "May 02, 2025",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200&h=600",
    content: `
      <p>One of the biggest financial decisions you'll make in your lifetime is whether to rent or buy a home. Both options have their merits, and the right choice depends heavily on your personal and financial situation.</p>

      <h2>The Case for Buying</h2>
      <p>Owning a home builds equity over time. Every mortgage payment is an investment in your future. Unlike rent payments, which simply go to a landlord, your mortgage payments help you build ownership in an asset that may appreciate in value.</p>
      <ul>
        <li><strong>Equity building:</strong> Your home becomes an asset you own.</li>
        <li><strong>Stability:</strong> Fixed mortgage rates give you predictable monthly costs.</li>
        <li><strong>Freedom:</strong> You can renovate and personalize your space.</li>
        <li><strong>Tax benefits:</strong> Home loan interest may be tax-deductible in India.</li>
      </ul>

      <h2>The Case for Renting</h2>
      <p>Renting offers flexibility that buying simply cannot. If your career requires frequent relocations, or if you're not yet ready to settle down, renting is the smarter choice.</p>
      <ul>
        <li><strong>Flexibility:</strong> Move when your lease ends without major financial consequences.</li>
        <li><strong>Lower upfront costs:</strong> No down payment or stamp duty required.</li>
        <li><strong>Maintenance-free:</strong> Most repairs are the landlord's responsibility.</li>
        <li><strong>Liquidity:</strong> Your savings aren't locked into a property.</li>
      </ul>

      <h2>Key Factors to Consider</h2>
      <p>Before making your decision, ask yourself these questions:</p>
      <ol>
        <li>How long do I plan to stay in this city?</li>
        <li>Do I have a stable income and a good credit score?</li>
        <li>Can I afford a 20% down payment plus additional costs?</li>
        <li>What does the local real estate market look like?</li>
      </ol>

      <h2>Conclusion</h2>
      <p>There is no one-size-fits-all answer. If you value stability, are financially prepared, and plan to stay for at least 5 years, buying is likely the better choice. If you value flexibility and aren't ready for the commitment, renting makes more sense. The key is aligning your housing choice with your life goals.</p>
    `
  },
  {
    id: 2,
    slug: "understanding-real-estate-listings",
    name: "The Ultimate Guide to Understanding Real Estate Listings",
    description: "Learn how to decode real estate listings like a pro.",
    author_name: "Priya Nair",
    created_at: "Apr 25, 2025",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200&h=600",
    content: `
      <p>Real estate listings can feel like reading a foreign language if you're a first-time buyer. Terms like BHK, carpet area, built-up area, FSI, and RERA can be confusing. This guide breaks it all down.</p>

      <h2>Understanding BHK</h2>
      <p>BHK stands for Bedroom, Hall, and Kitchen. A 2BHK means the flat has 2 bedrooms, 1 hall, and 1 kitchen. A 3BHK has 3 bedrooms, and so on. It's the most common way properties are described in India.</p>

      <h2>Carpet Area vs. Built-Up Area vs. Super Built-Up Area</h2>
      <ul>
        <li><strong>Carpet Area:</strong> The actual usable floor space within the walls of your apartment.</li>
        <li><strong>Built-Up Area:</strong> Carpet area + wall thickness + balconies.</li>
        <li><strong>Super Built-Up Area:</strong> Built-up area + your share of common areas like lobbies, lifts, and staircases.</li>
      </ul>

      <h2>RERA Registration</h2>
      <p>Since 2016, all real estate projects above a certain size must be registered with RERA (Real Estate Regulatory Authority). Always verify a project's RERA number before investing.</p>

      <h2>Price Per Square Foot</h2>
      <p>Listings often quote price per sq ft. Multiply this by the total area to get the base price. Remember to add registration, stamp duty, and parking costs for the total.</p>
    `
  },
  {
    id: 3,
    slug: "10-things-to-check-before-buying",
    name: "10 Things to Check Before Buying Your Dream Home",
    description: "Before signing on the dotted line, make sure you've covered these critical checks.",
    author_name: "Vikram Mehta",
    created_at: "Apr 18, 2025",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200&h=600",
    content: `
      <p>Buying a home is one of the biggest investments you'll ever make. Before you sign anything, here are 10 essential checks you should never skip.</p>

      <ol>
        <li><strong>Verify the Title Deed</strong> – Ensure the seller has a clear, marketable title and the property is free of legal disputes.</li>
        <li><strong>Check RERA Registration</strong> – For new projects, always verify RERA compliance.</li>
        <li><strong>Inspect the Property</strong> – Look for water damage, cracks, plumbing issues, and electrical safety.</li>
        <li><strong>Review the Encumbrance Certificate</strong> – This confirms the property has no outstanding loans or liabilities.</li>
        <li><strong>Check Approved Building Plan</strong> – Ensure the structure matches the sanctioned plan from local authorities.</li>
        <li><strong>Understand the Maintenance Charges</strong> – Know what you'll pay monthly for society maintenance.</li>
        <li><strong>Check Connectivity and Amenities</strong> – Proximity to schools, hospitals, metro, and markets matters.</li>
        <li><strong>Review the Builder's Track Record</strong> – Look at past projects and delivery timelines.</li>
        <li><strong>Understand All Costs</strong> – Include registration, stamp duty, GST (for new), parking, and club fees.</li>
        <li><strong>Get a Lawyer's Opinion</strong> – Have a real estate lawyer review all documents before you sign.</li>
      </ol>

      <p>Following these steps will save you from costly surprises down the road and ensure a smooth, secure purchase.</p>
    `
  },
  {
    id: 4,
    slug: "top-localities-chennai-2025",
    name: "Top 5 Localities to Invest in Chennai in 2025",
    description: "Chennai's real estate market is booming. Here are the top 5 localities offering the best ROI.",
    author_name: "Deepa Rajan",
    created_at: "Apr 10, 2025",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1200&h=600",
    content: `
      <p>Chennai continues to be one of South India's most attractive real estate markets. With infrastructure projects like Chennai Metro Phase 2 and the Outer Ring Road development underway, certain localities stand out as exceptional investment opportunities.</p>

      <h2>1. Porur</h2>
      <p>Well-connected to IT corridors like OMR and Guindy, Porur offers excellent value with strong rental demand from IT professionals. Metro connectivity is further boosting prices here.</p>

      <h2>2. Sholinganallur</h2>
      <p>Located on the Old Mahabalipuram Road (OMR), Sholinganallur is Chennai's tech hub. Property prices have appreciated significantly in recent years and continue to grow.</p>

      <h2>3. Anna Nagar</h2>
      <p>A premium residential area with excellent social infrastructure. Anna Nagar remains a safe, long-term investment with consistent appreciation and strong resale value.</p>

      <h2>4. Tambaram</h2>
      <p>An affordable option south of Chennai with excellent connectivity via suburban rail. Tambaram is ideal for first-time buyers looking for budget-friendly homes.</p>

      <h2>5. Kelambakkam</h2>
      <p>Emerging rapidly due to its proximity to the IT corridor and upcoming township projects, Kelambakkam offers the highest growth potential for investors willing to take a slightly longer view.</p>
    `
  },
  {
    id: 5,
    slug: "home-loan-guide-india",
    name: "Home Loan Guide: Everything You Need to Know",
    description: "Navigating home loans in India can be complex. This guide covers everything.",
    author_name: "Arjun Sharma",
    created_at: "Mar 28, 2025",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200&h=600",
    content: `<p>Home loans are the primary financing mechanism for most homebuyers in India. Here is what you need to know before applying.</p><h2>Eligibility</h2><p>Lenders look at your income, credit score (typically 750+), employment stability, age, and existing liabilities. Most banks offer loans up to 80-90% of the property value.</p><h2>Interest Rates</h2><p>Home loan rates in India range from around 8.5% to 11% per annum, depending on the lender and your credit profile. Opt for a floating rate when rates are expected to fall.</p><h2>EMI Calculation</h2><p>Use the formula: EMI = P × r × (1 + r)^n / [(1 + r)^n – 1], where P is principal, r is monthly interest rate, and n is tenure in months. Use online EMI calculators for quick results.</p>`
  },
  {
    id: 6,
    slug: "vastu-shastra-modern-homes",
    name: "Vastu Shastra for Modern Homes: Myths and Facts",
    description: "We separate myths from facts and show how to apply Vastu principles to modern living.",
    author_name: "Priya Nair",
    created_at: "Mar 15, 2025",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200&h=600",
    content: `<p>Vastu Shastra is the ancient Indian science of architecture and space arrangement. While some dismiss it as superstition, many modern homebuyers still factor Vastu into their property decisions.</p><h2>Myth vs. Fact</h2><ul><li><strong>Myth:</strong> The main door must always face north or east. <strong>Fact:</strong> While north and east-facing doors are considered auspicious, south-facing homes are not necessarily bad if other Vastu principles are followed.</li><li><strong>Myth:</strong> Vastu cannot be corrected after construction. <strong>Fact:</strong> There are many Vastu remedies including mirrors, plants, colors, and rearrangement of furniture that can improve energy flow.</li></ul><h2>Practical Vastu Tips</h2><ol><li>Keep the center of the home (Brahmasthan) open and clutter-free.</li><li>The kitchen should ideally be in the southeast corner.</li><li>Master bedroom in the southwest brings stability.</li><li>Avoid placing bathrooms in the northeast corner.</li></ol>`
  }
]

export async function generateStaticParams() {
  return mockBlogs.map((blog) => ({ slug: blog.slug }))
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = mockBlogs.find((b) => b.slug === slug)

  if (!blog) return notFound()

  return (
    <div className="bg-surface text-ink pb-20">
      {/* HERO */}
      <div className="relative h-[380px] w-full">
        <Image
          src="/assets/images/footer/blogs_image.png"
          alt={blog.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-3xl leading-tight">
            {blog.name}
          </h1>
          <nav className="flex items-center gap-2 text-base font-medium">
            <Link href="/" className="hover:text-brand-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-brand-300 transition-colors">Blogs</Link>
            <span>/</span>
            <span className="text-brand-300">{blog.id}</span>
          </nav>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 max-w-4xl mt-12">
        {/* Featured Image */}
        <div className="relative w-full h-[420px] mb-8 overflow-hidden rounded-sm shadow-md">
          <Image
            src={blog.image}
            alt={blog.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-6 text-sm text-[#666] mb-8 pb-6 border-b border-surface-tertiary">
          {blog.author_name && (
            <span className="flex items-center gap-2">
              <User size={14} className="text-brand" />
              <span className="font-medium">{blog.author_name}</span>
            </span>
          )}
          <span className="flex items-center gap-2">
            <Calendar size={14} className="text-brand" />
            <span>{blog.created_at}</span>
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand border border-brand px-6 py-2.5 hover:bg-brand hover:text-white transition-all duration-200"
          >
            <ArrowLeft size={15} /> Back to Blogs
          </Link>
        </div>
      </div>
    </div>
  )
}
