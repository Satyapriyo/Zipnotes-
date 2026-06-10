'use client';

import { useRef, useState } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Markdown } from '@tiptap/markdown';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import {
    Bold, Italic, Strikethrough, Code, Heading2, Heading3,
    Link as LinkIcon, List, ListOrdered, Quote, Paperclip, Loader2
} from 'lucide-react';
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
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-indigo-600 dark:text-indigo-400 underline cursor-pointer decoration-indigo-300 dark:decoration-indigo-500/50 underline-offset-2',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg border border-slate-200 dark:border-slate-800 max-w-full my-4 shadow-sm',
                },
            }),
            Placeholder.configure({
                placeholder: "Press '/' or use the menu to format...",
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
                <Button size="sm" variant="ghost" onClick={setLink} className={`h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive('link') ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
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
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBlockquote().run()} className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100">
                    <Quote className="w-4 h-4" />
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
        </div>
    );
}