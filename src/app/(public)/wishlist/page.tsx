"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, Variants } from "framer-motion"
import {
  MapPin,
  Heart,
  Bed,
  Bath,
  Ruler,
  Star,
  BookmarkX,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────
interface Property {
  id: number
  name: string
  permalink: string
  location: string
  price: number
  image: string
  ownerType: string
  categoryName: string
  isFeatured: boolean
  bedrooms: number | null
  bathrooms: number | null
  area: string | null
  keyFeatures: string[]
}

// ── Mock data (replace with API / context) ────────────────────────────────────
const INITIAL_WISHLIST: Property[] = [
  {
    id: 1,
    name: "Prestige Lakeside Habitat",
    permalink: "prestige-lakeside-habitat",
    location: "Varthur, Bangalore",
    price: 8500000,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    ownerType: "Builder",
    categoryName: "Apartment",
    isFeatured: true,
    bedrooms: 3,
    bathrooms: 2,
    area: "1450 sq.ft",
    keyFeatures: ["Swimming Pool", "Gym", "Club House"],
  },
  {
    id: 2,
    name: "Sobha Dream Acres",
    permalink: "sobha-dream-acres",
    location: "Panathur, Bangalore",
    price: 6200000,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    ownerType: "Builder",
    categoryName: "Villa",
    isFeatured: false,
    bedrooms: 2,
    bathrooms: 2,
    area: "1100 sq.ft",
    keyFeatures: ["24/7 Security", "Park", "Power Backup"],
  },
  {
    id: 3,
    name: "Casagrand Winsworth",
    permalink: "casagrand-winsworth",
    location: "Perumbakkam, Chennai",
    price: 4750000,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    ownerType: "Owner",
    categoryName: "Apartment",
    isFeatured: true,
    bedrooms: 3,
    bathrooms: 3,
    area: "1780 sq.ft",
    keyFeatures: ["Rooftop Garden", "EV Charging", "Concierge"],
  },
  {
    id: 4,
    name: "Brigade Cornerstone Utopia",
    permalink: "brigade-cornerstone-utopia",
    location: "Whitefield, Bangalore",
    price: 11200000,
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    ownerType: "Builder",
    categoryName: "Independent House",
    isFeatured: false,
    bedrooms: 4,
    bathrooms: 4,
    area: "2800 sq.ft",
    keyFeatures: ["Private Pool", "Home Theatre", "Smart Home"],
  },
  {
    id: 5,
    name: "Mahindra Eden",
    permalink: "mahindra-eden",
    location: "Kanakapura Road, Bangalore",
    price: 5600000,
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
    ownerType: "Owner",
    categoryName: "Apartment",
    isFeatured: false,
    bedrooms: 2,
    bathrooms: 1,
    area: "980 sq.ft",
    keyFeatures: ["Jogging Track", "Children Play Area"],
  },
  {
    id: 6,
    name: "TVS Emerald Jardin",
    permalink: "tvs-emerald-jardin",
    location: "Anna Nagar, Chennai",
    price: 9300000,
    image:
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80",
    ownerType: "Builder",
    categoryName: "Penthouse",
    isFeatured: true,
    bedrooms: 3,
    bathrooms: 3,
    area: "2200 sq.ft",
    keyFeatures: ["Sky Deck", "Infinity Pool", "Valet Parking"],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)} L`
  return `₹${n.toLocaleString("en-IN")}`
}

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

// exit is inlined directly on motion.div to avoid Variants → TargetResolver widening

// ── Property Card ─────────────────────────────────────────────────────────────
function PropertyCard({
  property,
  onRemove,
}: {
  property: Property
  onRemove: (id: number) => void
}) {
  const [heartActive, setHeartActive] = useState(true)

  function handleHeart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setHeartActive(false)
    // slight delay so user sees the icon change before the card exits
    setTimeout(() => onRemove(property.id), 350)
  }

  return (
    <motion.div
      variants={fadeUp}
      layout
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.3 } }}
      className="group bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.10)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 transition-all duration-300 rounded-none"
    >
      {/* Image */}
      <div className="relative h-[280px] p-3">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Top overlay: tags + heart */}
          <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-start">
            <div className="flex gap-2 flex-wrap">
              {property.isFeatured && (
                <span className="flex items-center gap-1 bg-brand text-white text-[11px] font-medium px-3 py-1 rounded">
                  <Star className="w-3 h-3" /> Featured
                </span>
              )}
              <span className="bg-blue-100 text-blue-800 text-[11px] font-medium px-3 py-1 rounded">
                {property.ownerType}
              </span>
            </div>

            {/* Heart / remove button */}
            <button
              onClick={handleHeart}
              aria-label="Remove from wishlist"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow transition-all duration-200"
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-200 ${
                  heartActive
                    ? "fill-red-500 text-red-500"
                    : "fill-none text-gray-400"
                }`}
              />
            </button>
          </div>

          {/* Bottom overlay: category */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[11px] font-medium px-3 py-1 rounded">
              {property.categoryName}
            </span>
          </div>

          {/* Full-card link */}
          <Link
            href={`/properties/${property.id}/${property.permalink}`}
            className="absolute inset-0 z-[5]"
            aria-label={`View details for ${property.name}`}
          />
        </div>
      </div>

      {/* Details — pulled up slightly to overlap image */}
      <div className="relative -mt-6 z-20">
        <div className="bg-white rounded-t-2xl px-5 pt-5 pb-5">
          {/* Specs row */}
          {(property.bedrooms || property.bathrooms || property.area) && (
            <div className="flex items-center gap-4 mb-3 text-[13px] font-medium text-gray-700">
              {property.bedrooms && (
                <span className="flex items-center gap-1">
                  <Bed className="w-4 h-4 text-brand" />
                  {property.bedrooms}
                </span>
              )}
              {property.bathrooms && (
                <span className="flex items-center gap-1">
                  <Bath className="w-4 h-4 text-brand" />
                  {property.bathrooms}
                </span>
              )}
              {property.area && (
                <span className="flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-brand" />
                  {property.area}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-[18px] font-semibold text-gray-900 mb-2 truncate leading-snug">
            {property.name}
          </h3>

          {/* Location */}
          <p className="flex items-center gap-1.5 text-gray-500 text-[13px] mb-3">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            {property.location}
          </p>

          {/* Feature chips */}
          {property.keyFeatures.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {property.keyFeatures.slice(0, 3).map((f) => (
                <span
                  key={f}
                  className="text-[11px] text-blue-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded"
                >
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* Divider + price */}
          <hr className="border-[#c3c3c3] border-[1.5px] mb-3" />
          <p className="text-[20px] font-bold text-gray-900 m-0">
            {formatPrice(property.price)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Property[]>(INITIAL_WISHLIST)

  function handleRemove(id: number) {
    setWishlist((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="bg-surface text-ink overflow-hidden pb-16">
      {/* ── HERO ── */}
      <div className="relative h-[500px] w-full">
        <Image
          src="/assets/images/images-about/pricing-image.png"
          alt="Wishlist"
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
            Wishlist
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
            <span className="text-brand-300">Wishlist</span>
          </motion.nav>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="container mx-auto px-4 mt-12 max-w-6xl">

        {/* Intro */}
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-[2.2rem] font-bold mb-4"
        >
          Save Your Favorite Properties with{" "}
          <span className="text-brand">Houselink360°!</span>
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-2 mb-10 text-[1.08rem] leading-[1.8] text-ink-secondary max-w-4xl"
        >
          Create your personalized wishlist and save the properties you&apos;re
          interested in. Whether you&apos;re still browsing or planning to make
          a decision soon, your wishlist will help keep track of the properties
          you love.
        </motion.p>

        {/* How it Works */}
        <div className="mb-14">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[2rem] font-bold mb-6"
          >
            How <span className="text-brand">It Works</span>
          </motion.h2>

          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="pl-6 space-y-3 text-[1.08rem] leading-[1.8] text-ink-secondary list-decimal"
          >
            <motion.li variants={fadeUp}>
              Browse through our listings.
            </motion.li>
            <motion.li variants={fadeUp}>
              Click the <strong className="text-ink">Add to Wishlist</strong>{" "}
              button on your favorite properties.
            </motion.li>
            <motion.li variants={fadeUp}>
              Access your wishlist anytime to review or inquire about your saved
              properties.
            </motion.li>
          </motion.ol>
        </div>

        {/* Your Wishlist */}
        <div className="mb-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-[2rem] font-bold">
              Your <span className="text-brand">Wishlist</span>
            </h2>
            {wishlist.length > 0 && (
              <span className="text-ink-secondary text-[0.95rem]">
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "property" : "properties"} saved
              </span>
            )}
          </motion.div>

          {/* Grid / Empty state */}
          <AnimatePresence mode="popLayout">
            {wishlist.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <BookmarkX className="w-16 h-16 text-gray-300 mb-5" />
                <h4 className="text-xl font-semibold text-ink mb-2">
                  Add Wishlist to view here
                </h4>
                <p className="text-ink-secondary text-[1rem] mb-6 max-w-sm">
                  Start browsing properties and add them to your wishlist to see
                  them here.
                </p>
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-7 py-3 rounded-lg hover:bg-brand-700 transition-colors duration-200"
                >
                  Browse Properties
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial="hidden"
                animate="show"
                variants={stagger}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {wishlist.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onRemove={handleRemove}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
