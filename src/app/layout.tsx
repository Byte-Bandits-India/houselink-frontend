import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/components/global/Providers";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import Preloader from "@/components/global/Preloader";
import "antd/dist/reset.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Find Your Dream Property`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "property",
    "real estate",
    "buy property",
    "rent property",
    "apartments",
    "villas",
    "commercial",
    "india",
    "houselink360",
  ],
  authors: [{ name: "Houselink360" }],
  creator: "Houselink360",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://houselink360.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: APP_NAME,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${hankenGrotesk.variable} font-sans antialiased`}>
        <Providers>
          <Preloader />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
