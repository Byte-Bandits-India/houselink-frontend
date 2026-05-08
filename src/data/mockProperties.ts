import { PropertyCardProps } from "@/components/shared/PropertyCard";

export const mockProperties: PropertyCardProps[] = [
  {
    id: "1",
    name: "Luxury Villa in Anna Nagar",
    image: "/assets/images/property_images/1752744094_HouseLink360 - Sree Sai - Pallikaranai - 1280x667px -Tablet - Web Banner.png",
    permalink: "luxury-villa-anna-nagar",
    isFeatured: true,
    type: "Owner",
    categoryName: "Villas",
    price: 15000000,
    location: "Anna Nagar, Chennai",
    bedrooms: 4,
    bathrooms: 3,
    area: "3200 Sq.Ft",
    direction: "East",
    features: [
      { name: "Swimming Pool" },
      { name: "Gym" },
      { name: "24/7 Security" },
    ],
    views: 1245,
    created_at: "May 01, 2026",
    city: { name: "Chennai" },
    state: { name: "Tamil Nadu" },
    description: "<p>Welcome to this stunning luxury villa located in the heart of Anna Nagar. Featuring modern architecture, expansive living spaces, and premium amenities. This property offers the perfect blend of comfort and elegance for your family.</p><p>The villa includes 4 spacious bedrooms, a private swimming pool, a fully equipped gym, and 24/7 security.</p>",
    images: [
      { image_url: "/assets/images/property_images/1744975533_pexels-davidmcbee-1546166.jpg" },
      { image_url: "/assets/images/property_images/1744975202_pexels-nextvoyage-1481105.jpg" },
      { image_url: "/assets/images/property_images/1744974792_pexels-expect-best-79873-323780.jpg" }
    ],
    house_type: "Independent Villa",
    construction_age: "New Construction",
    ownership_type: "Freehold",
    furnishing_type: "Fully Furnished",
    water_supply: "Corporation & Borewell",
    parking_availability: "Yes",
    parking_slots_count: 2,
    property_for: "Sale",
    brokerage_type: "no_brokerage",
  },
  {
    id: "2",
    name: "Modern Apartment in T Nagar",
    image: "/assets/images/property_images/1744975202_pexels-nextvoyage-1481105.jpg",
    permalink: "modern-apartment-t-nagar",
    isFeatured: true,
    type: "Builder",
    categoryName: "Apartments",
    price: 8500000,
    location: "T Nagar, Chennai",
    bedrooms: 3,
    bathrooms: 2,
    area: "1800 Sq.Ft",
    direction: "North",
    features: [
      { name: "Lift" },
      { name: "Parking" },
      { name: "Garden" },
    ],
  },
  {
    id: "3",
    name: "Residential Plot in Tambaram",
    image: "/assets/images/property_images/1744974716_pexels-tobiasbjorkli-2119714.jpg",
    permalink: "residential-plot-tambaram",
    isFeatured: false,
    type: "Owner",
    categoryName: "Plots",
    price: 4500000,
    location: "Tambaram, Chennai",
    area: "2400 Sq.Ft",
    direction: "South",
    features: [
      { name: "DTCP Approved" },
      { name: "Clear Title" },
    ],
  },
  {
    id: "4",
    name: "Spacious House in Adyar",
    image: "/assets/images/property_images/1744974792_pexels-expect-best-79873-323780.jpg",
    permalink: "spacious-house-adyar",
    isFeatured: true,
    type: "Owner",
    categoryName: "Individual House",
    price: 22000000,
    location: "Adyar, Chennai",
    bedrooms: 5,
    bathrooms: 4,
    area: "4000 Sq.Ft",
    direction: "West",
    features: [
      { name: "Modular Kitchen" },
      { name: "Car Parking" },
      { name: "Terrace" },
    ],
  },
  {
    id: "5",
    name: "Commercial Space in Guindy",
    image: "/assets/images/property_images/1749888834_office-buildings (1).jpg",
    permalink: "commercial-space-guindy",
    isFeatured: false,
    type: "Builder",
    categoryName: "Commercial Property",
    price: 35000000,
    location: "Guindy, Chennai",
    bathrooms: 2,
    area: "5000 Sq.Ft",
    features: [
      { name: "Power Backup" },
      { name: "Conference Room" },
    ],
  },
  {
    id: "6",
    name: "Premium Flat in Velachery",
    image: "/assets/images/property_images/1745220415_leo_visions-R6USOrl2OJA-unsplash (1).jpg",
    permalink: "premium-flat-velachery",
    isFeatured: true,
    type: "Owner",
    categoryName: "Apartments",
    price: 6200000,
    location: "Velachery, Chennai",
    bedrooms: 2,
    bathrooms: 2,
    area: "1200 Sq.Ft",
    direction: "East",
    features: [
      { name: "Vastu Compliant" },
      { name: "Gated Community" },
      { name: "Club House" },
    ],
  },
];

