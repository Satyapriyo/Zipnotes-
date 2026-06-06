'use client';

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, BookOpen, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, isLoaded } = useUser();

    // Define navigation items here for easy expansion later
    const navItems = [
        {
            title: "All Notes",
            href: "/notes",
            icon: LayoutGrid
        },
    ];

    return (
        <div className="h-screen flex overflow-hidden bg-background">
            {/* Sidebar */}
            <aside className="w-64 bg-muted/30 border-r border-border flex flex-col transition-all">

                {/* Header / App Name */}
                <div className="h-14 flex items-center px-4 border-b border-border">
                    <Link href="/notes" className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
                        <div className="bg-primary/10 p-1.5 rounded-md">
                            <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-lg tracking-tight">ZipNotes</span>
                    </Link>
                </div>

                {/* New Note Action */}
                <div className="p-4">
                    <Link href="/notes/new">
                        <Button className="w-full justify-start gap-2" size="sm">
                            <Plus className="w-4 h-4" />
                            New Note
                        </Button>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-2 mb-1",
                                        isActive ? "font-medium text-foreground" : "font-normal text-muted-foreground"
                                    )}
                                    size="sm"
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.title}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-2 py-1.5 w-full hover:bg-accent rounded-md transition-colors">
                        <UserButton />
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">
                                {isLoaded && user ? user.firstName || 'User' : 'Loading...'}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                                My Account
                            </span>
                        </div>
                    </div>
                </div>

            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    );
}