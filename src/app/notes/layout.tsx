'use client';

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, BookOpen, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const font = Inter({ subsets: ["latin"] });

export default function NotesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, isLoaded } = useUser();

    const navItems = [
        {
            title: "All Notes",
            href: "/notes",
            icon: LayoutGrid
        },
    ];

    return (
        <div className={cn("h-screen flex overflow-hidden bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900", font.className)}>
            {/* Sidebar */}
            <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col transition-all">

                {/* Header / App Name - Perfectly matched to Landing Page */}
                <div className="h-16 flex items-center px-4 border-b border-slate-200">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>

                        <span className="font-bold text-xl tracking-tight text-slate-900">ZipNotes</span>
                    </Link>
                </div>

                {/* New Note Action */}
                <div className="p-4">
                    <Link href="/notes/new">
                        <Button className="w-full justify-start gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" size="sm">
                            <Plus className="w-4 h-4" />
                            New Note
                        </Button>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 mb-1",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100 hover:text-indigo-800"
                                            : "text-slate-600 font-normal hover:bg-slate-100 hover:text-slate-900"
                                    )}
                                    size="sm"
                                >
                                    <item.icon className={cn("w-4 h-4", isActive ? "text-indigo-600" : "text-slate-400")} />
                                    {item.title}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 px-2 py-2 w-full hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                        <UserButton />
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-slate-900 truncate">
                                {isLoaded && user ? user.firstName || 'User' : 'Loading...'}
                            </span>
                            <span className="text-xs text-slate-500 truncate">
                                My Account
                            </span>
                        </div>
                    </div>
                </div>

            </aside>

            {/* Main Content - Made pure white to contrast with the slate sidebar */}
            <main className="flex-1 overflow-y-auto bg-white shadow-[-8px_0_15px_-3px_rgba(0,0,0,0.02)]">
                {children}
            </main>
        </div>
    );
}