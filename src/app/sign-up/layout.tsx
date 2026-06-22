import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Get Beta Access",
  description:
    "Create your ZipNotes account. Free beta access — only 100 spots available.",
  path: "/sign-up",
  noIndex: true,
});

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
