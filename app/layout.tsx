import { Poppins, Bodoni_Moda } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/cart-context";
import FloatingSocialButtons from "@/components/FloatingSocialButtons";
import { ToastProvider } from "@/context/toast-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { SettingsProvider } from "@/context/SettingsContext";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";

// ========================================
// Fonts (Arshis-Inspired Typography System)
// ========================================

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// ========================================
// Metadata
// ========================================

export const metadata: Metadata = {
  metadataBase: new URL("https://thegirlhose.com"),

  title: {
    default: "the_girl_ho_se",
    template: "%s | the_girl_ho_se",
  },

  description:
    "Discover premium artificial jewellery including necklaces, earrings, bracelets, rings and exclusive collections at the_girl_ho_se.",

  keywords: [
    "Artificial Jewellery",
    "Jewellery",
    "Necklace",
    "Bracelet",
    "Earrings",
    "Rings",
    "Rose Gold Jewellery",
    "Fashion Jewellery",
    "Premium Jewellery",
    "the_girl_ho_se",
  ],

  authors: [
    {
      name: "the_girl_ho_se",
    },
  ],

  creator: "the_girl_ho_se",

  publisher: "the_girl_ho_se",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://thegirlhose.com",
    siteName: "the_girl_ho_se",
    title: "the_girl_ho_se | Premium Artificial Jewelry",
    description:
      "Premium artificial jewellery crafted for every beautiful moment.",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "the_girl_ho_se",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "the_girl_ho_se | Premium Artificial Jewelry",
    description:
      "Premium artificial jewellery crafted for every beautiful moment.",

    images: ["/og-image.jpg"],
  },

  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],

    apple: "/apple-icon.png",

    shortcut: "/favicon.ico",
  },
};

// ========================================
// Viewport
// ========================================

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#FCFAF7",
  width: "device-width",
  initialScale: 1,
};

// ========================================
// Root Layout
// ========================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${bodoniModa.variable}`}
      >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <SettingsProvider>
                  {children}

                  <FloatingSocialButtons />

                  {process.env.NODE_ENV === "production" && (
                    <Analytics />
                  )}
                </SettingsProvider>
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}