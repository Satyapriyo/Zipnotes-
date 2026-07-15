'use client';

import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent, ReactRenderer, Extension } from '@tiptap/react';
import type { Editor, Range } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Markdown } from '@tiptap/markdown';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Suggestion, { type SuggestionProps, type SuggestionKeyDownProps } from '@tiptap/suggestion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@clerk/nextjs';


import {
    Bold, Italic, Strikethrough, Code, Heading2, Heading3,
    Link as LinkIcon, List, ListOrdered, Quote, Paperclip, Loader2,
    Type, CheckSquare, Minus, Code2, ImagePlus, type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import '@/styles/editor.css';




import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { BlockNoteEditor } from '@blocknote/core';
import { useTheme } from 'next-themes';

function looksLikeMarkdown(text: string): boolean {
    return (
        /^#{1,6}\s/m.test(text) || /\*\*[^*]+\*\*/.test(text) || /\*[^*]+\*/.test(text) ||
        /\[.+\]\(.+\)/.test(text) || /^\s*[-*+]\s/m.test(text) || /^\s*\d+\.\s/m.test(text) ||
        /^\s*>\s/m.test(text) || /`[^`]+`/.test(text) || /^```/m.test(text)
    );
}

const PasteMarkdown = Extension.create({
    name: 'pasteMarkdown',
    addProseMirrorPlugins() {
        const { editor } = this;
        return [
            new Plugin({
                key: new PluginKey('pasteMarkdown'),
                props: {
                    handlePaste(view, event) {
                        const text = event.clipboardData?.getData('text/plain');
                        const html = event.clipboardData?.getData('text/html');

                        if (text && !html && looksLikeMarkdown(text)) {
                            try {
                                const json = (editor as any).markdown.parse(text);
                                editor.commands.insertContentAt(view.state.selection.from, json);
                                return true;
                            } catch (e) {
                                return false;
                            }
                        }
                        return false;
                    },
                },
            }),
        ];
    },
});

// ---------------------------------------------------------------------
// Slash command menu — Notion-style "/" block picker
// ---------------------------------------------------------------------

interface CommandItem {
    title: string;
    description: string;
    icon: LucideIcon;
    command: (props: { editor: Editor; range: Range }) => void;
}

function getSlashCommandItems(onAttach?: () => void): CommandItem[] {
    return [
        {
            title: 'Text',
            description: 'Plain paragraph text',
            icon: Type,
            command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setParagraph().run(),
        },
        {
            title: 'Heading 2',
            description: 'Medium section heading',
            icon: Heading2,
            command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run(),
        },
        {
            title: 'Heading 3',
            description: 'Small section heading',
            icon: Heading3,
            command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run(),
        },
        {
            title: 'Bulleted list',
            description: 'Simple bullet list',
            icon: List,
            command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
        },
        {
            title: 'Numbered list',
            description: 'List with numbering',
            icon: ListOrdered,
            command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
        },
        {
            title: 'To-do list',
            description: 'Checkboxes you can tick off',
            icon: CheckSquare,
            command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleTaskList().run(),
        },
        {
            title: 'Quote',
            description: 'Set off a callout or quote',
            icon: Quote,
            command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
        },
        {
            title: 'Code block',
            description: 'Multi-line code snippet',
            icon: Code2,
            command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
        },
        {
            title: 'Divider',
            description: 'Horizontal rule',
            icon: Minus,
            command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
        },
        {
            title: 'Image or file',
            description: 'Upload an attachment',
            icon: ImagePlus,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).run();
                onAttach?.();
            },
        },
    ];
}

interface CommandListRef {
    onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

const CommandList = forwardRef<CommandListRef, SuggestionProps<CommandItem>>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const items = props.items;

    useEffect(() => setSelectedIndex(0), [items]);

    const selectItem = (index: number) => {
        const item = items[index];
        if (item) props.command(item);
    };

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((selectedIndex + items.length - 1) % items.length);
                return true;
            }
            if (event.key === 'ArrowDown') {
                setSelectedIndex((selectedIndex + 1) % items.length);
                return true;
            }
            if (event.key === 'Enter') {
                selectItem(selectedIndex);
                return true;
            }
            return false;
        },
    }), [selectedIndex, items]);

    if (items.length === 0) return null;

    return (
        <div className="z-50 w-64 max-h-80 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-1">
            {items.map((item, index) => {
                const ItemIcon = item.icon;
                return (
                    <button
                        key={item.title}
                        onClick={() => selectItem(index)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                            index === selectedIndex
                                ? "bg-lime-50 dark:bg-lime-400/10 text-slate-900 dark:text-lime-300"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                    >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            <ItemIcon className="h-4 w-4" />
                        </span>
                        <span className="flex flex-col overflow-hidden">
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{item.title}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500 truncate">{item.description}</span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
});
CommandList.displayName = 'CommandList';

function positionPopup(el: HTMLElement, props: { clientRect?: (() => DOMRect | null) | null }) {
    const rect = props.clientRect?.();
    if (!rect) return;
    el.style.left = `${rect.left + window.scrollX}px`;
    el.style.top = `${rect.bottom + window.scrollY + 8}px`;
}

interface SlashCommandOptions {
    onAttach?: () => void;
}

const SlashCommand = Extension.create<SlashCommandOptions>({
    name: 'slashCommand',

    addOptions() {
        return {
            onAttach: undefined,
        };
    },

    addProseMirrorPlugins() {
        const onAttach = this.options.onAttach;

        return [
            Suggestion({
                editor: this.editor,
                char: '/',
                pluginKey: new PluginKey('slashCommand'),
                items: ({ query }) =>
                    getSlashCommandItems(onAttach)
                        .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
                        .slice(0, 10),
                command: ({ editor, range, props }) => {
                    props.command({ editor, range });
                },
                render: () => {
                    let component: ReactRenderer<CommandListRef, SuggestionProps<CommandItem>>;
                    let popup: HTMLDivElement;

                    return {
                        onStart: (props) => {
                            component = new ReactRenderer(CommandList, {
                                props,
                                editor: props.editor,
                            });

                            popup = document.createElement('div');
                            popup.style.position = 'absolute';
                            popup.style.zIndex = '60';
                            document.body.appendChild(popup);
                            popup.appendChild(component.element);

                            positionPopup(popup, props);
                        },
                        onUpdate: (props) => {
                            component.updateProps(props);
                            positionPopup(popup, props);
                        },
                        onKeyDown: (props) => {
                            if (props.event.key === 'Escape') {
                                return true;
                            }
                            return component.ref?.onKeyDown(props) ?? false;
                        },
                        onExit: () => {
                            popup?.remove();
                            component?.destroy();
                        },
                    };
                },
            }),
        ];
    },
});

interface RichEditorProps {
    value: string;
    onChange: (content: string) => void;
}


export async function RichEditor({ value, onChange }: RichEditorProps) {
    // Creates a new editor instance.


    const editor = BlockNoteEditor.create();

    const blocks = await editor.tryParseMarkdownToBlocks(value);

    // Replace the document
    editor.replaceBlocks(editor.document, blocks);

    // Renders the editor instance using a React component.
    return (
        <BlockNoteView
            editor={editor}
        />
    );
}