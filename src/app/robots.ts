// app/robots.ts
// Next.js serves this automatically at /robots.txt
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block all authenticated/private routes from being crawled.
        // Google can't see behind Clerk auth anyway, but being explicit
        // saves crawl budget and prevents accidental indexing.
        disallow: [
          "/notes",
          "/notes/",
          "/tasks",
          "/tasks/",
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${siteConfig.domain}/sitemap.xml`,
    host: siteConfig.domain,
  };
}
