'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAuth, useSession } from '@clerk/nextjs';
import Link from 'next/link';
import { Loader2, Trash2, BookOpen, Plus, AlertCircle, Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';
const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

interface Note {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

type SortKey = 'newest' | 'oldest' | 'az' | 'za' | 'longest' | 'shortest';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'newest', label: 'Newest first' },
    { key: 'oldest', label: 'Oldest first' },
    { key: 'az', label: 'A → Z' },
    { key: 'za', label: 'Z → A' },
    { key: 'longest', label: 'Longest' },
    { key: 'shortest', label: 'Shortest' },
];

const LENGTH_FILTERS = [
    { key: 'all', label: 'All', min: 0, max: Infinity },
    { key: 'short', label: 'Short', min: 0, max: 100 },
    { key: 'medium', label: 'Medium', min: 100, max: 500 },
    { key: 'long', label: 'Long', min: 500, max: Infinity },
] as const;
type LengthKey = typeof LENGTH_FILTERS[number]['key'];

/* ─── helpers ─────────────────────────────────────────────── */
function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
}

function wordCount(content: string): number {
    if (!content) return 0;
    return stripHtml(content).split(/\s+/).filter(Boolean).length;
}

function timeAgo(dateStr: string): string {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function highlight(text: string, query: string): React.ReactNode {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
        regex.test(part)
            ? <mark key={i} className="bg-lime-400/25 text-lime-300 rounded-sm px-0.5">{part}</mark>
            : part
    );
}

