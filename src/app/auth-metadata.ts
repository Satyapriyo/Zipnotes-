// app/sign-in/[[...sign-in]]/metadata.ts
// Import this in your sign-in page.tsx:
//   export { signInMetadata as metadata } from "./metadata";

import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const signInMetadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your ZipNotes account to access your notes.",
  alternates: { canonical: `${siteConfig.domain}/sign-in` },
  // Auth pages should NOT be indexed — they add no value to search results
  // and can confuse crawlers.
  robots: { index: false, follow: false },
};

// ─────────────────────────────────────────────────────────────────────────────
// app/sign-up/[[...sign-up]]/metadata.ts

export const signUpMetadata: Metadata = {
  title: "Get Beta Access",
  description:
    "Create your ZipNotes account. Free beta access — only 100 spots available.",
  alternates: { canonical: `${siteConfig.domain}/sign-up` },
  robots: { index: false, follow: false },
};
