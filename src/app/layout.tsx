import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import CartHydration from "@/components/cart/CartHydration";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CarpenterBullet — Premium Wood Craft",
    template: "%s | CarpenterBullet",
  },
  description:
    "Discover premium handcrafted wooden furniture and decor at CarpenterBullet. Quality craftsmanship delivered to your door.",
  keywords: ["furniture", "wooden", "handcrafted", "carpenter", "decor", "India"],
  openGraph: {
    siteName: "CarpenterBullet",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body bg-cream text-charcoal antialiased">
        <CartHydration />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#2F2F2F",
              color: "#F5F1E8",
              fontFamily: "var(--font-body)",
              borderRadius: "8px",
            },
          }}
        />
      </body>
    </html>
  );
}
