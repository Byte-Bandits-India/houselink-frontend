# Houselink360 — Frontend-Only Next.js File Tree (Hardcoded with Mock Data)

> **Architecture**: Pure static/hardcoded frontend. Every page and component renders from `mockData/`. No API calls. When ready to go live, swap mock imports with real PHP API service calls.

```text
houselink360-web/
│
├── public/
│   ├── images/
│   │   ├── logo/
│   │   │   ├── logo.svg
│   │   │   ├── logo-white.svg
│   │   │   └── favicon.png
│   │   ├── hero/
│   │   │   ├── hero-bg.webp
│   │   │   └── hero-bg-mobile.webp
│   │   ├── backgrounds/
│   │   │   ├── page-header-bg.webp
│   │   │   └── dashboard-banner.webp
│   │   ├── placeholders/
│   │   │   ├── property-placeholder.webp
│   │   │   └── avatar-placeholder.webp
│   │   └── illustrations/
│   │       ├── empty-state.svg
│   │       └── thank-you.svg
│   ├── fonts/
│   │   ├── HankenGrotesk-Regular.woff2
│   │   ├── HankenGrotesk-Medium.woff2
│   │   └── HankenGrotesk-Bold.woff2
│   └── icons/
│       ├── property-type/
│       │   ├── apartment.svg
│       │   ├── villa.svg
│       │   ├── individual-house.svg
│       │   ├── commercial.svg
│       │   ├── land.svg
│       │   ├── shop.svg
│       │   ├── building.svg
│       │   ├── godown.svg
│       │   ├── warehouse.svg
│       │   └── office-space.svg
│       └── amenities/
│           ├── gym.svg
│           ├── pool.svg
│           ├── parking.svg
│           ├── bank.svg
│           ├── atm.svg
│           └── metro.svg
│
├── src/
│   │
│   ├── mockData/                                    ← All hardcoded data lives here
│   │   ├── properties/
│   │   │   ├── propertiesList.mock.ts               ← Array of 20+ property listing items
│   │   │   ├── propertyDetail.mock.ts               ← Single property full detail object
│   │   │   ├── featuredProperties.mock.ts           ← 6 featured property cards
│   │   │   ├── builderProperties.mock.ts            ← Properties grouped by builder
│   │   │   ├── ownerProperties.mock.ts              ← Owner-type properties list
│   │   │   ├── myProperties.mock.ts                 ← Logged-in user's own properties
│   │   │   ├── activeListings.mock.ts               ← Active property listings
│   │   │   └── expiredListings.mock.ts              ← Expired property listings
│   │   ├── blog/
│   │   │   ├── blogList.mock.ts                     ← Array of blog post summaries
│   │   │   └── blogDetail.mock.ts                   ← Single blog post full content
│   │   ├── careers/
│   │   │   ├── careersList.mock.ts                  ← Array of open job positions
│   │   │   └── careerDetail.mock.ts                 ← Single job detail object
│   │   ├── projects/
│   │   │   └── projectsList.mock.ts                 ← Array of builder projects
│   │   ├── dashboard/
│   │   │   ├── stats.mock.ts                        ← Overview stats (views, leads, credits)
│   │   │   ├── leads.mock.ts                        ← Enquiries/leads received
│   │   │   ├── packages.mock.ts                     ← Available subscription packages
│   │   │   ├── invoices.mock.ts                     ← Purchase invoice history
│   │   │   └── credits.mock.ts                      ← Credit balance and usage log
│   │   ├── statics/
│   │   │   ├── faqs.mock.ts                         ← FAQ questions and answers
│   │   │   └── pricing.mock.ts                      ← Pricing plan data
│   │   ├── auth/
│   │   │   └── user.mock.ts                         ← Mock logged-in user profile
│   │   └── wishlist/
│   │       └── wishlist.mock.ts                     ← Wishlist property items
│   │
│   ├── app/
│   │   │
│   │   ├── (public)/
│   │   │   ├── layout.tsx                           ← Public layout: Header + Footer
│   │   │   ├── page.tsx                             ← Home Page (uses mockData/properties, blog)
│   │   │   │
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx                         ← Property Listing Page (uses propertiesList.mock.ts)
│   │   │   │   ├── thank-you/
│   │   │   │   │   └── page.tsx                     ← Thank You Page (static content)
│   │   │   │   ├── featured/
│   │   │   │   │   └── page.tsx                     ← Featured Properties Page (uses featuredProperties.mock.ts)
│   │   │   │   ├── builders/
│   │   │   │   │   └── page.tsx                     ← Builders Page (uses builderProperties.mock.ts)
│   │   │   │   └── [permalink]/
│   │   │   │       └── page.tsx                     ← Property Detail Page (uses propertyDetail.mock.ts)
│   │   │   │
│   │   │   ├── projects/
│   │   │   │   └── page.tsx                         ← Projects Listing Page (uses projectsList.mock.ts)
│   │   │   │
│   │   │   ├── owner/
│   │   │   │   └── properties/
│   │   │   │       └── page.tsx                     ← Owner Properties Page (uses ownerProperties.mock.ts)
│   │   │   │
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx                         ← Blog Listing Page (uses blogList.mock.ts)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx                     ← Blog Detail Page (uses blogDetail.mock.ts)
│   │   │   │
│   │   │   ├── careers/
│   │   │   │   ├── page.tsx                         ← Careers Listing Page (uses careersList.mock.ts)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx                     ← Career Detail Page (uses careerDetail.mock.ts)
│   │   │   │
│   │   │   ├── wishlist/
│   │   │   │   └── page.tsx                         ← Wishlist Page (uses wishlist.mock.ts)
│   │   │   │
│   │   │   └── (statics)/
│   │   │       ├── about/
│   │   │       │   └── page.tsx                     ← About Us Page (hardcoded content)
│   │   │       ├── contact/
│   │   │       │   └── page.tsx                     ← Contact Page (form + hardcoded info)
│   │   │       ├── faqs/
│   │   │       │   └── page.tsx                     ← FAQs Page (uses faqs.mock.ts)
│   │   │       ├── pricing/
│   │   │       │   └── page.tsx                     ← Pricing Page (uses pricing.mock.ts)
│   │   │       ├── terms/
│   │   │       │   └── page.tsx                     ← Terms & Conditions (hardcoded content)
│   │   │       ├── privacy-policy/
│   │   │       │   └── page.tsx                     ← Privacy Policy (hardcoded content)
│   │   │       ├── refund-policy/
│   │   │       │   └── page.tsx                     ← Refund Policy (hardcoded content)
│   │   │       ├── payment-terms/
│   │   │       │   └── page.tsx                     ← Payment Terms (hardcoded content)
│   │   │       ├── listing-guidelines/
│   │   │       │   └── page.tsx                     ← Listing Guidelines (hardcoded content)
│   │   │       ├── partner-with-us/
│   │   │       │   └── page.tsx                     ← Partner With Us (hardcoded content + form)
│   │   │       └── partner-contact/
│   │   │           └── page.tsx                     ← Partner Contact Page (form only)
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.tsx                           ← Auth layout (centered card layout)
│   │   │   ├── login/
│   │   │   │   └── page.tsx                         ← Login Page (uses LoginForm component)
│   │   │   ├── register/
│   │   │   │   └── page.tsx                         ← Register Page (uses RegisterForm component)
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx                         ← Forgot Password Page
│   │   │   ├── reset-password/
│   │   │   │   └── [token]/
│   │   │   │       └── page.tsx                     ← Reset Password Page
│   │   │   └── verify-otp/
│   │   │       └── page.tsx                         ← OTP Verification Page
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                           ← Dashboard layout: Sidebar + TopNav
│   │   │   └── dashboard/
│   │   │       ├── page.tsx                         ← Dashboard Root (redirects to overview)
│   │   │       ├── overview/
│   │   │       │   └── page.tsx                     ← Overview Page (uses stats.mock.ts)
│   │   │       ├── profile/
│   │   │       │   ├── page.tsx                     ← Profile Page (uses user.mock.ts)
│   │   │       │   └── settings/
│   │   │       │       └── page.tsx                 ← Settings Page (uses user.mock.ts)
│   │   │       ├── properties/
│   │   │       │   ├── page.tsx                     ← All My Properties (uses myProperties.mock.ts)
│   │   │       │   ├── active/
│   │   │       │   │   └── page.tsx                 ← Active Listings (uses activeListings.mock.ts)
│   │   │       │   ├── expired/
│   │   │       │   │   └── page.tsx                 ← Expired Listings (uses expiredListings.mock.ts)
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx                 ← Add Property Page (multi-step form, hardcoded options)
│   │   │       │   └── [id]/
│   │   │       │       └── edit/
│   │   │       │           └── page.tsx             ← Edit Property Page (uses myProperties.mock.ts for prefill)
│   │   │       ├── leads/
│   │   │       │   └── page.tsx                     ← Leads Page (uses leads.mock.ts)
│   │   │       ├── packages/
│   │   │       │   ├── page.tsx                     ← Packages List (uses packages.mock.ts)
│   │   │       │   └── [id]/
│   │   │       │       ├── page.tsx                 ← Package Detail (uses packages.mock.ts)
│   │   │       │       └── invoice/
│   │   │       │           └── page.tsx             ← Invoice Page (uses invoices.mock.ts)
│   │   │       ├── invoices/
│   │   │       │   └── page.tsx                     ← Invoices List Page (uses invoices.mock.ts)
│   │   │       └── credits/
│   │   │           └── page.tsx                     ← Credits Page (uses credits.mock.ts)
│   │   │
│   │   ├── layout.tsx                               ← Root layout (fonts, providers)
│   │   └── globals.css
│   │
│   ├── modules/
│   │   │
│   │   ├── properties/
│   │   │   ├── components/
│   │   │   │   ├── PropertyCard.tsx                 ← Single property card tile
│   │   │   │   ├── PropertyGrid.tsx                 ← Grid/list of PropertyCard components
│   │   │   │   ├── PropertyFilters.tsx              ← Sidebar filter panel (hardcoded options)
│   │   │   │   ├── PropertySearchBar.tsx            ← Top search bar with type/location dropdowns
│   │   │   │   ├── PropertyDetail.tsx               ← Full property detail layout
│   │   │   │   ├── PropertyGallery.tsx              ← Image gallery with lightbox
│   │   │   │   ├── PropertyMap.tsx                  ← Static map placeholder (no live API)
│   │   │   │   ├── PropertyBadge.tsx                ← Badges: For Rent / For Sale / Featured
│   │   │   │   ├── PropertyPriceTag.tsx             ← Price display with label (Rent/Lease/Sell)
│   │   │   │   ├── PropertyAmenities.tsx            ← Amenities icons + labels
│   │   │   │   ├── PropertyKeyFacilities.tsx        ← Key facilities distances list
│   │   │   │   ├── PropertyContactForm.tsx          ← Enquiry form (hardcoded submit handler)
│   │   │   │   ├── WishlistButton.tsx               ← Heart icon toggle button
│   │   │   │   └── SimilarProperties.tsx            ← Horizontal scroll of related cards
│   │   │   ├── form/                                ← Multi-step Add/Edit Property Form
│   │   │   │   ├── PropertyFormStepper.tsx          ← Step progress indicator
│   │   │   │   ├── Step1_PropertyPurpose.tsx        ← Step 1: Residential / Commercial
│   │   │   │   ├── Step2_PropertyType.tsx           ← Step 2: Apartment/Villa/Shop/Land/etc.
│   │   │   │   ├── Step3_BasicDetails.tsx           ← Step 3: Name, Description, Permalink
│   │   │   │   ├── Step4_AreaDetails.tsx            ← Step 4: Built-up, Carpet, Plot Area + Unit
│   │   │   │   ├── Step5_FloorDetails.tsx           ← Step 5: Total Floors, Property On Floor
│   │   │   │   ├── Step6_PropertyFeatures.tsx       ← Step 6: BHK, Furnishing, Water, Pet, Parking
│   │   │   │   ├── Step7_PricingDetails.tsx         ← Step 7: Price, Security Deposit, Maintenance
│   │   │   │   ├── Step8_Location.tsx               ← Step 8: State, City, Location Area
│   │   │   │   ├── Step9_Amenities.tsx              ← Step 9: Key Facilities + Features
│   │   │   │   ├── Step10_Images.tsx                ← Step 10: Image upload UI (mock preview)
│   │   │   │   ├── Step11_SeoDetails.tsx            ← Step 11: SEO title, desc, index
│   │   │   │   └── FormSummary.tsx                  ← Final review before submit
│   │   │   ├── types/
│   │   │   │   ├── property.types.ts                ← Type defs matching PHP API response shape
│   │   │   │   ├── filter.types.ts                  ← Filter panel types
│   │   │   │   └── form.types.ts                    ← Multi-step form field types
│   │   │   └── constants/
│   │   │       ├── propertyTypes.ts                 ← Hardcoded: Apartment, Villa, Shop, etc.
│   │   │       ├── furnishingOptions.ts             ← Furnished / Semi / Unfurnished
│   │   │       ├── bhkOptions.ts                    ← 1BHK, 2BHK, 3BHK, 4BHK+
│   │   │       ├── ownerTypes.ts                    ← Owner / Consultant / Builder
│   │   │       ├── parkingOptions.ts                ← Car / Bike / Both
│   │   │       ├── tenantPreferences.ts             ← Any / Family / Bachelor / Company
│   │   │       ├── waterSupplyOptions.ts            ← Borewell / Corporation / Both
│   │   │       ├── directionOptions.ts              ← North / South / East / West
│   │   │       ├── constructionAgeOptions.ts        ← New / 0-5yrs / 5-10yrs / 10+ yrs
│   │   │       └── areaUnitOptions.ts               ← Sq. Ft / Sq. Mt / Cents / Acres
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx                    ← Email + password fields, submit button
│   │   │   │   ├── RegisterForm.tsx                 ← Name, phone, email, password fields
│   │   │   │   ├── OTPVerifyForm.tsx                ← 6-digit OTP input
│   │   │   │   ├── ForgotPasswordForm.tsx           ← Email field to request reset
│   │   │   │   └── ResetPasswordForm.tsx            ← New password + confirm fields
│   │   │   └── types/
│   │   │       └── auth.types.ts                    ← User, Session, OTP type definitions
│   │   │
│   │   ├── dashboard/
│   │   │   └── components/
│   │   │       ├── StatsCard.tsx                    ← Stat box: Views / Leads / Credits
│   │   │       ├── CreditWidget.tsx                 ← Credit balance bar
│   │   │       ├── DashboardWelcomeBanner.tsx       ← Greeting banner with user name
│   │   │       └── RecentLeadsWidget.tsx            ← Mini leads table on overview
│   │   │
│   │   ├── blog/
│   │   │   └── components/
│   │   │       ├── BlogCard.tsx                     ← Blog listing card (title, date, excerpt)
│   │   │       ├── BlogGrid.tsx                     ← Grid layout of BlogCards
│   │   │       ├── BlogDetail.tsx                   ← Full blog content layout
│   │   │       ├── BlogSidebar.tsx                  ← Recent posts, categories sidebar
│   │   │       └── BlogTagCloud.tsx                 ← Tags display
│   │   │
│   │   ├── careers/
│   │   │   └── components/
│   │   │       ├── CareerCard.tsx                   ← Job listing card (title, location, type)
│   │   │       ├── CareerDetail.tsx                 ← Full job description
│   │   │       └── ApplicationForm.tsx              ← Name, email, resume upload (mock)
│   │   │
│   │   ├── wishlist/
│   │   │   └── components/
│   │   │       ├── WishlistGrid.tsx                 ← Grid of wishlist PropertyCards
│   │   │       └── WishlistEmpty.tsx                ← Empty state illustration + CTA
│   │   │
│   │   ├── packages/
│   │   │   └── components/
│   │   │       ├── PackageCard.tsx                  ← Package plan card (name, price, features)
│   │   │       ├── PackageComparison.tsx            ← Side-by-side plan comparison table
│   │   │       ├── InvoiceRow.tsx                   ← Single invoice row for the table
│   │   │       ├── InvoicePDFViewer.tsx             ← Placeholder PDF viewer/download button
│   │   │       └── CreditBar.tsx                    ← Visual credit usage progress bar
│   │   │
│   │   ├── leads/
│   │   │   └── components/
│   │   │       ├── LeadsTable.tsx                   ← Full enquiry/leads data table
│   │   │       ├── LeadRow.tsx                      ← Single lead row (name, phone, property)
│   │   │       └── LeadFilterBar.tsx                ← Date range + status filter controls
│   │   │
│   │   ├── profile/
│   │   │   └── components/
│   │   │       ├── ProfileForm.tsx                  ← Edit profile fields (name, phone, email)
│   │   │       ├── AvatarUploader.tsx               ← Avatar preview + file input (mock)
│   │   │       ├── PasswordForm.tsx                 ← Current + new password fields
│   │   │       └── DangerZone.tsx                   ← Delete account section
│   │   │
│   │   ├── owner/
│   │   │   └── components/
│   │   │       ├── OwnerPropertyCard.tsx            ← Property card for owner listing page
│   │   │       ├── OwnerGrid.tsx                    ← Grid of OwnerPropertyCards
│   │   │       └── OwnerFilters.tsx                 ← Filter bar for owner properties
│   │   │
│   │   ├── projects/
│   │   │   └── components/
│   │   │       ├── ProjectCard.tsx                  ← Builder project card
│   │   │       ├── ProjectGrid.tsx                  ← Grid of ProjectCards
│   │   │       ├── ProjectFilters.tsx               ← Builder name / location / type filters
│   │   │       └── ProjectDetail.tsx                ← Full project detail layout
│   │   │
│   │   └── statics/
│   │       └── components/
│   │           ├── FAQAccordion.tsx                 ← Expandable FAQ item (uses faqs.mock.ts)
│   │           ├── PricingTable.tsx                 ← Pricing tier comparison (uses pricing.mock.ts)
│   │           ├── ContactForm.tsx                  ← Name, phone, message (hardcoded alert)
│   │           └── PartnerForm.tsx                  ← Partner enquiry form
│   │
│   ├── components/
│   │   ├── global/
│   │   │   ├── Header.tsx                           ← Logo, nav links, auth buttons
│   │   │   ├── Footer.tsx                           ← Footer links, social icons
│   │   │   ├── Sidebar.tsx                          ← Dashboard sidebar navigation
│   │   │   ├── DashboardTopNav.tsx                  ← Dashboard top bar (user avatar, notifications)
│   │   │   ├── MobileNav.tsx                        ← Hamburger menu for mobile
│   │   │   └── Providers.tsx                        ← Context providers wrapper
│   │   ├── ui/                                      ← shadcn/ui (auto-generated, don't edit)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── label.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── accordion.tsx
│   │   │   └── tooltip.tsx
│   │   └── shared/
│   │       ├── PageHeader.tsx                       ← Page title + breadcrumb banner
│   │       ├── SectionTitle.tsx                     ← Section heading + subtitle
│   │       ├── EmptyState.tsx                       ← Illustration + message for empty lists
│   │       ├── LoadingSpinner.tsx                   ← Full-page / inline spinner
│   │       ├── OTPInput.tsx                         ← 6-box OTP input component
│   │       ├── RangeSlider.tsx                      ← Price range slider (min/max)
│   │       ├── ImageUploader.tsx                    ← Drag-and-drop image upload UI (mock)
│   │       ├── ConfirmDialog.tsx                    ← "Are you sure?" modal
│   │       ├── Breadcrumb.tsx                       ← Breadcrumb navigation trail
│   │       └── PriceInWords.tsx                     ← Converts number to Indian word format
│   │
│   ├── lib/
│   │   ├── utils.ts                                 ← cn(), formatPrice(), formatDate() helpers
│   │   └── constants.ts                             ← App name, logo path, social links
│   │
│   ├── config/
│   │   ├── routes.ts                                ← All route path constants
│   │   └── navigation.ts                            ← Header + sidebar nav link definitions
│   │
│   └── styles/
│       ├── globals.css
│       ├── tokens.css                               ← CSS custom properties / design tokens
│       └── antd-overrides.css
│
├── .env.local                                       ← NEXT_PUBLIC_SITE_URL only (no backend URL needed for mock phase)
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── components.json                                  ← shadcn/ui config
├── tsconfig.json
└── package.json
```

