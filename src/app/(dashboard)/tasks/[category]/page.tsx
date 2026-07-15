'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth, useSession } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { Loader2, Trash2, Plus, Check, Target, Calendar, CalendarDays, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';


export const dynamic = 'force-dynamic';

interface Task {
    id: string;
    title: string;
    completed: boolean;
    category: string;
    created_at: string;
}

const ICONS = {
    today: Calendar,
    weekly: CalendarDays,
    "long-term": Target,
} as const;

const CATEGORY_META = {
    today: { title: "Today's Tasks", desc: "What needs to get done today?" },
    weekly: { title: "Weekly Tasks", desc: "Your priorities for this week." },
    "long-term": { title: "Long-Term Goals", desc: "Big picture objectives and milestones." },
};

export default function TasksPage() {
    const { userId, isLoaded } = useAuth();

    const { session } = useSession();
    const params = useParams();
    const category = params.category as string;

    const meta = CATEGORY_META[category as keyof typeof CATEGORY_META] ?? {
        title: "Tasks",
        desc: "Manage your tasks.",
    };
    const Icon = ICONS[category as keyof typeof ICONS] ?? Target;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const createAuthenticatedClient = useCallback(async () => {
        const supabaseToken = await session?.getToken({ template: 'supabase' });
        return createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { global: { headers: { Authorization: `Bearer ${supabaseToken}` } } }
        );
    }, [session]);

    const fetchTasks = useCallback(async () => {
        if (!userId || !session || !category) return;
        try {
            setLoading(true);
            const supabase = await createAuthenticatedClient();
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', userId)
                .eq('category', category)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTasks(data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    }, [userId, session, category, createAuthenticatedClient]);

    useEffect(() => {
        if (isLoaded && userId && session) {
            fetchTasks();
        }
    }, [isLoaded, userId, session, fetchTasks]);

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !userId || !session) return;

        try {
            setAdding(true);
            const supabase = await createAuthenticatedClient();
            const { data, error } = await supabase
                .from('tasks')
                .insert({ user_id: userId, title: newTaskTitle.trim(), category })
                .select()
                .single();

            if (error) throw error;
            setTasks([data as Task, ...tasks]);
            setNewTaskTitle('');
        } catch (error) {
            console.error('Error adding task:', error);
        } finally {
            setAdding(false);
        }
    };

    const toggleTask = async (id: string, currentStatus: boolean) => {
        try {
            setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));

            const supabase = await createAuthenticatedClient();
            const { error } = await supabase
                .from('tasks')
                .update({ completed: !currentStatus })
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
        } catch (error) {
            console.error('Error toggling task:', error);
            fetchTasks();
        }
    };

    const confirmDeleteTask = async (id: string) => {
        try {
            setTasks(tasks.filter(t => t.id !== id));
            const supabase = await createAuthenticatedClient();
            await supabase.from('tasks').delete().eq('id', id).eq('user_id', userId);
        } catch (error) {
            console.error('Error deleting task:', error);
            fetchTasks();
        } finally {
            setTaskToDelete(null);
        }
    };

    const done = tasks.filter((t) => t.completed).length;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

    if (loading) {
        return (
            <div className="flex h-full min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-ink-muted" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl p-5 sm:p-8 lg:p-10">
            {/* Header */}
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-rule bg-paper-2 text-ember">
                    <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                    <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                        {done} of {tasks.length} complete
                    </p>
                    <h1 className="truncate font-display text-2xl font-medium tracking-[-0.03em] sm:text-[2rem]">
                        <span className="font-editorial italic">{meta.title}</span>
                    </h1>
                    <p className="mt-1 text-[13px] text-ink-soft">{meta.desc}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 flex items-center gap-4">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-paper-3">
                    <div
                        className="h-full rounded-full bg-ember transition-all duration-700 ease-out"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <span className="font-mono text-[11px] text-ink-muted">{pct}%</span>
            </div>

            {/* Add Task Form */}
            <form onSubmit={addTask} className="relative mt-8">
                <input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="What needs doing? (press Enter)"
                    disabled={adding}
                    className="h-14 w-full rounded-2xl border border-rule bg-paper-2/50 px-5 pr-28 text-[15px] text-ink placeholder:text-ink-muted/70 outline-none transition-all focus:border-ember focus:bg-paper focus:ring-2 focus:ring-ember/15 disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!newTaskTitle.trim() || adding}
                    className="absolute right-2 top-2 bottom-2 inline-flex items-center gap-2 rounded-xl bg-ink px-4 text-[13px] font-medium text-paper transition-all hover:bg-ink-soft disabled:opacity-40"
                >
                    {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add
                </button>
            </form>

            {/* Tasks List */}
            <div className="mt-6 space-y-2">
                {tasks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-rule px-6 py-12 text-center text-[13px] text-ink-muted">
                        All clear. Start typing above to add a task.
                    </div>
                ) : (
                    tasks.map((t) => (
                        <div
                            key={t.id}
                            className={`group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border bg-paper px-4 py-3.5 transition-all ${t.completed
                                ? "border-rule/60 opacity-60"
                                : "border-rule hover:border-ember/40 hover:shadow-[0_8px_24px_-16px_rgba(28,25,23,0.18)]"
                                }`}
                        >
                            <button
                                onClick={() => toggleTask(t.id, t.completed)}
                                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-all ${t.completed
                                    ? "border-ember bg-ember text-paper"
                                    : "border-rule hover:border-ember"
                                    }`}
                            >
                                {t.completed && <Check className="h-3 w-3" strokeWidth={3} />}
                            </button>
                            <div className="min-w-0">
                                <p
                                    className={`truncate text-[14.5px] ${t.completed ? "text-ink-muted line-through" : "text-ink"
                                        }`}
                                >
                                    {t.title}
                                </p>
                                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                                    {new Date(t.created_at).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                            <button
                                onClick={() => setTaskToDelete(t.id)}
                                className="rounded-lg p-2 text-ink-muted opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {taskToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm rounded-2xl border border-rule bg-paper p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 font-display text-xl font-medium tracking-tight text-ink">
                            Delete this task?
                        </h3>
                        <p className="mb-6 text-[14px] leading-relaxed text-ink-soft">
                            This action cannot be undone. This will permanently remove it from your list.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setTaskToDelete(null)}
                                className="flex-1 rounded-xl border border-rule bg-paper px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-paper-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmDeleteTask(taskToDelete)}
                                className="flex-1 rounded-xl bg-destructive px-4 py-2.5 text-[13px] font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
                            >
                                Delete Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}