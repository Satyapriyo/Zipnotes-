"use client";

import { useEffect, useState } from "react";
import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/zn/Logo";

function getClerkAppearance(isDark: boolean) {
    return {
        baseTheme: isDark ? dark : undefined,
        layout: {
            socialButtonsPlacement: "bottom" as const,
            logoPlacement: "none" as const,
        },
        variables: {
            colorPrimary: isDark ? "#f97316" : "#f97316", // Ember
            colorBackground: "transparent",
            colorInputBackground: "transparent",
            colorText: "inherit",
            colorTextSecondary: "inherit",
            borderRadius: "0.75rem",
            fontFamily: "inherit",
        },
        elements: {
            rootBox: "w-full",
            cardBox: "w-full shadow-none",
            // Strip Clerk's card to blend naturally with our background
            card: "shadow-none border-none bg-transparent p-0 w-full",
            // Hide Clerk's internal header since we provide our own layout
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton:
                "inline-flex w-full items-center justify-center gap-2 rounded-full border border-rule bg-paper px-5 py-3.5 text-[13px] font-medium text-ink-soft transition-colors hover:border-ink/30 hover:bg-paper-2 hover:text-ink",
            socialButtonsBlockButtonText: "font-medium",
            dividerLine: "bg-rule",
            dividerText: "font-mono text-[10px] uppercase tracking-wider text-ink-muted",
            formFieldLabel:
                "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted",
            formFieldInput:
                "w-full rounded-xl border border-rule bg-paper px-4 py-3 text-[14px] text-ink placeholder:text-ink-muted/70 outline-none transition-all focus:border-ember focus:ring-2 focus:ring-ember/15",
            formButtonPrimary:
                "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-[14px] font-medium text-paper transition-all hover:translate-y-[-1px] hover:bg-ink-soft",
            identityPreviewEditButton: "text-ink-muted hover:text-ink",
            formFieldAction: "text-ink-soft hover:text-ink",
            footer: "bg-transparent px-0 pb-0 pt-6",
            footerActionText: "text-[13px] text-ink-soft",
            footerActionLink:
                "text-[13px] text-ink underline decoration-ember decoration-1 underline-offset-4 hover:text-ember font-normal",
        },
    };
}

export default function SignInPage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isDark = mounted && resolvedTheme === "dark";
    const clerkAppearance = getClerkAppearance(isDark);

    return (
        <div className="grain min-h-screen bg-paper text-ink">
            <div className="grain-overlay" />

            {/* Header */}
            <header className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                    <Logo small />
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted transition-colors hover:text-ink"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        back home
                    </Link>
                </div>
            </header>

            {/* Main Layout */}
            <main className="mx-auto grid max-w-5xl gap-12 px-4 pb-16 pt-8 sm:px-6 md:grid-cols-2 md:gap-16 md:pt-16">

                {/* Left Side: Brand messaging */}
                <aside className="hidden md:block">
                    <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                        01 / welcome back
                    </div>
                    <h2 className="mt-3 font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.03em]">
                        One page. <span className="font-editorial italic">Type.</span>
                        <br />
                        It saves itself.
                    </h2>
                    <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                        ZipNotes is a tiny, cloud-synced notepad. No workspaces. No databases.
                        Nothing that needs setting up.
                    </p>

                    <div className="mt-10 rounded-2xl border border-rule bg-paper-2/60 p-5 backdrop-blur-sm">
                        <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                            what you get
                        </div>
                        <ul className="space-y-2.5 text-[13px] text-ink-soft">
                            {[
                                "Unlimited notes, synced across devices",
                                "Opens in under half a second",
                                "Free forever for the core notepad",
                                "Plain text, no lock-in",
                            ].map((l) => (
                                <li key={l} className="flex gap-2">
                                    <span className="text-ember">+</span>
                                    {l}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Right Side: Clerk Authentication form */}
                <section className="fade-up w-full max-w-md">
                    {/* Mobile Eyebrow (Hidden on desktop) */}
                    <div className="md:hidden">
                        <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                            01 / welcome back
                        </div>
                    </div>

                    <h1 className="mt-2 font-display text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
                        Sign in
                    </h1>
                    <p className="mt-2 text-[14px] text-ink-soft">
                        One page, all your notes. Pick up where you left off.
                    </p>

                    <div className="mt-8">
                        <ClerkLoading>
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-ink-muted/50" />
                            </div>
                        </ClerkLoading>
                        <ClerkLoaded>
                            <SignIn appearance={clerkAppearance} routing="hash" />
                        </ClerkLoaded>
                    </div>
                </section>
            </main>
        </div>
    );
}