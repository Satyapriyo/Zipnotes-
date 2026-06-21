// app/sitemap.ts
// Next.js serves this automatically at /sitemap.xml
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

const base = siteConfig.domain;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Marketing / public pages
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/sign-in`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/sign-up`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },

    // NOTE: authenticated pages (/notes, /tasks/*) should NOT be in the sitemap
    // — they are behind Clerk auth, cannot be indexed by Google, and including
    // them wastes crawl budget. robots.ts disallows them too.
  ];
}
