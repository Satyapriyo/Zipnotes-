import { createMetadata, faqSchema, siteConfig } from "@/lib/seo";
import ZipNotesLanding from "./ZipNotesLanding";

export const metadata = createMetadata({
  title: siteConfig.title,
  description:
    "ZipNotes is the featherweight, cloud-synced notepad for networks that block Notion and Evernote. Open it and start writing in seconds. Free beta — only 100 spots.",
  path: "/",
});

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
