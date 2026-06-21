import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// ─── Viewport (separate from metadata — required in Next.js 15) ───────────────
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

// ─── Root metadata ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://zipnotes.online"),

  title: {
    default: "ZipNotes — Simple Cloud Notes That Work Where Notion Is Blocked",
    template: "%s | ZipNotes",
  },
  description:
    "ZipNotes is a featherweight, cloud-synced notepad built for networks that block Notion and Evernote. No databases, no bloat — open it and write. Free beta, 100 spots.",
  keywords: [
    "note taking app",
    "lightweight notes",
    "Notion alternative",
    "cloud notes",
    "simple notes app",
    "notes app not blocked at work",
    "notes app for corporate networks",
    "Evernote alternative",
    "fast note app",
    "online notepad",
    "free notes app",
    "ZipNotes",
  ],
  authors: [{ name: "ZipNotes", url: "https://zipnotes.online" }],
  creator: "ZipNotes",
  publisher: "ZipNotes",
  applicationName: "ZipNotes",
  category: "productivity",

  alternates: {
    canonical: "https://zipnotes.online",
  },

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zipnotes.online",
    siteName: "ZipNotes",
    title: "ZipNotes — Simple Cloud Notes That Work Where Notion Is Blocked",
    description:
      "Featherweight cloud notes for restricted networks. No databases, no bloat. Free beta access — 100 spots.",
    images: [
      {
        url: "https://zipnotes.online/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZipNotes — lightweight cloud notes that get past IT",
      },
    ],
  },

  // ── Twitter / X ───────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@zipnotesonline",
    creator: "@zipnotesonline",
    title: "ZipNotes — Cloud Notes That Work Where Notion Is Blocked",
    description:
      "Featherweight, cloud-synced notes for networks that block everything else. Free beta.",
    images: ["https://zipnotes.online/og-image.png"],
  },

  // ── Icons — exact filenames from your /public folder ─────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },

  // ── PWA manifest ──────────────────────────────────────────────────────────
  manifest: "/manifest.json",

  // ── Crawler directives ────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// ─── JSON-LD structured data ──────────────────────────────────────────────────
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ZipNotes",
  url: "https://zipnotes.online",
  description:
    "ZipNotes is a featherweight, cloud-synced notepad built for networks that block heavyweight workspace apps.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://zipnotes.online/notes?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ZipNotes",
  url: "https://zipnotes.online",
  description:
    "ZipNotes is a featherweight, cloud-synced notepad built for networks that block Notion and Evernote.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free during beta. Affordable plans after.",
  },
  featureList: [
    "Cloud sync across devices",
    "Works on corporate and restricted networks",
    "Rich text editor with slash commands",
    "Task lists and to-do checkboxes",
    "Lightweight — under 2.4 MB",
  ],
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${mono.variable} h-full antialiased`}
      >
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
          />
        </head>
        <body className="min-h-full flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-right" />
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}