'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth, useSession } from '@clerk/nextjs';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Loader2, Trash2, BookOpen, Plus, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';
const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

interface Note {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export default function NotesPage() {
    const { userId, isLoaded } = useAuth();
    const { session } = useSession();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    // NEW: State to track which note is currently selected for deletion
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

    const createAuthenticatedClient = useCallback(async () => {
        const supabaseToken = await session?.getToken({ template: 'supabase' });

        return createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${supabaseToken}`,
                    },
                },
            }
        );
    }, [session]);

    const fetchNotes = useCallback(async () => {
        if (!userId || !session) return;

        try {
            setLoading(true);
            const supabase = await createAuthenticatedClient();

            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setNotes(data || []);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    }, [userId, session, createAuthenticatedClient]);

    useEffect(() => {
        if (isLoaded && userId && session) {
            const timer = setTimeout(() => {
                fetchNotes();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isLoaded, userId, session, fetchNotes]);

    const deleteNote = async (id: string) => {
        if (!userId || !session) return;

        try {
            const supabase = await createAuthenticatedClient();

            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
            setNotes(notes.filter(note => note.id !== id));
        } catch (error) {
            console.error('Error deleting note:', error);
        } finally {
            // Always clear the modal state after the operation finishes
            setNoteToDelete(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-lime-500 dark:text-lime-400" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto relative">
            {/* Header section styled to match the new theme */}
            <div className="mb-10">
                <h1 className={cn("text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white mb-3", display.className)}>Your Notes</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Manage and organize all your notes in one place.</p>
            </div>

            {notes.length === 0 ? (
                // Premium empty state design
                <div className="text-center py-24 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-16 h-16 bg-lime-100 dark:bg-lime-400/10 text-lime-600 dark:text-lime-300 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className={cn("text-xl font-semibold text-slate-900 dark:text-white mb-2", display.className)}>No notes yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">Capture your first thought. Create a note to get started.</p>
                    <Link href="/notes/new" className="inline-block">
                        <Button className="bg-slate-900 hover:bg-slate-800 text-lime-300 dark:bg-lime-300 dark:hover:bg-lime-200 dark:text-slate-900 px-8 h-12 text-base rounded-xl shadow-sm gap-2 font-medium">
                            <Plus className="w-5 h-5" />
                            Create Note
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => {
                        // Strip HTML tags and common entities for a clean plain-text preview
                        const cleanPreview = note.content
                            ? note.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')
                            : 'No content yet';

                        return (
                            <Link key={note.id} href={`/notes/${note.id}`}>
                                <Card className="p-6 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-lime-300 dark:hover:border-lime-400/50 hover:shadow-md transition-all cursor-pointer h-full flex flex-col group">
                                    <h3 className={cn("text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-lime-600 dark:group-hover:text-lime-300 transition-colors", display.className)}>
                                        {note.title || 'Untitled'}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 flex-1 mb-6 leading-relaxed">
                                        {cleanPreview}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <span className={cn("text-xs text-slate-400 dark:text-slate-500", mono.className)}>
                                            {new Date(note.updated_at).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // NEW: Open the modal by setting the ID instead of window.confirm
                                                setNoteToDelete(note.id);
                                            }}
                                            className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-md transition-colors"
                                            aria-label="Delete note"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* NEW: Custom Delete Confirmation Modal */}
            {noteToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4">
                            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className={cn("text-xl font-semibold text-slate-900 dark:text-white mb-2", display.className)}>
                            Delete this note?
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            This action cannot be undone. This will permanently delete your note from our servers.
                        </p>
                        <div className="flex items-center gap-3 w-full">
                            <Button
                                variant="outline"
                                className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                onClick={() => setNoteToDelete(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => deleteNote(noteToDelete)}
                            >
                                Delete Note
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}