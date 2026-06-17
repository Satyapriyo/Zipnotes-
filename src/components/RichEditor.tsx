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
import { useAuth } from '@clerk/nextjs';
import {
    Bold, Italic, Strikethrough, Code, Heading2, Heading3,
    Link as LinkIcon, List, ListOrdered, Quote, Paperclip, Loader2,
    Type, CheckSquare, Minus, Code2, ImagePlus, type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import '@/styles/editor.css';

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

export function RichEditor({ value, onChange }: RichEditorProps) {
    const { userId } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown,
            PasteMarkdown,
            TaskList.configure({
                HTMLAttributes: { class: 'zn-task-list' },
            }),
            TaskItem.configure({
                nested: true,
                HTMLAttributes: { class: 'zn-task-item' },
            }),
            SlashCommand.configure({
                onAttach: () => fileInputRef.current?.click(),
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-lime-700 dark:text-lime-400 underline cursor-pointer decoration-lime-400/60 dark:decoration-lime-500/50 underline-offset-2',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg border border-slate-200 dark:border-slate-800 max-w-full my-4 shadow-sm',
                },
            }),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === 'heading') {
                        return `Heading ${node.attrs.level}`;
                    }
                    return "Press '/' for commands, or just start typing...";
                },
                emptyNodeClass: 'is-empty',
            }),
        ],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[500px] text-slate-800 dark:text-slate-200',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // --- CLOUDINARY UPLOAD LOGIC ---
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !userId || !editor) return;

        try {
            setIsUploading(true);

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset) {
                throw new Error("Missing Cloudinary environment variables");
            }

            // Prepare the form data for Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            // Organize files into folders by User ID inside Cloudinary!
            formData.append('folder', `zipnotes/users/${userId}`);

            // Send to Cloudinary REST API
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to upload to Cloudinary');
            }

            // Get the ultra-fast CDN url back
            const secureUrl = data.secure_url;

            // Insert into Tiptap based on file type
            if (file.type.startsWith('image/')) {
                editor.chain().focus().setImage({ src: secureUrl }).run();
            } else if (file.type.startsWith('video/')) {
                // Tiptap doesn't natively support <video> tags in StarterKit, 
                // so we insert it as a clean link with a video emoji
                editor
                    .chain()
                    .focus()
                    .insertContent(`<a href="${secureUrl}" target="_blank" rel="noopener noreferrer">🎥 ${file.name}</a>`)
                    .run();
            } else {
                editor
                    .chain()
                    .focus()
                    .insertContent(`<a href="${secureUrl}" target="_blank" rel="noopener noreferrer">📎 ${file.name}</a>`)
                    .run();
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload attachment. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (!editor) return null;

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="relative h-full flex flex-col cursor-text group" onClick={() => editor.commands.focus()}>

            {/* Hidden File Input (Now accepts video formats too!) */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip"
            />

            {/* 1. BUBBLE MENU */}
            <BubbleMenu editor={editor} options={{ placement: 'top' }} className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-lg p-1">
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBold().run()} className={`h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 ${editor.isActive('bold') ? 'bg-slate-100 dark:bg-slate-800 text-black dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    <Bold className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleItalic().run()} className={`h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 ${editor.isActive('italic') ? 'bg-slate-100 dark:bg-slate-800 text-black dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    <Italic className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleStrike().run()} className={`h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 ${editor.isActive('strike') ? 'bg-slate-100 dark:bg-slate-800 text-black dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    <Strikethrough className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleCode().run()} className={`h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 ${editor.isActive('code') ? 'bg-slate-100 dark:bg-slate-800 text-black dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    <Code className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
                <Button size="sm" variant="ghost" onClick={setLink} className={`h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive('link') ? 'bg-lime-50 dark:bg-lime-400/10 text-lime-700 dark:text-lime-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    <LinkIcon className="w-4 h-4" />
                </Button>
            </BubbleMenu>

            {/* 2. FLOATING MENU */}
            <FloatingMenu editor={editor} options={{ placement: 'right' }} className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-lg p-1 animate-in fade-in zoom-in-95 duration-200">
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="h-8 px-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100">
                    H2
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="h-8 px-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100">
                    H3
                </Button>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBulletList().run()} className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100">
                    <List className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100">
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleTaskList().run()} className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100">
                    <CheckSquare className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBlockquote().run()} className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100">
                    <Quote className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100">
                    <Code2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100">
                    <Minus className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="h-8 px-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 gap-2"
                >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                    {isUploading ? "Uploading..." : "Attach"}
                </Button>
            </FloatingMenu>

            {/* Editor Content Area */}
            <div className="flex-1 w-full max-w-4xl mx-auto md:px-8 py-4">
                <EditorContent editor={editor} />
            </div>

            {/* Notion-style checkbox styling for task lists */}
            <style jsx global>{`
                .ProseMirror ul.zn-task-list,
                .ProseMirror ul[data-type='taskList'] {
                    list-style: none;
                    padding-left: 0.25rem;
                    margin: 0.5rem 0;
                }
                .ProseMirror li.zn-task-item,
                .ProseMirror li[data-type='taskItem'] {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.6rem;
                    margin: 0.35rem 0;
                }
                .ProseMirror li.zn-task-item > label,
                .ProseMirror li[data-type='taskItem'] > label {
                    flex-shrink: 0;
                    margin-top: 0.3rem;
                    user-select: none;
                }
                .ProseMirror li.zn-task-item > div,
                .ProseMirror li[data-type='taskItem'] > div {
                    flex: 1 1 auto;
                    min-width: 0;
                }
                .ProseMirror li.zn-task-item > div > p,
                .ProseMirror li[data-type='taskItem'] > div > p {
                    margin: 0;
                }
                .ProseMirror li[data-type='taskItem'] > label input[type='checkbox'] {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 1.1rem;
                    height: 1.1rem;
                    border: 1.5px solid #cbd5e1;
                    border-radius: 0.3rem;
                    cursor: pointer;
                    position: relative;
                    display: inline-block;
                    background-color: transparent;
                    transition: background-color 0.15s, border-color 0.15s;
                }
                .dark .ProseMirror li[data-type='taskItem'] > label input[type='checkbox'] {
                    border-color: #475569;
                }
                .ProseMirror li[data-type='taskItem'] > label input[type='checkbox']:checked {
                    background-color: #bef264;
                    border-color: #bef264;
                }
                .ProseMirror li[data-type='taskItem'] > label input[type='checkbox']:checked::after {
                    content: '';
                    position: absolute;
                    left: 4px;
                    top: 1px;
                    width: 4px;
                    height: 8px;
                    border: solid #0f172a;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }
                .ProseMirror li[data-type='taskItem'][data-checked='true'] > div {
                    color: #94a3b8;
                    text-decoration: line-through;
                }
                .dark .ProseMirror li[data-type='taskItem'][data-checked='true'] > div {
                    color: #64748b;
                }
                .ProseMirror li[data-type='taskItem'] ul[data-type='taskList'] {
                    margin-top: 0.35rem;
                    padding-left: 1.4rem;
                }
            `}</style>
        </div>
    );
}