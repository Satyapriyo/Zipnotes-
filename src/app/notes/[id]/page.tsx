'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth, useSession } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichEditor } from '@/components/RichEditor';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

interface Note {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export default function NoteEditorPage() {
    const { userId, isLoaded } = useAuth();
    const { session } = useSession();
    const router = useRouter();
    const params = useParams();
    const noteId = params.id as string;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    const fetchNote = useCallback(async () => {
        if (!userId || !session || !noteId || noteId === 'new') return;

        try {
            const supabase = await createAuthenticatedClient();

            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('id', noteId)
                .eq('user_id', userId)
                .single();

            if (error) throw error;
            if (data) {
                const note = data as Note;
                setTitle(note.title);
                setContent(note.content);
            }
        } catch (error) {
            console.error('Error fetching note:', error);
            router.push('/notes');
        } finally {
            setLoading(false);
        }
    }, [noteId, userId, session, router, createAuthenticatedClient]);

    useEffect(() => {
        if (!isLoaded) return;

        if (noteId === 'new') {
            const timer = setTimeout(() => setLoading(false), 0);
            return () => clearTimeout(timer);
        } else if (userId && session && noteId) {
            const timer = setTimeout(() => {
                fetchNote();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isLoaded, userId, session, noteId, fetchNote]);

    const saveNote = async () => {
        if (!title.trim() && !content.trim()) {
            alert('Please add some content to your note');
            return;
        }

        if (!userId || !session) {
            alert('Authentication failed. Please sign in again.');
            return;
        }

        try {
            setSaving(true);
            const supabase = await createAuthenticatedClient();

            if (noteId === 'new') {
                // Create new note
                const insertData = {
                    user_id: userId,
                    title: title || 'Untitled',
                    content,
                };

                const { data, error } = await supabase
                    .from('notes')
                    .insert(insertData)
                    .select()
                    .single();

                if (error) throw error;
                const result = data as Note;
                router.push(`/notes/${result.id}`);
            } else {
                // Update existing note
                const updateData = {
                    title: title || 'Untitled',
                    content,
                    updated_at: new Date().toISOString(),
                };

                const { error } = await supabase
                    .from('notes')
                    .update(updateData)
                    .eq('id', noteId)
                    .eq('user_id', userId);

                if (error) throw error;
                router.refresh();
            }
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note');
        } finally {
            setSaving(false);
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
        <div className="h-full flex flex-col bg-white">
            {/* Header - Made sticky with a subtle blur, aligned with editor content */}
            <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 max-w-4xl mx-auto w-full">
                    <Button
                        variant="outline"
                        size="icon"
                        className="text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shrink-0"
                        onClick={() => router.push('/notes')}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>

                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Untitled Note"
                        className="text-2xl md:text-3xl font-extrabold text-slate-900 placeholder:text-slate-300 border-none focus-visible:ring-0 h-auto px-0 bg-transparent"
                    />

                    <Button
                        onClick={saveNote}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-2 shrink-0 ml-4"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="hidden sm:inline">Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span className="hidden sm:inline">Save Note</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Editor Container */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto w-full h-full">
                    <RichEditor value={content} onChange={setContent} />
                </div>
            </div>
        </div>
    );
}