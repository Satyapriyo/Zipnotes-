'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth, useSession } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
// import { RichEditor } from "@/components/RichEditor"
import { Loader2, Save, ArrowLeft, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";
import { NotionStyleRichEditor } from '@/components/NotionStyleRichEditor';




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
                setTitle(note.title || '');
                setContent(note.content || '');
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
            toast('Please add some content to your note');
            return;
        }

        if (!userId || !session) {
            toast('Authentication failed. Please sign in again.');
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
                toast("Saved successfully.");
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
                toast("Updated successfully.");
            }
        } catch (error) {
            console.error('Error saving note:', error);
            toast('Failed to save note');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-ink-muted" />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-paper">
            <header className="sticky top-0 z-10 border-b border-rule bg-paper/85 backdrop-blur-xl">
                <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
                    <button onClick={() => router.push('/notes')} className="grid h-9 w-9 place-items-center rounded-lg border border-rule bg-paper text-ink-soft">
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Untitled note"
                        className="flex-1 bg-transparent font-display text-xl font-semibold text-ink outline-none"
                    />
                    <button onClick={saveNote} disabled={saving} className="rounded-full bg-ink px-4 py-2 text-[12px] text-paper">
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </header>
            <div className="flex-1 overflow-auto">
                <div className="mx-auto w-full max-w-4xl px-4 pt-8 pb-32">
                    <NotionStyleRichEditor value={content} />
                </div>
            </div>
        </div>
    );
}