'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth, useSession } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2, Plus, Check, Circle, Target, Calendar, CalendarDays, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';
const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

interface Task {
    id: string;
    title: string;
    completed: boolean;
    category: string;
    created_at: string;
}

export default function TasksPage() {
    const { userId, isLoaded } = useAuth();
    const { session } = useSession();
    const params = useParams();
    const category = params.category as string;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    // NEW: State for the delete confirmation modal
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const pageConfig = {
        'today': { title: "Today's Tasks", desc: "What needs to get done today?", icon: Calendar, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
        'weekly': { title: "Weekly Tasks", desc: "Your priorities for this week.", icon: CalendarDays, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
        'long-term': { title: "Long-Term Goals", desc: "Big picture objectives and milestones.", icon: Target, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
    }[category] || { title: "Tasks", desc: "Manage your tasks.", icon: Target, color: "text-lime-600 dark:text-lime-400", bg: "bg-lime-100 dark:bg-lime-400/10" };

    const Icon = pageConfig.icon;

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
            // Close the modal whether it succeeds or fails
            setTaskToDelete(null);
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
        <div className="p-8 max-w-4xl mx-auto relative">
            <div className="mb-10 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${pageConfig.bg}`}>
                    <Icon className={`w-7 h-7 ${pageConfig.color}`} />
                </div>
                <div>
                    <h1 className={cn("text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2", display.className)}>{pageConfig.title}</h1>
                    <p className="text-slate-600 dark:text-slate-400">{pageConfig.desc}</p>
                </div>
            </div>

            <form onSubmit={addTask} className="mb-10 relative">
                <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task... (Press Enter to save)"
                    className="h-14 pl-5 pr-32 text-lg bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-lime-400 rounded-2xl shadow-sm dark:text-white placeholder:text-slate-400"
                    disabled={adding}
                />
                <Button
                    type="submit"
                    disabled={!newTaskTitle.trim() || adding}
                    className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-slate-800 text-lime-300 dark:bg-lime-300 dark:hover:bg-lime-200 dark:text-slate-900 rounded-xl px-6 font-medium"
                >
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5 mr-1" />}
                    Add
                </Button>
            </form>

            <div className="space-y-3">
                {tasks.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        No tasks here yet. Start typing above to add one!
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`group flex items-center justify-between p-4 bg-white dark:bg-slate-900/50 border rounded-2xl transition-all duration-200 ${task.completed
                                ? 'border-slate-100 dark:border-slate-800/50 opacity-60'
                                : 'border-slate-200 dark:border-slate-800 hover:border-lime-300 dark:hover:border-lime-400/30 hover:shadow-sm'
                                }`}
                        >
                            <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleTask(task.id, task.completed)}>
                                <button className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors shrink-0 ${task.completed
                                    ? 'bg-lime-400 border-lime-400 text-slate-900'
                                    : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-lime-400'
                                    }`}>
                                    {task.completed ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4 opacity-0" />}
                                </button>

                                <div className="flex flex-col">
                                    <span className={`text-lg transition-all ${task.completed
                                        ? 'line-through text-slate-400 dark:text-slate-500'
                                        : 'text-slate-800 dark:text-slate-200'
                                        }`}>
                                        {task.title}
                                    </span>
                                    <span className={cn("text-xs mt-0.5", mono.className, task.completed ? 'text-slate-400/50 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500')}>
                                        Created {new Date(task.created_at).toLocaleString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setTaskToDelete(task.id)} // NEW: Opens the modal instead of deleting instantly
                                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* NEW: Custom Delete Confirmation Modal */}
            {taskToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4">
                            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className={cn("text-xl font-semibold text-slate-900 dark:text-white mb-2", display.className)}>
                            Delete this task?
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            This action cannot be undone. This will permanently remove it from your list.
                        </p>
                        <div className="flex items-center gap-3 w-full">
                            <Button
                                variant="outline"
                                className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                onClick={() => setTaskToDelete(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => confirmDeleteTask(taskToDelete)}
                            >
                                Delete Task
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}