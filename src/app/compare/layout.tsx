import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZipNotes vs Notion, Evernote, Obsidian & Apple Notes — Compared",
  description:
    "How ZipNotes compares to Notion, Evernote, Obsidian, and Apple Notes on speed, footprint, price, offline support, and firewall friendliness.",
  openGraph: {
    title: "ZipNotes vs the big note apps — a side-by-side",
    description:
      "Speed, size, price, offline, IT-friendly. See how ZipNotes stacks up against Notion, Evernote, Obsidian, and Apple Notes.",
    url: "/compare",
  },
  alternates: {
    canonical: "/compare",
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}