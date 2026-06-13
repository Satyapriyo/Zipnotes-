'use client';

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Plus, BookOpen, LayoutGrid, Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

// 1. Add these to your lucide-react imports:
import { Calendar, CalendarDays, Target } from "lucide-react";
const font = Inter({ subsets: ["latin"] });


export default function NotesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, isLoaded } = useUser();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Prevent hydration mismatch for the theme toggle
    useEffect(() => {
        setMounted(true);
    }, []);


    // 2. Update your navItems array:
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
    // Close mobile menu when a navigation item is clicked
    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className={cn("h-screen flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950 selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900/50 dark:selection:text-indigo-100", font.className)}>

            {/* Mobile Header (Visible only on small screens) */}
            <header className="md:hidden flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 z-40">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 dark:text-slate-300">
                        <Menu className="w-6 h-6" />
                    </Button>
                    <div className="bg-indigo-600 p-1.5 rounded-lg ml-1">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">ZipNotes</span>
                </div>
                <UserButton />
            </header>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}


            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-white dark:bg-[#0B1120] shadow-[-8px_0_15px_-3px_rgba(0,0,0,0.02)] md:rounded-tl-2xl border-l border-slate-200 dark:border-slate-800 relative z-0">
                {children}
            </main>
        </div>
    );
}