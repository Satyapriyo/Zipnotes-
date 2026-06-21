
import type { Metadata } from "next";
import ZipNotesLanding from "./ZipNotesLanding"; // adjust path if needed

// ─── Per-page metadata ────────────────────────────────────────────────────────
// This overrides the root layout metadata for the homepage specifically.
export const metadata: Metadata = {
  title: "ZipNotes — Simple Cloud Notes That Work Where Notion Is Blocked",
  description:
    "ZipNotes is the featherweight, cloud-synced notepad for networks that block Notion and Evernote. Open it and start writing in seconds. Free beta — only 100 spots.",
  alternates: {
    canonical: "https://zipnotes.online",
  },
  openGraph: {
    title: "ZipNotes — Simple Cloud Notes That Work Where Notion Is Blocked",
    description:
      "Featherweight cloud notes for restricted networks. No databases, no bloat. Free beta — 100 spots.",
    url: "https://zipnotes.online",
    type: "website",
    images: [
      {
        url: "https://zipnotes.online/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZipNotes — lightweight cloud notes that get past IT",
      },
    ],
  },
};

// ─── FAQ JSON-LD — renders as an accordion directly in Google search results ──
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is ZipNotes really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The first 100 beta testers get full access at no cost. After beta, pricing stays simple and affordable — well below Evernote or Notion.",
      },
    },
    {
      "@type": "Question",
      name: "Why does ZipNotes work on corporate networks that block Notion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Notion is a large platform with file sharing and embeds that trip corporate security filters. ZipNotes is a simple, lightweight text app — under 2.4 MB — that rarely gets flagged by firewalls or content filters.",
      },
    },
    {
      "@type": "Question",
      name: "Are my notes synced to the cloud?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — your notes are saved and synced to the cloud automatically, accessible from any device with an internet connection.",
      },
    },
    {
      "@type": "Question",
      name: "How many beta spots are left?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ZipNotes is limited to 100 total beta spots to ensure server stability during testing. Sign up early to secure yours.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ZipNotesLanding />
    </>
  );
}