export const heroSlides = [
  {
    id: 1,
    image: "/assets/Houselink360SliderImage1.webp",
    subtitle: "HouseLink360°",
    title: "Find Your Dream Property in Just a Few Clicks",
    description:
      "Explore thousands of verified property listings, homes, apartments, land, and rentals, all in one place. Simple search. Smarter decisions.",
  },
  {
    id: 2,
    image: "/assets/Houselink360SliderImage2.webp",
    subtitle: "HouseLink360°",
    title: "List Your Property. Reach Genuine Buyers.",
    description:
      "Showcase your property to thousands of active seekers. Easy listing. Maximum visibility. Zero hassle.",
  },
];

export const services = [
  {
    title: "Rent a Property",
    description:
      "Find your perfect rental space with ease, comfort, and verified listings.",
    image: "/assets/images/property_images/Rent_Property.webp",
    href: "/properties?property_purpose=rent",
  },
  {
    title: "Buy a Property",
    description:
      "Discover your dream home or investment with trusted property options tailored to your needs.",
    image: "/assets/images/property_images/Buy_Property.webp",
    href: "/properties",
  },
  {
    title: "Become a Partner",
    description:
      "Join hands with Houselink360° and grow your real estate business with greater visibility and leads.",
    image: "/assets/images/property_images/Become_Partner.webp",
    href: "/partner-with-us",
  },
];

export const whyChooseUs = [
  {
    title: "Smart Property Matches",
    description:
      "We help buyers, tenants, and investors find spaces that align with their needs, across residential, commercial, and rental markets.",
    icon: "smart-match",
  },
  {
    title: "Verified Listings, Real Choices",
    description:
      "Explore a wide range of up-to-date and verified property listings with ease, no brokers, no middlemen, only information at your fingertips.",
    icon: "verified",
  },
  {
    title: "List with Confidence, Search with Clarity",
    description:
      "Whether you're a seller, landlord, or seeker, Houselink360° ensures a seamless listing and discovery experience with smart filters.",
    icon: "clarity",
  },
];

export const howWeWork = [
  {
    step: "01",
    title: "Explore & Discover",
    description:
      "Browse thousands of verified listings across residential, commercial, and rental spaces. Use advanced filters to narrow down by location, budget, type, and more.",
    icon: "/assets/images/how-we-work/ExploreDiscoverIcons.svg",
  },
  {
    step: "02",
    title: "Shortlist & Compare",
    description:
      "Easily bookmark and compare your favorite listings. Make informed choices with detailed property info, images, and map views.",
    icon: "/assets/images/how-we-work/ShortlistCompareIcons.svg",
  },
  {
    step: "03",
    title: "Connect & Proceed",
    description:
      "Reach out to property owners or agents directly via the platform. All communication, follow-ups, and decisions are entirely in your hands.",
    icon: "/assets/images/how-we-work/ConnectProceedIcons.svg",
  },
];

export const blogPosts = [
  {
    id: "1",
    name: "10 Tips for First-Time Home Buyers in Chennai",
    image: "/assets/images/property_images/1744974716_pexels-tobiasbjorkli-2119714.jpg",
    slug: "tips-first-time-home-buyers",
  },
  {
    id: "2",
    name: "Understanding Property Registration Process",
    image: "/assets/images/property_images/1744974792_pexels-expect-best-79873-323780.jpg",
    slug: "property-registration-process",
  },
  {
    id: "3",
    name: "Best Neighborhoods for Investment in 2025",
    image: "/assets/images/property_images/1744975533_pexels-davidmcbee-1546166.jpg",
    slug: "best-neighborhoods-investment-2025",
  },
  {
    id: "4",
    name: "10 Tips for First-Time Home Buyers in Chennai",
    image: "/assets/images/property_images/1744974716_pexels-tobiasbjorkli-2119714.jpg",
    slug: "tips-first-time-home-buyers",
  },
];
