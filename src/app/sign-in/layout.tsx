import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Sign In",
  description: "Sign in to your ZipNotes account to access your notes.",
  path: "/sign-in",
  noIndex: true,
});

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
