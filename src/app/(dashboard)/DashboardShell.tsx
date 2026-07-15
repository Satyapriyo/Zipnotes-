'use client';

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
    Plus,
    LayoutGrid,
    Menu,
    X,
    Moon,
    Sun,
    Calendar,
    CalendarDays,
    Target
} from "lucide-react";

// Assuming you saved the Logo component as per your new architecture
import { Logo } from "@/components/zn/Logo";

const NAV = [
    { title: "All notes", href: "/notes", icon: LayoutGrid, match: ["/notes"] },
    { title: "Today", href: "/tasks/today", icon: Calendar, match: ["/tasks/today"] },
    { title: "This week", href: "/tasks/weekly", icon: CalendarDays, match: ["/tasks/weekly"] },
    { title: "Long-term", href: "/tasks/long-term", icon: Target, match: ["/tasks/long-term"] },
] as const;

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-paper-2/40 text-ink md:flex-row">
            {/* Mobile top bar */}
            <header className="z-40 flex h-14 shrink-0 items-center justify-between border-b border-rule bg-paper px-4 md:hidden">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setOpen(true)}
                        className="rounded-md p-1.5 text-ink-soft hover:bg-paper-2"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <Logo small />
                </div>
                <UserPill mobile />
            </header>

            {/* Mobile Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-rule bg-paper transition-transform duration-300 ease-out md:relative md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-14 shrink-0 items-center justify-between border-b border-rule px-4">
                    <Link href="/" onClick={() => setOpen(false)} className="hover:opacity-80 transition-opacity">
                        <Logo />
                    </Link>
                    <button
                        onClick={() => setOpen(false)}
                        className="rounded-md p-1.5 text-ink-muted hover:bg-paper-2 md:hidden"
                        aria-label="Close menu"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-3 shrink-0">
                    <Link
                        href="/notes/new"
                        onClick={() => setOpen(false)}
                        className="group flex w-full items-center justify-between gap-2 rounded-xl bg-ink px-3.5 py-2.5 text-[13px] font-medium text-paper transition-all hover:bg-ink-soft"
                    >
                        <span className="inline-flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            New note
                        </span>
                        <span className="rounded border border-paper/20 px-1.5 py-px font-mono text-[10px] text-paper/70">
                            N
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-0.5 overflow-y-auto px-2">
                    <div className="px-2.5 pt-2 pb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
                        workspace
                    </div>
                    {NAV.map((item) => {
                        const Icon = item.icon;
                        // Exact match for /notes, otherwise prefix match
                        const active =
                            (pathname === "/notes" && item.href === "/notes") ||
                            (item.href !== "/notes" && pathname?.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`group flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] transition-all ${active
                                    ? "bg-paper-2 text-ink"
                                    : "text-ink-soft hover:bg-paper-2/60 hover:text-ink"
                                    }`}
                            >
                                <span
                                    className={`grid h-7 w-7 place-items-center rounded-md transition-colors ${active
                                        ? "bg-paper text-ember shadow-[0_1px_0_0_rgba(0,0,0,0.04)] ring-1 ring-rule"
                                        : "text-ink-muted group-hover:text-ink"
                                        }`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                </span>
                                <span className="flex-1 truncate">{item.title}</span>
                                {active && <span className="h-1 w-1 rounded-full bg-ember" />}
                            </Link>
                        );
                    })}

                    {/* Theme Toggle mapped to new nav style */}
                    <div className="px-2.5 pt-6 pb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
                        preferences
                    </div>
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] text-ink-soft transition-all hover:bg-paper-2/60 hover:text-ink"
                        >
                            <span className="grid h-7 w-7 place-items-center rounded-md text-ink-muted transition-colors group-hover:text-ink">
                                {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                            </span>
                            <span className="flex-1 truncate text-left">
                                {theme === "dark" ? "Light mode" : "Dark mode"}
                            </span>
                        </button>
                    )}
                </nav>

                {/* Footer Card */}
                <div className="m-3 mt-2 rounded-2xl border border-rule bg-paper-2/60 p-4 shrink-0">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                            today · focus
                        </span>
                        <span className="font-mono text-[10px] text-ember">on track</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-paper-3">
                        <div className="h-full w-[72%] rounded-full bg-ember" />
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
                        You&apos;ve written 1,240 words today. Quiet, steady progress.
                    </p>
                </div>

                {/* User Footer */}
                <div className="border-t border-rule p-3 shrink-0">
                    <UserPill />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="relative flex-1 overflow-y-auto bg-paper md:rounded-tl-2xl md:border-l md:border-t md:border-rule">
                {children}
            </main>
        </div>
    );
}

// User Pill Subcomponent integrating Clerk
function UserPill({ mobile = false }: { mobile?: boolean }) {
    const { user, isLoaded } = useUser();

    return (
        <div className={`flex items-center gap-3 rounded-xl transition-colors ${mobile ? "" : "px-1 py-1 hover:bg-paper-2"}`}>
            <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-paper-3">
                {isLoaded ? (
                    <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                ) : (
                    <div className="h-8 w-8 animate-pulse rounded-full bg-rule" />
                )}
            </div>
            {!mobile && (
                <div className="hidden flex-col md:flex min-w-0">
                    <span className="truncate text-[13px] font-medium leading-tight text-ink max-w-[140px]">
                        {isLoaded && user ? user.firstName || "User" : "Loading..."}
                    </span>
                    <span className="font-mono text-[10px] text-ink-muted">my account</span>
                </div>
            )}
        </div>
    );
}