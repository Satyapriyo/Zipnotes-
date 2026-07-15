'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAuth, useSession } from '@clerk/nextjs';
import Link from 'next/link';
import { Loader2, Trash2, BookOpen, Plus, AlertCircle, Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

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

/* ─── Safe Helpers ─────────────────────────────────────────────── */
function stripHtml(html?: string | null): string {
    if (!html) return '';
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

function wordCount(content?: string | null): number {
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

function highlight(text?: string | null, query?: string): React.ReactNode {
    if (!text) return '';
    if (!query || !query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
        regex.test(part)
            ? <mark key={i} className="bg-ember/20 text-ember-ink rounded-sm px-0.5">{part}</mark>
            : part
    );
}

/* ─── Component ───────────────────────────────────────────── */
export default function NotesPage() {
    const { userId, isLoaded } = useAuth();
    const { session } = useSession();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Search + filter state
    const [rawQuery, setRawQuery] = useState('');
    const [query, setQuery] = useState(''); // debounced
    const [sort, setSort] = useState<SortKey>('newest');
    const [length, setLength] = useState<LengthKey>('all');
    const [sortOpen, setSortOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setQuery(rawQuery.trim().toLowerCase()), 120);
        return () => clearTimeout(t);
    }, [rawQuery]);

    // Close sort dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Keyboard shortcut: Cmd/Ctrl+K focuses search
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

    // Auth Client
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
            fetchNotes();
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

    /* ── Filtering + Sorting ── */
    const filtered = useMemo(() => {
        const lengthFilter = LENGTH_FILTERS.find(f => f.key === length)!;

        let result = notes.filter(note => {
            if (query) {
                const titleMatch = note.title?.toLowerCase().includes(query);
                const contentMatch = stripHtml(note.content).toLowerCase().includes(query);
                if (!titleMatch && !contentMatch) return false;
            }
            const wc = wordCount(note.content);
            return wc >= lengthFilter.min && wc < lengthFilter.max;
        });

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
    const sortLabel = SORT_OPTIONS.find(o => o.key === sort)?.label ?? 'Sort';

    /* ── Loading State ── */
    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-ink-muted" />
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">

            {/* ── Header ── */}
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                        {filtered.length} of {notes.length} notes
                    </p>
                    <h1 className="font-display text-3xl font-medium tracking-[-0.03em] sm:text-[2.25rem]">
                        Your <span className="font-editorial italic">notes</span>
                    </h1>
                </div>
                <Link
                    href="/notes/new"
                    className="group inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-paper transition-all hover:translate-y-[-1px] hover:bg-ink-soft"
                >
                    <Plus className="h-3.5 w-3.5" />
                    New note
                </Link>
            </div>

            {/* ── Toolbar ── */}
            <div className="mt-7 flex flex-col gap-2.5 lg:flex-row">
                <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                    <input
                        ref={searchRef}
                        type="text"
                        value={rawQuery}
                        onChange={e => setRawQuery(e.target.value)}
                        placeholder="Search notes…"
                        className="w-full rounded-xl border border-rule bg-paper py-2.5 pl-10 pr-12 font-mono text-[13px] text-ink placeholder:text-ink-muted/70 outline-none transition-all focus:border-ember focus:ring-2 focus:ring-ember/15"
                    />
                    {rawQuery ? (
                        <button
                            onClick={() => setRawQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    ) : (
                        <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-rule bg-paper-2 px-1.5 py-0.5 font-mono text-[10px] text-ink-muted sm:block">
                            ⌘K
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-1 rounded-xl border border-rule bg-paper p-1">
                    {LENGTH_FILTERS.map(f => (
                        <button
                            key={f.key}
                            onClick={() => setLength(f.key)}
                            className={`rounded-lg px-3 py-1.5 font-mono text-[11px] transition-all ${length === f.key
                                ? "bg-ink text-paper"
                                : "text-ink-soft hover:bg-paper-2 hover:text-ink"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="relative shrink-0" ref={sortRef}>
                    <button
                        onClick={() => setSortOpen(o => !o)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-rule bg-paper px-4 py-2.5 font-mono text-[12px] text-ink-soft transition-all hover:border-ink/20 hover:text-ink lg:w-auto"
                    >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        {sortLabel}
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {sortOpen && (
                        <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-rule bg-paper shadow-xl">
                            {SORT_OPTIONS.map(opt => (
                                <button
                                    key={opt.key}
                                    onClick={() => { setSort(opt.key); setSortOpen(false); }}
                                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-left font-mono text-[12px] transition-colors ${sort === opt.key
                                        ? "bg-ember-soft/30 text-ember-ink"
                                        : "text-ink-soft hover:bg-paper-2 hover:text-ink"
                                        }`}
                                >
                                    {sort === opt.key && <span className="text-ember">✓</span>}
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Active Filters ── */}
            {activeFilters > 0 && (
                <div className="flex items-center gap-3 mt-4 mb-2">
                    <span className="font-mono text-[11px] text-ink-muted">
                        {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                    </span>
                    <button
                        onClick={() => { setRawQuery(''); setSort('newest'); setLength('all'); }}
                        className="font-mono text-[11px] text-ember-ink hover:text-ember underline underline-offset-2"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* ── Empty States ── */}
            <div className="mt-8">
                {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-rule rounded-2xl bg-paper-2/40 px-4">
                        <div className="w-14 h-14 rounded-2xl bg-paper border border-rule flex items-center justify-center mb-5">
                            <BookOpen className="w-6 h-6 text-ink-muted" />
                        </div>
                        <h3 className="font-display text-xl font-medium tracking-tight text-ink mb-2">No notes yet</h3>
                        <p className="text-ink-soft text-[14px] mb-7 text-center max-w-xs leading-relaxed">
                            Your workspace is empty. Write down your first thought to get started.
                        </p>
                        <Link href="/notes/new">
                            <button className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-paper transition-all hover:translate-y-[-1px] hover:bg-ink-soft">
                                <Plus className="w-4 h-4" />
                                Create your first note
                            </button>
                        </Link>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-rule rounded-2xl px-4">
                        <Search className="w-8 h-8 text-ink-muted mb-4" />
                        <h3 className="font-display text-lg font-medium text-ink mb-1.5">No matches found</h3>
                        <p className="text-ink-soft text-[13px] mb-5 text-center">
                            Try a different search term or clear the filters.
                        </p>
                        <button
                            onClick={() => { setRawQuery(''); setSort('newest'); setLength('all'); }}
                            className="font-mono text-[11px] text-ember-ink hover:text-ember underline underline-offset-2"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    /* ── Notes Grid ── */
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
                        {filtered.map((note, i) => {
                            const preview = stripHtml(note.content);
                            const words = wordCount(note.content);

                            return (
                                <Link
                                    key={note.id}
                                    href={`/notes/${note.id}`}
                                    className="group mb-5 block break-inside-avoid"
                                    style={{ animation: `fade-up 0.5s ${i * 40}ms both cubic-bezier(0.16, 1, 0.3, 1)` }}
                                >
                                    <article className="relative overflow-hidden rounded-2xl border border-rule bg-paper p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/40 hover:shadow-[0_18px_40px_-22px_rgba(28,25,23,0.25)]">
                                        <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-ember transition-transform duration-300 group-hover:scale-x-100" />

                                        <header className="mb-3 flex items-baseline justify-between gap-3">
                                            <h2 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug tracking-tight text-ink">
                                                {note.title ? highlight(note.title, query) : <span className="text-ink-muted font-normal italic">Untitled</span>}
                                            </h2>
                                            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                                                {timeAgo(note.updated_at)}
                                            </span>
                                        </header>

                                        <p className="line-clamp-5 text-[13.5px] leading-relaxed text-ink-soft">
                                            {preview ? highlight(preview, query) : <span className="italic text-ink-muted">No content yet</span>}
                                        </p>

                                        <footer className="mt-4 flex items-center justify-between border-t border-rule pt-3">
                                            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                                                {words} words
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setNoteToDelete(note.id);
                                                    }}
                                                    className="text-ink-muted hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                    aria-label="Delete note"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="font-mono text-[10px] text-ink-muted opacity-0 transition-opacity group-hover:opacity-100">
                                                    open →
                                                </span>
                                            </div>
                                        </footer>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Delete Confirmation Modal ── */}
            {noteToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm rounded-2xl border border-rule bg-paper p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 font-display text-xl font-medium tracking-tight text-ink">
                            Delete this note?
                        </h3>
                        <p className="mb-6 text-[14px] leading-relaxed text-ink-soft">
                            This action is permanent and cannot be undone.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setNoteToDelete(null)}
                                disabled={deleting}
                                className="flex-1 rounded-xl border border-rule bg-paper px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-paper-2 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteNote(noteToDelete)}
                                disabled={deleting}
                                className="flex-1 rounded-xl bg-destructive px-4 py-2.5 text-[13px] font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50 flex justify-center items-center gap-2"
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