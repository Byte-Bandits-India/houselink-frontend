import { ROUTES } from "./routes";

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

/** Main header navigation */
export const headerNav: NavLink[] = [
  { label: "Home", href: ROUTES.HOME },
  {
    label: "Properties",
    href: ROUTES.PROPERTIES,
    children: [
      { label: "All Properties",      href: ROUTES.PROPERTIES },
      { label: "Featured Properties", href: ROUTES.PROPERTIES_FEATURED },
      { label: "By Builders",         href: ROUTES.PROPERTIES_BUILDERS },
      { label: "Owner Properties",    href: ROUTES.OWNER_PROPERTIES },
    ],
  },
  { label: "Projects", href: ROUTES.PROJECTS },
  { label: "Blog",     href: ROUTES.BLOG },
  { label: "Pricing",  href: ROUTES.PRICING },
  { label: "About",    href: ROUTES.ABOUT },
  { label: "Contact",  href: ROUTES.CONTACT },
];

/** Dashboard sidebar navigation */
export const dashboardNav: NavLink[] = [
  { label: "Overview",   href: ROUTES.DASHBOARD_OVERVIEW },
  {
    label: "Properties",
    href: ROUTES.DASHBOARD_PROPERTIES,
    children: [
      { label: "All Listings",  href: ROUTES.DASHBOARD_PROPERTIES },
      { label: "Active",        href: ROUTES.DASHBOARD_PROPERTIES_ACTIVE },
      { label: "Expired",       href: ROUTES.DASHBOARD_PROPERTIES_EXPIRED },
      { label: "Add Property",  href: ROUTES.DASHBOARD_PROPERTIES_NEW },
    ],
  },
  { label: "Leads",    href: ROUTES.DASHBOARD_LEADS },
  { label: "Packages", href: ROUTES.DASHBOARD_PACKAGES },
  { label: "Invoices", href: ROUTES.DASHBOARD_INVOICES },
  { label: "Credits",  href: ROUTES.DASHBOARD_CREDITS },
  { label: "Profile",  href: ROUTES.DASHBOARD_PROFILE },
];

/** Footer links grouped by section */
export const footerNav = {
  company: [
    { label: "About Us",    href: ROUTES.ABOUT },
    { label: "Careers",     href: ROUTES.CAREERS },
    { label: "Blog",        href: ROUTES.BLOG },
    { label: "Contact Us",  href: ROUTES.CONTACT },
    { label: "Partner With Us", href: ROUTES.PARTNER_WITH_US },
  ],
  properties: [
    { label: "All Properties",   href: ROUTES.PROPERTIES },
    { label: "Featured",         href: ROUTES.PROPERTIES_FEATURED },
    { label: "Builders",         href: ROUTES.PROPERTIES_BUILDERS },
    { label: "Owner Properties", href: ROUTES.OWNER_PROPERTIES },
    { label: "Projects",         href: ROUTES.PROJECTS },
  ],
  legal: [
    { label: "Terms & Conditions",  href: ROUTES.TERMS },
    { label: "Privacy Policy",      href: ROUTES.PRIVACY_POLICY },
    { label: "Refund Policy",       href: ROUTES.REFUND_POLICY },
    { label: "Payment Terms",       href: ROUTES.PAYMENT_TERMS },
    { label: "Listing Guidelines",  href: ROUTES.LISTING_GUIDELINES },
  ],
  account: [
    { label: "Login",           href: ROUTES.LOGIN },
    { label: "Register",        href: ROUTES.REGISTER },
    { label: "Dashboard",       href: ROUTES.DASHBOARD },
    { label: "My Properties",   href: ROUTES.DASHBOARD_PROPERTIES },
    { label: "Wishlist",        href: ROUTES.WISHLIST },
  ],
} as const;
