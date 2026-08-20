/**
 * Central barrel export for all Houselink API functions.
 *
 * Usage:
 *   import { sendOtp, verifyOtpLogin, getStates, getCities } from "@/lib/api";
 *   import { tokenStore, ApiError } from "@/lib/api";
 */

// Client utilities
export { apiClient, tokenStore, ApiError } from "./client";
export type { } from "./client"; // keep module side-effects

// Auth API
export {
  sendOtpRegister,
  register,
  sendOtp,
  retryOtp,
  verifyOtpLogin,
  logout,
  getMe,
  updateMe,
} from "./auth";

// Location API
export { getStates, getCities } from "./locations";

export {
  createProperty,
  resolveLocationIds,
  mapFormDataToApiPayload,
  getFeatures,
  getFacilities,
  uploadFiles,
  getUserProperties,
  getUserPropertiesWithParams,
  deleteProperty,
  getProperty,
  getPropertyByPermalink,
  checkPermalinkAvailability,
  updateProperty,
  mapApiPayloadToFormData,
  getProperties,
  mapApiPropertyToCardProps,
  getCityIdByName,
  getImageUrl,
  getPropertyCategories,
} from "./properties";

// Blogs API
export {
  getBlogs,
  getBlogBySlug,
  getBlogCategories,
  getBlogTags,
} from "./blogs";

// Careers API
export {
  getCareers,
  getCareer,
} from "./careers";

// Packages & Checkout API
export {
  getPackagesList,
  createCheckoutOrder,
  verifyCheckoutPayment,
  reportFailedPayment,
  getCustomerInvoices,
} from "./packages";
export type { Package, CheckoutResponse, UserInvoice } from "./packages";

// Ads API
export {
  getAds,
} from "./ads";

// Popular Properties / Popular Regions API
export {
  getPopularProperties,
  getPopularRegions,
} from "./popular";
export type { PopularPropertyApiItem, PopularRegionApiItem } from "./popular";

// FAQs API
export {
  getFaqs,
  getFaqCategories,
} from "./faqs";

// Partners API
export {
  getPartners,
  createPartnerInquiry,
} from "./partners";

// Contacts API
export {
  createContactMessage,
} from "./contacts";

// Leads API
export {
  createLead,
  getLeads,
  getMyEnquiries,
  checkEnquiryStatus,
  unlockPropertyContact,
} from "./leads";
export type { EnquiryStatusResponse } from "./leads";

// Wishlist API
export {
  getWishlist,
  getWishlistIds,
  addToWishlist,
  removeFromWishlist,
} from "./wishlist";

// Searches API
export {
  getSearches,
  recordSearch,
  deleteSearchHistory,
} from "./searches";
export type { SearchApiItem, SearchApiResponse } from "./searches";

// Hero Config API
export { getHeroConfig } from "./hero";
export type { HeroConfig, HeroConfigResponse } from "./hero";

// Upcoming Config API
export { getUpcomingConfig } from "./upcoming";
export type { UpcomingConfig, UpcomingConfigResponse } from "./upcoming";

// Intro Video Config API
export { getIntroVideoConfig } from "./introVideo";
export type { IntroVideoConfigData, IntroVideoConfigResponse } from "./introVideo";

// CMS API
export { getCmsPages, getCmsPageBySlug } from "./cms";













