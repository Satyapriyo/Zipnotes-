'use client';

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
    Plus, Zap, LayoutGrid, Menu, X, Moon, Sun,
    Calendar, CalendarDays, Target
} from "lucide-react";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, isLoaded } = useUser();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        {
            title: "All Notes",
            href: "/notes",
            icon: LayoutGrid
        },
        {
            title: "Today's Tasks",
            href: "/tasks/today",
            icon: Calendar
        },
        {
            title: "Weekly Tasks",
            href: "/tasks/weekly",
            icon: CalendarDays
        },
        {
            title: "Long-Term Goals",
            href: "/tasks/long-term",
            icon: Target
        },
    ];

    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
    };

    const Logo = () => (
        <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-lime-300 shrink-0">
                <Zap className="w-4 h-4 text-lime-300 dark:text-slate-900" fill="currentColor" />
            </div>
            <span className={cn(display.className, "font-semibold text-lg tracking-tight text-slate-900 dark:text-white")}>
                ZipNotes
            </span>
            <span className={cn(mono.className, "text-[10px] uppercase tracking-wider text-lime-600 dark:text-lime-400 border border-lime-200 dark:border-lime-400/30 rounded-full px-1.5 py-0.5 leading-none")}>
                beta
            </span>
        </div>
    );

    return (
        <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950 selection:bg-lime-200 selection:text-slate-900 dark:selection:bg-lime-400/20 dark:selection:text-lime-100">

            <header className="md:hidden flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 z-40">
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 dark:text-slate-300 mr-1">
                        <Menu className="w-6 h-6" />
                    </Button>
                    <Logo />
                </div>
                <UserButton />
            </header>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>

                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <Link href="/" onClick={handleNavClick} className="hover:opacity-80 transition-opacity overflow-hidden">
                        <Logo />
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-500 shrink-0">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-4 shrink-0">
                    <Link href="/notes/new" onClick={handleNavClick}>
                        <Button
                            className="w-full justify-start gap-2 font-medium shadow-sm bg-slate-900 hover:bg-slate-800 text-lime-300 dark:bg-lime-300 dark:hover:bg-lime-200 dark:text-slate-900"
                            size="sm"
                        >
                            <Plus className="w-4 h-4" />
                            New Note
                        </Button>
                    </Link>
                </div>

                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href) || (pathname === '/notes' && item.href === '/notes');

                        return (
                            <Link key={item.href} href={item.href} onClick={handleNavClick}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 mb-1 transition-colors",
                                        isActive
                                            ? "bg-lime-100/70 dark:bg-lime-400/10 text-slate-900 dark:text-lime-300 font-medium hover:bg-lime-100 dark:hover:bg-lime-400/15"
                                            : "text-slate-600 dark:text-slate-400 font-normal hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                                    )}
                                    size="sm"
                                >
                                    <item.icon className={cn("w-4 h-4", isActive ? "text-lime-600 dark:text-lime-400" : "text-slate-400 dark:text-slate-500")} />
                                    {item.title}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto shrink-0 border-t border-slate-200 dark:border-slate-800">

                    <div className="p-4 pb-2">
                        {mounted && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start gap-3 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                {theme === 'dark' ? (
                                    <>
                                        <Sun className="w-4 h-4 text-amber-500" />
                                        Light Mode
                                    </>
                                ) : (
                                    <>
                                        <Moon className="w-4 h-4 text-lime-600" />
                                        Dark Mode
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    <div className="p-4 pt-2">
                        <div className="flex items-center gap-3 px-2 py-2 w-full hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                            <UserButton />
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">
                                    {isLoaded && user ? user.firstName || 'User' : 'Loading...'}
                                </span>
                                <span className={cn(mono.className, "text-xs text-slate-500 dark:text-slate-400 truncate")}>
                                    my account
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </aside>

            <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 shadow-[-8px_0_15px_-3px_rgba(0,0,0,0.02)] md:rounded-tl-2xl border-l border-slate-200 dark:border-slate-800 relative z-0">
                {children}
            </main>
        </div>
    );
}
