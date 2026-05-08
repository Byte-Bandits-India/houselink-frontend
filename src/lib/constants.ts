export const APP_NAME = "Houselink360";
export const APP_TAGLINE = "Find Your Dream Property";
export const APP_DESCRIPTION =
  "Houselink360 – India's trusted property portal for buying, selling, and renting residential & commercial properties.";

export const LOGO_PATH = "/images/logo/logo.svg";
export const LOGO_WHITE_PATH = "/images/logo/logo-white.svg";
export const FAVICON_PATH = "/images/logo/favicon.png";

export const PLACEHOLDER_PROPERTY = "/images/placeholders/property-placeholder.webp";
export const PLACEHOLDER_AVATAR = "/images/placeholders/avatar-placeholder.webp";

export const SOCIAL_LINKS = {
  facebook:  "https://facebook.com/houselink360",
  instagram: "https://instagram.com/houselink360",
  twitter:   "https://twitter.com/houselink360",
  linkedin:  "https://linkedin.com/company/houselink360",
  youtube:   "https://youtube.com/@houselink360",
} as const;

export const CONTACT = {
  email:   "hello@houselink360.com",
  phone:   "+91 98765 43210",
  address: "Houselink360 Pvt. Ltd., Mumbai, Maharashtra – 400001",
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://houselink360.com";

export const ITEMS_PER_PAGE = 12;