---

## Mock Data Strategy

| Mock File | Used By | Data Shape |
|---|---|---|
| `propertiesList.mock.ts` | Listing page, Home page, Owner page | `Property[]` — 20+ items covering Residential & Commercial |
| `propertyDetail.mock.ts` | `[permalink]` detail page | `PropertyDetail` — full object with images, amenities, key facilities, pricing |
| `featuredProperties.mock.ts` | Featured page, Home hero | `Property[]` — 6 items with `is_featured: true` |
| `builderProperties.mock.ts` | Builders page | `{ builder: BuilderProfile, properties: Property[] }[]` |
| `myProperties.mock.ts` | Dashboard properties pages | `Property[]` — mock logged-in user's listings with status/expiry |
| `activeListings.mock.ts` | Dashboard active tab | `Property[]` filtered by `status: active` |
| `expiredListings.mock.ts` | Dashboard expired tab | `Property[]` filtered by `status: expired` |
| `blogList.mock.ts` | Blog listing page | `BlogPost[]` — 10 items with title, slug, excerpt, date, image |
| `blogDetail.mock.ts` | Blog detail page | `BlogPost` — single post with full HTML body content |
| `careersList.mock.ts` | Careers listing | `Career[]` — 5–8 open positions |
| `careerDetail.mock.ts` | Career detail page | `Career` — single job with full description |
| `projectsList.mock.ts` | Projects page | `Project[]` — 10 builder projects |
| `stats.mock.ts` | Dashboard overview | `{ totalViews, totalLeads, activeListings, creditBalance }` |
| `leads.mock.ts` | Dashboard leads page | `Lead[]` — 15 enquiry records with name, phone, property |
| `packages.mock.ts` | Packages page | `Package[]` — 3 plans (Basic, Standard, Premium) |
| `invoices.mock.ts` | Invoices page, Invoice detail | `Invoice[]` — purchase history items |
| `credits.mock.ts` | Credits page | `{ balance, usageLog: CreditLog[] }` |
| `faqs.mock.ts` | FAQs page | `FAQ[]` — 15 Q&A pairs |
| `pricing.mock.ts` | Pricing page | `PricingPlan[]` — 3 tiers with feature comparison |
| `user.mock.ts` | Profile, Settings, Dashboard header | `User` — mock logged-in user object |
| `wishlist.mock.ts` | Wishlist page | `Property[]` — 5 saved properties |

---

## File Count Summary

| Area | Files |
|---|---|
| `public/` (static assets) | ~25 |
| `src/mockData/` (all mock files) | 21 |
| `src/app/` (routing pages) | 45 |
| `src/modules/` (components + form steps + constants) | ~75 |
| `src/components/` (global + ui + shared) | ~35 |
| `src/lib/` + `src/config/` + `src/styles/` | 8 |
| Root config files | 7 |
| **Total** | **~216 files** |
