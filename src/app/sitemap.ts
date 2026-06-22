import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

const base = siteConfig.domain;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
