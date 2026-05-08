# Houselink360 — Next.js Style & Design Guide

This document outlines the design tokens, theme colors, typography, hover animations, and UI component styling conventions for the Houselink360 Next.js frontend project. It is strictly derived from the `tailwind.config.ts`, `components.json`, and project architecture.

## 🎨 1. Theme Colors

The project uses a custom color palette defined in `tailwind.config.ts`, extending Tailwind's default colors. 

### Brand Colors (Primary)
The primary brand color is a deep blue, used for primary actions, active states, and highlights. All colors are defined as CSS variables in `src/styles/globals.css`.
- **Brand Default:** `bg-brand` / `text-brand` (`#153e75` / `var(--brand)`)
- **Hover States:** `bg-brand-700` (`#26466d` / `var(--brand-700)`)
- **Light Accents:** `bg-brand-50` (`#f0f4f8` / `var(--brand-50)`)

### Surface Colors (Backgrounds)
Used for page backgrounds, cards, and distinct sections to create visual hierarchy.
- **Surface (Default):** `bg-surface` (`#ffffff` - White) - Used for primary cards and content areas.
- **Surface Secondary:** `bg-surface-secondary` (`#f8fafc` - Slate 50) - Used for app backgrounds or offset sections.
- **Surface Tertiary:** `bg-surface-tertiary` (`#f1f5f9` - Slate 100) - Used for borders, dividers, or muted backgrounds.

### Ink Colors (Typography)
- **Ink (Default):** `text-ink` (`#0f172a` - Slate 900) - Primary headings and strong text.
- **Ink Secondary:** `text-ink-secondary` (`#475569` - Slate 600) - Body copy and paragraphs.
- **Ink Muted:** `text-ink-muted` (`#94a3b8` - Slate 400) - Placeholders, disabled text, and minor labels.
- **Ink Inverted:** `text-ink-inverted` (`#ffffff`) - Text on top of brand or dark backgrounds.

### Status Colors
- **Success:** `text-success` / `bg-success` (`#22c55e`)
- **Warning:** `text-warning` / `bg-warning` (`#f59e0b`)
- **Danger/Error:** `text-danger` / `bg-danger` (`#ef4444`)
- **Info:** `text-info` / `bg-info` (`#3b82f6`)

---

## 🔤 2. Typography

The project uses **Hanken Grotesk** as the primary sans-serif font.
- **CSS Variable:** `--font-hanken`
- **Tailwind Class:** `font-sans`

*Best Practice:* Always rely on Tailwind's default typography scale (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, etc.) paired with `font-sans`. Use `font-medium` or `font-bold` for emphasis.

---

## 🔲 3. Shapes & Border Radius

The project embraces a modern, soft-rounded aesthetic for its main components.
- **Standard UI Elements (Buttons, Inputs):** Inherit shadcn's default radius (typically `rounded-md` or `rounded-lg` per `components.json` 'slate' theme defaults).
- **Cards & Modals:** Use `rounded-2xl` (1rem / 16px) or `rounded-3xl` (1.5rem / 24px) for a softer, premium feel.

---

## ✨ 4. Shadows & Elevation

Custom shadows are defined to give depth to property cards and UI elements.

- **`shadow-card`**: The default shadow for property cards and widgets. Soft and unobtrusive.
- **`shadow-card-hover`**: An elevated shadow for hover states.
  - *Usage:* `hover:shadow-card-hover`
- **`shadow-card-brand`**: A special shadow with a subtle orange/brand tint.
  - *Usage:* Perfect for "Featured" property cards or primary call-to-action cards.

---

## 🚀 5. Animations & Hover Effects

### Custom Animations (`tailwind.config.ts`)
- **Fade In (`animate-fade-in`)**: Fades in and slides up by 8px. Excellent for page loads, modal reveals, or list items appearing. 
  - *Duration:* 0.3s ease-out.
- **Slide In (`animate-slide-in`)**: Slides in from the left (-100%). Great for sidebars or mobile menus.
  - *Duration:* 0.25s ease-out.
- **Shimmer (`animate-shimmer`)**: Infinite loading gradient. Use this exclusively for Skeleton loading states (e.g., `src/components/ui/skeleton.tsx`).

### Standard Hover Effects to Follow
1. **Buttons:**
   - Always include a transition: `transition-colors duration-200`.
   - Primary: `hover:bg-brand-700`.
   - Secondary/Ghost: `hover:bg-surface-secondary text-ink`.
2. **Property Cards (`PropertyCard.tsx`):**
   - Implement a lift effect: `transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover`.
3. **Interactive Icons/Links:**
   - Text links should change from `text-ink-secondary` to `text-brand` on hover.

---

## 🧩 6. UI Component Conventions (shadcn/ui)

The project leverages `shadcn/ui` with the **slate** base color scheme.

- **Imports:** Always import UI components from `@/components/ui/...`
- **Styling Overrides:** Use the `cn()` utility from `@/lib/utils.ts` to merge Tailwind classes cleanly without conflicts.
  ```tsx
  import { cn } from "@/lib/utils"
  
  export function PropertyCard({ className, children }) {
    return (
      <div className={cn("bg-surface shadow-card rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover", className)}>
        {children}
      </div>
    )
  }
  ```
- **Form Elements:** Use the `shadcn` input, select, and checkbox components. They will naturally inherit the `slate` border colors and `brand` focus rings if configured correctly.
- **Layouts:** Use `flex` and `grid` predominantly. E.g., `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for `PropertyGrid.tsx`.

---

## 📋 7. Summary Checklist for Developers

When building new components, ensure you follow these rules:
1. [ ] **Backgrounds:** Am I using `bg-surface` for cards instead of hardcoding `#fff`?
2. [ ] **Typography:** Is the text color using `text-ink` or `text-ink-secondary` instead of black/gray?
3. [ ] **Buttons:** Do my primary buttons use `bg-brand` and `hover:bg-brand-700`?
4. [ ] **Cards:** Did I apply `hover:-translate-y-1 hover:shadow-card-hover` to interactive cards?
5. [ ] **Mounting:** Is the component using the `animate-fade-in` utility when mounting?
