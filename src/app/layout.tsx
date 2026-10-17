import type { Metadata } from "next";
import "./globals.css";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

export const metadata: Metadata = {
  title: "Tricity RealtyOS | Real Estate CRM & Sales OS for Chandigarh, Mohali, Zirakpur & Panchkula",
  description:
    "The leading lead-to-site-visit and property sales management SaaS for builders, property dealers, and sales teams across Chandigarh, Mohali, Zirakpur, Panchkula, and New Chandigarh.",
  keywords: [
    "Tricity Real Estate CRM",
    "Mohali Property Lead Management",
    "Zirakpur Flat Sales Software",
    "Chandigarh Real Estate CRM",
    "Site Visit Management Software India",
    "Real Estate WhatsApp Automation",
    "Property Inventory Matrix SaaS",
  ],
  authors: [{ name: "Tricity RealtyOS Team" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Tricity RealtyOS — Real Estate Sales & CRM Platform",
    description: "The complete lead-to-site-visit and property inventory sales platform for Tricity real estate businesses.",
    url: "https://tricityrealtyos.com",
    siteName: "Tricity RealtyOS",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Tricity RealtyOS",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "4999",
                priceCurrency: "INR",
              },
              areaServed: ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "New Chandigarh"],
              description: "Commercial B2B SaaS platform for real estate lead management, inventory hold control, and site visit scheduling in the Tricity region.",
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
