import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <Link href="/notes" className="flex items-center gap-2 font-bold text-lg">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                        <span>ZipNotes</span>
                    </Link>
                </div>

                {/* New Note Button */}
                <div className="p-4 border-b border-gray-200">
                    <Link href="/notes/new">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2">
                            <Plus className="w-4 h-4" />
                            New Note
                        </Button>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <Link
                        href="/notes"
                        className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                    >
                        All Notes
                    </Link>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-200 flex items-center justify-center">
                    <UserButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50 overflow-auto">
                {children}
            </main>
        </div>
    );
}
