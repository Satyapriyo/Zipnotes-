import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import DashboardShell from "./DashboardShell";

export const metadata: Metadata = createMetadata({
  title: "Dashboard",
  description: "Your ZipNotes workspace — notes, tasks, and cloud sync.",
  noIndex: true,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