/* ─── component ───────────────────────────────────────────── */
export default function NotesPage() {
    const { userId, isLoaded } = useAuth();
    const { session } = useSession();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // search + filter state
    const [rawQuery, setRawQuery] = useState('');
    const [query, setQuery] = useState('');        // debounced
    const [sort, setSort] = useState<SortKey>('newest');
    const [length, setLength] = useState<LengthKey>('all');
    const [sortOpen, setSortOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    // debounce search — 120ms feels instant, avoids re-renders on every keystroke
    useEffect(() => {
        const t = setTimeout(() => setQuery(rawQuery.trim().toLowerCase()), 120);
        return () => clearTimeout(t);
    }, [rawQuery]);

    // close sort dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // keyboard shortcut: Cmd/Ctrl+K focuses search
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    /* auth client */
    const createAuthenticatedClient = useCallback(async () => {
        const supabaseToken = await session?.getToken({ template: 'supabase' });
        return createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { global: { headers: { Authorization: `Bearer ${supabaseToken}` } } }
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
        } catch (err) {
            console.error('Error fetching notes:', err);
        } finally {
            setLoading(false);
        }
    }, [userId, session, createAuthenticatedClient]);

    useEffect(() => {
        if (isLoaded && userId && session) {
            const t = setTimeout(fetchNotes, 0);
            return () => clearTimeout(t);
        }
    }, [isLoaded, userId, session, fetchNotes]);

    const deleteNote = async (id: string) => {
        if (!userId || !session) return;
        setDeleting(true);
        try {
            const supabase = await createAuthenticatedClient();
            const { error } = await supabase.from('notes').delete().eq('id', id).eq('user_id', userId);
            if (error) throw error;
            setNotes(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Error deleting note:', err);
        } finally {
            setDeleting(false);
            setNoteToDelete(null);
        }
    };

    /* ── all filtering + sorting in one memo — runs only when deps change ── */
    const filtered = useMemo(() => {
        const lengthFilter = LENGTH_FILTERS.find(f => f.key === length)!;

        let result = notes.filter(note => {
            // search across title + content
            if (query) {
                const titleMatch = note.title?.toLowerCase().includes(query);
                const contentMatch = stripHtml(note.content ?? '').toLowerCase().includes(query);
                if (!titleMatch && !contentMatch) return false;
            }
            // word-count length filter
            const wc = wordCount(note.content);
            return wc >= lengthFilter.min && wc < lengthFilter.max;
        });

        // sort
        result = [...result].sort((a, b) => {
            switch (sort) {
                case 'newest': return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                case 'oldest': return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
                case 'az': return (a.title ?? '').localeCompare(b.title ?? '');
                case 'za': return (b.title ?? '').localeCompare(a.title ?? '');
                case 'longest': return wordCount(b.content) - wordCount(a.content);
                case 'shortest': return wordCount(a.content) - wordCount(b.content);
                default: return 0;
            }
        });

        return result;
    }, [notes, query, sort, length]);

    const activeFilters = (query ? 1 : 0) + (length !== 'all' ? 1 : 0) + (sort !== 'newest' ? 1 : 0);

    /* ── loading ── */
    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-7 h-7 animate-spin text-lime-400" />
                <p className={cn("text-xs text-slate-500", mono.className)}>Loading notes…</p>
            </div>
        </div>
    );

    const sortLabel = SORT_OPTIONS.find(o => o.key === sort)?.label ?? 'Sort';

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">

            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-8 gap-4">
                <div>
                    <p className={cn("text-xs uppercase tracking-[0.15em] text-lime-400 mb-2", mono.className)}>
                        {filtered.length} of {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                    </p>
                    <h1 className={cn("text-3xl md:text-4xl font-semibold tracking-tight text-white", display.className)}>
                        Your Notes
                    </h1>
                </div>
                <Link href="/notes/new" className="flex-shrink-0 mt-1">
                    <button className={cn(
                        "flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-slate-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-lime-400/10",
                        display.className
                    )}>
                        <Plus className="w-4 h-4" />
                        New Note
                    </button>
                </Link>
            </div>

            {/* ── Search + Filters bar ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                        ref={searchRef}
                        type="text"
                        value={rawQuery}
                        onChange={e => setRawQuery(e.target.value)}
                        placeholder="Search notes…"
                        className={cn(
                            "w-full bg-slate-900/60 border border-slate-700 hover:border-slate-600 focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/30 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all",
                            mono.className
                        )}
                    />
                    {/* clear + kbd hint */}
                    {rawQuery ? (
                        <button
                            onClick={() => setRawQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    ) : (
                        <span className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 hidden sm:block", mono.className)}>
                            ⌘K
                        </span>
                    )}
                </div>

                {/* Length filter pills */}
                <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-700 rounded-xl px-1.5 py-1.5">
                    {LENGTH_FILTERS.map(f => (
                        <button
                            key={f.key}
                            onClick={() => setLength(f.key)}
                            className={cn(
                                "px-3 py-1 rounded-lg text-xs font-medium transition-all",
                                mono.className,
                                length === f.key
                                    ? 'bg-lime-400 text-slate-900'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Sort dropdown */}
                <div className="relative" ref={sortRef}>
                    <button
                        onClick={() => setSortOpen(o => !o)}
                        className={cn(
                            "flex items-center gap-2 bg-slate-900/60 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-300 hover:text-white transition-all whitespace-nowrap",
                            mono.className,
                            sortOpen && 'border-lime-400/40 text-white'
                        )}
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        {sortLabel}
                        <ChevronDown className={cn("w-3.5 h-3.5 text-slate-500 transition-transform", sortOpen && 'rotate-180')} />
                    </button>
                    {sortOpen && (
                        <div className="absolute right-0 top-full mt-2 w-44 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl z-20">
                            {SORT_OPTIONS.map(opt => (
                                <button
                                    key={opt.key}
                                    onClick={() => { setSort(opt.key); setSortOpen(false); }}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 text-sm transition-colors",
                                        mono.className,
                                        sort === opt.key
                                            ? 'bg-lime-400/10 text-lime-300'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    )}
                                >
                                    {sort === opt.key && <span className="mr-2 text-lime-400">✓</span>}
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Active filter summary ── */}
            {activeFilters > 0 && (
                <div className="flex items-center gap-3 mb-6">
                    <span className={cn("text-xs text-slate-500", mono.className)}>
                        {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                    </span>
                    <button
                        onClick={() => { setRawQuery(''); setSort('newest'); setLength('all'); }}
                        className={cn("text-xs text-lime-400 hover:text-lime-300 underline underline-offset-2", mono.className)}
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* ── Empty states ── */}
            {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-28 border border-dashed border-slate-700 rounded-2xl bg-slate-900/30">
                    <div className="w-14 h-14 rounded-2xl bg-lime-400/10 flex items-center justify-center mb-5">
                        <BookOpen className="w-7 h-7 text-lime-400" />
                    </div>
                    <h3 className={cn("text-xl font-semibold text-white mb-2", display.className)}>No notes yet</h3>
                    <p className="text-slate-500 text-sm mb-7 text-center max-w-xs leading-relaxed">
                        Your workspace is empty. Write down your first thought to get started.
                    </p>
                    <Link href="/notes/new">
                        <button className={cn(
                            "flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-slate-900 font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-lime-400/10",
                            display.className
                        )}>
                            <Plus className="w-4 h-4" />
                            Create your first note
                        </button>
                    </Link>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-2xl">
                    <Search className="w-8 h-8 text-slate-600 mb-4" />
                    <h3 className={cn("text-base font-semibold text-slate-400 mb-1.5", display.className)}>
                        No matches found
                    </h3>
                    <p className="text-slate-600 text-sm mb-5">
                        Try a different search term or clear the filters.
                    </p>
                    <button
                        onClick={() => { setRawQuery(''); setSort('newest'); setLength('all'); }}
                        className={cn("text-sm text-lime-400 hover:text-lime-300 underline underline-offset-2", mono.className)}
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                /* ── Notes masonry grid ── */
                <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
                    {filtered.map(note => {
                        const preview = note.content ? stripHtml(note.content) : '';
                        const words = note.content ? wordCount(note.content) : 0;

                        return (
                            <div key={note.id} className="break-inside-avoid mb-5">
                                <Link href={`/notes/${note.id}`} className="block group">
                                    <div className="relative bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-lime-400/40 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-black/30">
                                        {/* lime accent bar */}
                                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-slate-700 group-hover:bg-lime-400 transition-colors duration-200" />

                                        <div className="pl-6 pr-5 pt-5 pb-4">
                                            <h3 className={cn(
                                                "text-base font-semibold text-white leading-snug mb-2.5 group-hover:text-lime-300 transition-colors line-clamp-2",
                                                display.className
                                            )}>
                                                {note.title
                                                    ? highlight(note.title, rawQuery)
                                                    : <span className="text-slate-500 italic font-normal">Untitled</span>
                                                }
                                            </h3>

                                            {preview ? (
                                                <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">
                                                    {highlight(preview, rawQuery)}
                                                </p>
                                            ) : (
                                                <p className="text-slate-600 text-sm italic">No content yet</p>
                                            )}

                                            <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-800">
                                                <div className="flex items-center gap-3">
                                                    <span className={cn("text-[11px] text-slate-500", mono.className)}>
                                                        {timeAgo(note.updated_at)}
                                                    </span>
                                                    {words > 0 && (
                                                        <span className={cn("text-[11px] text-slate-600", mono.className)}>
                                                            {words}w
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setNoteToDelete(note.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition-all duration-150"
                                                    aria-label="Delete note"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Delete modal ── */}
            {noteToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-7 max-w-sm w-full shadow-2xl">
                        <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <h3 className={cn("text-lg font-semibold text-white mb-1.5", display.className)}>
                            Delete this note?
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            This action is permanent and cannot be undone.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                className={cn("flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors", display.className)}
                                onClick={() => setNoteToDelete(null)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                className={cn("flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2", display.className)}
                                onClick={() => deleteNote(noteToDelete)}
                                disabled={deleting}
                            >
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}