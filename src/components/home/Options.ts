// ─────────────────────────────────────────────────────────────────────────────
// Options.ts — Single source of truth for all home-section mock/static data
// ─────────────────────────────────────────────────────────────────────────────

export * from "./type";
import type {
    HeroBadge,
    HeroSlide,
    WhatWeDoItem,
    UpcomingProperty,
    IntroVideoConfig,
} from "./type";

// ── Hero Badges (HomePageClient) ──────────────────────────────────────────────

export const heroBadges: HeroBadge[] = [
    {
        id: "verified",
        iconName: "ShieldCheck",
        title: "Verified Properties",
        subtitle: "100% Trusted",
    },
    {
        id: "locations",
        iconName: "MapPin",
        title: "Prime Locations",
        subtitle: "Best Connectivity",
    },
    {
        id: "deals",
        iconName: "Award",
        title: "Great Deals",
        subtitle: "Best Prices",
    },
    {
        id: "support",
        iconName: "Headphones",
        title: "Expert Support",
        subtitle: "Always Here",
    },
];

// ── Hero Slider Slides (HeroSlider.tsx) ───────────────────────────────────────

export const heroSlides: HeroSlide[] = [
    {
        id: 1,
        image: "/assets/Houselink360SliderImage1.webp",
        title: "List Your Property",
        subtitle: "Premium Listings",
        description:
            "Showcase your property to thousands of active seekers. Easy listing. Maximum visibility. Zero hassle.",
    },
    {
        id: 2,
        image: "/assets/Houselink360SliderImage2.webp",
        title: "Find Your Dream Home",
        subtitle: "Exclusive Properties",
        description:
            "Browse thousands of verified listings across the city. From cozy apartments to luxury villas.",
    },
    {
        id: 3,
        image: "/assets/home/highDemand.png",
        title: "Invest in Real Estate",
        subtitle: "Best Deals",
        description:
            "Discover high-yield investment properties and commercial spaces with expert guidance.",
    },
    {
        id: 4,
        image: "/assets/home/upComming.png",
        title: "Rent with Confidence",
        subtitle: "Verified Rentals",
        description:
            "Find verified rental homes and apartments with transparent pricing and zero brokerage.",
    },
];

export const HERO_SLIDE_DURATION_MS = 4500;

// ── What We Do / How We Work items (HowWeWork.tsx) ───────────────────────────

export const whatWeDoItems: WhatWeDoItem[] = [
    {
        id: "wwd1",
        title: "Rent /Buy a property",
        description:
            "Discover verified rental properties, that offer comfort, convenience and great value.",
        linkText: "Explore Rentals",
        href: "/properties",
        image: "/assets/home/Rent.png",
    },
    {
        id: "wwd2",
        title: "Sell / Lease a property",
        description:
            "Reach genuine buyers, get better visibility, and sell your property with confidence.",
        linkText: "List Your Property",
        href: "/dashboard/properties/new",
        image: "/assets/home/sell.png",
    },
    {
        id: "wwd3",
        title: "Become a Partner",
        description:
            "Partner with us and grow your business with trusted support and exciting opportunities.",
        linkText: "Partner With US",
        href: "/partner-with-us",
        image: "/assets/home/partner.png",
    },
];

// ── Upcoming Properties (UpcomingProperties.tsx) ─────────────────────────────

export const upcomingProperties: UpcomingProperty[] = [
    {
        id: "u1",
        title: "Anu Villa",
        category: "Villa",
        purpose: "Sale",
        location: "Guindy, Chennai",
        price: "₹ 76,00,000",
        image: "/assets/home/upComming/1.png",
    },
    {
        id: "u2",
        title: "DK Plots",
        category: "Plots",
        purpose: "Rent",
        location: "Guindy, Chennai",
        price: "₹ 76,00,000",
        image: "/assets/home/upComming/2.png",
    },
    {
        id: "u3",
        title: "AS Apartments",
        category: "Apartment",
        purpose: "Lease",
        location: "Guindy, Chennai",
        price: "₹ 76,00,000",
        image: "/assets/home/upComming/3.png",
    },
    {
        id: "u4",
        title: "MF Shop",
        category: "Shop",
        purpose: "Rent",
        location: "Guindy, Chennai",
        price: "₹ 76,00,000",
        image: "/assets/home/upComming/4.png",
    },
    {
        id: "u5",
        title: "DK Warehouse",
        category: "Warehouse",
        purpose: "Sale",
        location: "Guindy, Chennai",
        price: "₹ 76,00,000",
        image: "/assets/home/upComming/5.png",
    },
    {
        id: "u6",
        title: "SA Building",
        category: "Building",
        purpose: "Sale",
        location: "Guindy, Chennai",
        price: "₹ 76,00,000",
        image: "/assets/home/upComming/6.png",
    },
];

// ── Intro Video Config (IntroVideo.tsx) ───────────────────────────────────────

export const introVideoConfig: IntroVideoConfig = {
    posterImage: "/assets/images/intro-video/intro-video-bg.png",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/EehVfDnkkGg?autoplay=1&mute=1&controls=0&loop=1&playlist=EehVfDnkkGg&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1",
    youtubeTitle: "Houselink Intro Video",
};
