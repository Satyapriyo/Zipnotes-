'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface Note {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export default function NotesPage() {
    const { userId, isLoaded } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotes = useCallback(async () => {
        if (!userId || !supabase) return;

        try {
            setLoading(true);
            const { data, error } = await supabase!
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
    }, [userId]);

    useEffect(() => {
        if (isLoaded && userId) {
            const timer = setTimeout(() => {
                fetchNotes();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isLoaded, userId, fetchNotes]);



    const deleteNote = async (id: string) => {
        if (!supabase || !userId) return;

        try {
            const { error } = await (supabase as any)
                .from('notes')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
            setNotes(notes.filter(note => note.id !== id));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Notes</h1>
                <p className="text-gray-600">Manage and organize all your notes in one place</p>
            </div>

            {notes.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-500 mb-4">No notes yet. Create your first one!</p>
                    <Link href="/notes/new" className="inline-block">
                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            Create Note
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <Link key={note.id} href={`/notes/${note.id}`}>
                            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {note.title || 'Untitled'}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3 flex-1 mb-4">
                                    {note.content || 'No content yet'}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>
                                        {new Date(note.updated_at).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            deleteNote(note.id);
                                        }}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
