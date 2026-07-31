import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AnalyticsScripts } from "@/components/site/analytics-scripts";
import { GradientBackground } from "@/components/ui/pipo";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Wake & Wyze: Premium Functional Coffee | Sustained Energy & Sharper Focus",
  description:
    "Premium specialty coffee infused with Lion's Mane for sustained energy, sharper focus, and a calmer caffeine experience. 30 servings. ₹1,299. Pre order now.",
  metadataBase: new URL("https://wakeandwyze.com"),
  openGraph: {
    title: "Wake & Wyze: Premium Functional Coffee",
    description:
      "Premium coffee infused with Lion's Mane. Sustained energy, sharper focus, no afternoon crash.",
    type: "website",
    images: ["/images/all-4-sku.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wake & Wyze: Premium Functional Coffee",
    description:
      "Premium coffee infused with Lion's Mane. Sustained energy, sharper focus, no afternoon crash.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="min-h-screen bg-surface text-ink font-sans antialiased">
        {/* Fixed gradient background — sits behind all content. Hero section has
            its own opaque bg-ink so this only shows through on other sections. */}
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 pointer-events-none"
        >
          <GradientBackground className="h-full w-full" />
        </div>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-ink focus:text-surface focus:rounded-lg"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <AnalyticsScripts />
        <Analytics />
      </body>
    </html>
  );
}
