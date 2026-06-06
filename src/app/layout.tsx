import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ZipNotes | Simple, Affordable Cloud Notes",
    template: "%s | ZipNotes", // Automatically adds "| ZipNotes" to other pages
  },
  description: "The secure, lightweight, and clutter-free note-taking app your office will actually allow. Join the free beta today.",
  keywords: ["note taking app", "notion alternative", "minimalist notes", "cloud notes", "office friendly notes"],
  authors: [{ name: "Satyapriyo" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "ZipNotes | Simple, Affordable Cloud Notes",
    description: "Secure, lightweight, and clutter-free cloud notes.",
    siteName: "ZipNotes",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg", // You'll need to add an image to your public folder!
        width: 1200,
        height: 630,
        alt: "ZipNotes Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZipNotes | Simple, Affordable Cloud Notes",
    description: "The note-taking app your office will actually allow.",
    creator: "@yourtwitterhandle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
