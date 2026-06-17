"use client";

import { useEffect, useState } from "react";
import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { Loader2, Zap } from "lucide-react";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { useTheme } from "next-themes";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

const SPOTS_TOTAL = 100;
const SPOTS_CLAIMED = 64;

function getClerkAppearance(isDark: boolean) {
    const colors = isDark
        ? {
            background: "#0f172a", // slate-900
            inputBackground: "#1e293b", // slate-800
            text: "#f1f5f9", // slate-100
            textSecondary: "#94a3b8", // slate-400
            cardBorder: "border-slate-800",
            inputBorder: "border-slate-700",
            hoverBg: "hover:bg-slate-800",
        }
        : {
            background: "#ffffff",
            inputBackground: "#f8fafc", // slate-50
            text: "#0f172a", // slate-900
            textSecondary: "#64748b", // slate-500
            cardBorder: "border-slate-200",
            inputBorder: "border-slate-200",
            hoverBg: "hover:bg-slate-50",
        };

    return {
        baseTheme: isDark ? dark : undefined,
        layout: {
            socialButtonsPlacement: "bottom" as const,
            logoPlacement: "none" as const,
        },
        variables: {
            colorPrimary: "#bef264", // lime-300
            colorText: colors.text,
            colorTextSecondary: colors.textSecondary,
            colorBackground: colors.background,
            colorInputBackground: colors.inputBackground,
            colorInputText: colors.text,
            borderRadius: "0.75rem",
            fontFamily: "inherit",
        },
        elements: {
            rootBox: "w-full",
            cardBox: "w-full shadow-none",
            card: `shadow-none border ${colors.cardBorder} rounded-2xl p-6 sm:p-8 w-full`,
            headerTitle: `${display.className} text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"
                }`,
            headerSubtitle: isDark ? "text-slate-400" : "text-slate-500",
            socialButtonsBlockButton: `rounded-xl font-medium border ${colors.inputBorder} ${colors.hoverBg}`,
            socialButtonsBlockButtonText: "font-medium",
            dividerLine: isDark ? "bg-slate-800" : "bg-slate-200",
            dividerText: `${mono.className} text-xs uppercase tracking-wide ${isDark ? "text-slate-500" : "text-slate-400"
                }`,
            formFieldLabel: `font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`,
            formFieldInput: `rounded-xl border ${colors.inputBorder} focus:border-lime-400 focus:ring-2 focus:ring-lime-400/30`,
            formButtonPrimary: `text-sm font-semibold rounded-full normal-case shadow-none py-2.5 ${isDark
                ? "bg-lime-300 hover:bg-lime-200 text-slate-900"
                : "bg-slate-900 hover:bg-slate-800 text-lime-300"
                }`,
            footerActionLink: `font-medium ${isDark ? "text-lime-300 hover:text-lime-200" : "text-slate-900 hover:text-lime-600"
                }`,
            identityPreviewEditButton: isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-500 hover:text-slate-900",
            formFieldAction: isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900",
            footer: "bg-transparent",
        },
    };
}

export default function SignUpPage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Default to light until the theme is resolved on the client, to avoid
    // a flash of mismatched styling on the Clerk widget.
    const isDark = mounted && resolvedTheme === "dark";
    const clerkAppearance = getClerkAppearance(isDark);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            {/* top "loading bar" accent, consistent with the landing page */}
            <div className="h-[3px] w-full bg-gradient-to-r from-lime-400 via-lime-300 to-transparent" />

            <div className="flex flex-1">
                {/* Branded panel — always dark, hidden on small screens */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950 flex-col justify-between p-12">
                    <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl" />

                    <Link href="/" className="relative flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-300">
                            <Zap className="h-4 w-4 text-slate-900" fill="currentColor" />
                        </span>
                        <span className={`${display.className} text-lg font-semibold tracking-tight text-white`}>
                            ZipNotes
                        </span>
                    </Link>

                    <div className="relative max-w-md">
                        <div className={`${mono.className} text-xs text-lime-400 mb-3`}>
                            // welcome
                        </div>
                        <h1 className={`${display.className} text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4 leading-tight`}>
                            Write it down before the meeting starts.
                        </h1>
                        <p className="text-slate-400 leading-relaxed">
                            Create your account and get a notepad that opens instantly — even on
                            the networks that block everything else.
                        </p>
                    </div>

                    <div className="relative max-w-xs">
                        <div className={`${mono.className} flex justify-between text-xs text-slate-400 mb-2`}>
                            <span>{SPOTS_CLAIMED} / {SPOTS_TOTAL} claimed</span>
                            <span>{SPOTS_TOTAL - SPOTS_CLAIMED} left</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-lime-400"
                                style={{ width: `${(SPOTS_CLAIMED / SPOTS_TOTAL) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Sign-up form */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16">
                    <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-lime-300">
                            <Zap className="h-4 w-4 text-lime-300 dark:text-slate-900" fill="currentColor" />
                        </span>
                        <span className={`${display.className} text-lg font-semibold tracking-tight text-slate-900 dark:text-white`}>
                            ZipNotes
                        </span>
                    </Link>

                    <div className="w-full max-w-md">
                        <ClerkLoading>
                            <div className="flex items-center justify-center py-24">
                                <Loader2 className="w-8 h-8 animate-spin text-lime-500" />
                            </div>
                        </ClerkLoading>
                        <ClerkLoaded>
                            <SignUp appearance={clerkAppearance} />
                        </ClerkLoaded>
                    </div>

                    <p className={`${mono.className} lg:hidden mt-10 text-xs text-slate-400 dark:text-slate-500`}>
                        {SPOTS_TOTAL - SPOTS_CLAIMED} of {SPOTS_TOTAL} beta spots left
                    </p>
                </div>
            </div>
        </div>
    );
}