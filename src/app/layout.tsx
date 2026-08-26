import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AnalyticsScripts } from "@/components/site/analytics-scripts";
import { GradientBackground } from "@/components/ui/pipo";
import { CurrencyProvider } from "@/components/currency/currency-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: "variable",
});

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const metadata: Metadata = {
  title: "Wake & Wyze: Premium Functional Coffee | Sustained Energy & Sharper Focus",
  description:
    "Premium instant specialty coffee infused with Lion's Mane for sustained energy, sharper focus, and a calmer caffeine experience. Just add hot water. 30 servings. ₹1,399. Pre order now.",
  metadataBase: new URL("https://wakeandwyze.com"),
  openGraph: {
    title: "Wake & Wyze: Premium Functional Coffee",
    description:
      "Premium instant coffee infused with Lion's Mane. Sustained energy, sharper focus, no afternoon crash.",
    type: "website",
    images: ["/images/all-4-sku.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wake & Wyze: Premium Functional Coffee",
    description:
      "Premium instant coffee infused with Lion's Mane. Sustained energy, sharper focus, no afternoon crash.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        {META_PIXEL_ID && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${META_PIXEL_ID}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
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
        <CurrencyProvider>
          <CartProvider>
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </CurrencyProvider>
        <AnalyticsScripts />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
