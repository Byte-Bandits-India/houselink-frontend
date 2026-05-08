/** All route path constants for the Houselink360 app */

export const ROUTES = {
  // ── Public ────────────────────────────────────────────────────────────────
  HOME:               "/",
  PROPERTIES:         "/properties",
  PROPERTIES_DETAIL:  (permalink: string) => `/properties/${permalink}`,
  PROPERTIES_FEATURED:"/properties/featured",
  PROPERTIES_BUILDERS:"/properties/builders",
  PROPERTIES_THANK_YOU:"/properties/thank-you",
  OWNER_PROPERTIES:   "/owner/properties",
  PROJECTS:           "/projects",

  // ── Blog ──────────────────────────────────────────────────────────────────
  BLOG:               "/blog",
  BLOG_DETAIL:        (slug: string) => `/blog/${slug}`,

  // ── Careers ───────────────────────────────────────────────────────────────
  CAREERS:            "/careers",
  CAREER_DETAIL:      (id: string | number) => `/careers/${id}`,

  // ── Wishlist ──────────────────────────────────────────────────────────────
  WISHLIST:           "/wishlist",

  // ── Statics ───────────────────────────────────────────────────────────────
  ABOUT:              "/about",
  CONTACT:            "/contact",
  FAQS:               "/faqs",
  PRICING:            "/pricing",
  TERMS:              "/terms",
  PRIVACY_POLICY:     "/privacy-policy",
  REFUND_POLICY:      "/refund-policy",
  PAYMENT_TERMS:      "/payment-terms",
  LISTING_GUIDELINES: "/listing-guidelines",
  PARTNER_WITH_US:    "/partner-with-us",
  PARTNER_CONTACT:    "/partner-contact",

  // ── Auth ──────────────────────────────────────────────────────────────────
  LOGIN:              "/login",
  REGISTER:           "/register",
  FORGOT_PASSWORD:    "/forgot-password",
  RESET_PASSWORD:     (token: string) => `/reset-password/${token}`,
  VERIFY_OTP:         "/verify-otp",

  // ── Dashboard ─────────────────────────────────────────────────────────────
  DASHBOARD:                "/dashboard",
  DASHBOARD_OVERVIEW:       "/dashboard/overview",
  DASHBOARD_PROFILE:        "/dashboard/profile",
  DASHBOARD_SETTINGS:       "/dashboard/profile/settings",
  DASHBOARD_PROPERTIES:     "/dashboard/properties",
  DASHBOARD_PROPERTIES_ACTIVE:  "/dashboard/properties/active",
  DASHBOARD_PROPERTIES_EXPIRED: "/dashboard/properties/expired",
  DASHBOARD_PROPERTIES_NEW:     "/dashboard/properties/new",
  DASHBOARD_PROPERTIES_EDIT:    (id: string | number) => `/dashboard/properties/${id}/edit`,
  DASHBOARD_LEADS:          "/dashboard/leads",
  DASHBOARD_PACKAGES:       "/dashboard/packages",
  DASHBOARD_PACKAGE_DETAIL: (id: string | number) => `/dashboard/packages/${id}`,
  DASHBOARD_INVOICE:        (id: string | number) => `/dashboard/packages/${id}/invoice`,
  DASHBOARD_INVOICES:       "/dashboard/invoices",
  DASHBOARD_CREDITS:        "/dashboard/credits",
} as const;
