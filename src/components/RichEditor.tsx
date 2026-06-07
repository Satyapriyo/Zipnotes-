'use client';

import { useRef, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { useAuth, useSession } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading2,
    Heading3,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Paperclip,
    Loader2
} from 'lucide-react';
import '@/styles/editor.css';

interface RichEditorProps {
    value: string;
    onChange: (content: string) => void;
}

export function RichEditor({ value, onChange }: RichEditorProps) {
    const { userId } = useAuth();
    const { session } = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-indigo-600 underline cursor-pointer decoration-indigo-300 underline-offset-2',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg border border-slate-200 max-w-full my-4 shadow-sm',
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
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[500px] text-slate-800',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Helper to create authenticated Supabase client for storage
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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !userId || !editor) return;

        try {
            setIsUploading(true);
            const supabase = await createAuthenticatedClient();

            // 1. Create a unique, URL-safe filename
            const fileExt = file.name.split('.').pop();
            const safeFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            const uniqueFileName = `${Date.now()}_${safeFileName}.${fileExt}`;

            // Organize files into folders by userId
            const filePath = `${userId}/${uniqueFileName}`;

            // 2. Upload the file to the 'attachments' bucket
            const { error: uploadError } = await supabase.storage
                .from('attachments')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 3. Get the public URL for the file
            const { data: { publicUrl } } = supabase.storage
                .from('attachments')
                .getPublicUrl(filePath);

            // 4. Insert into Tiptap
            if (file.type.startsWith('image/')) {
                editor.chain().focus().setImage({ src: publicUrl }).run();
            } else {
                editor
                    .chain()
                    .focus()
                    .insertContent(`<a href="${publicUrl}" target="_blank" rel="noopener noreferrer">📎 ${file.name}</a>`)
                    .run();
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload attachment. Check your Supabase storage permissions.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        }
    };

    if (!editor) {
        return null;
    }

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

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
            />

            {/* 1. NOTION BUBBLE MENU */}
            {editor && (
                <BubbleMenu
                    editor={editor}
                    options={{ placement: 'top' }}
                    className="flex items-center gap-1 bg-white border border-slate-200 shadow-xl rounded-lg p-1"
                >
                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBold().run()} className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-slate-100 text-black' : 'text-slate-600'}`}>
                        <Bold className="w-4 h-4" />
                    </Button>

                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleItalic().run()} className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-slate-100 text-black' : 'text-slate-600'}`}>
                        <Italic className="w-4 h-4" />
                    </Button>

                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleStrike().run()} className={`h-8 w-8 p-0 ${editor.isActive('strike') ? 'bg-slate-100 text-black' : 'text-slate-600'}`}>
                        <Strikethrough className="w-4 h-4" />
                    </Button>

                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleCode().run()} className={`h-8 w-8 p-0 ${editor.isActive('code') ? 'bg-slate-100 text-black' : 'text-slate-600'}`}>
                        <Code className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-4 bg-slate-200 mx-1" />

                    <Button size="sm" variant="ghost" onClick={setLink} className={`h-8 w-8 p-0 ${editor.isActive('link') ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}>
                        <LinkIcon className="w-4 h-4" />
                    </Button>
                </BubbleMenu>
            )}

            {/* 2. NOTION FLOATING MENU */}
            {editor && (
                <FloatingMenu
                    editor={editor}
                    options={{ placement: 'right' }}
                    className="flex items-center gap-1 bg-white border border-slate-200 shadow-lg rounded-lg p-1 animate-in fade-in zoom-in-95 duration-200"
                >
                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="h-8 px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-black">
                        H2
                    </Button>

                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="h-8 px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-black">
                        H3
                    </Button>

                    <div className="w-px h-4 bg-slate-200 mx-1" />

                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBulletList().run()} className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 hover:text-black">
                        <List className="w-4 h-4" />
                    </Button>

                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 hover:text-black">
                        <ListOrdered className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-4 bg-slate-200 mx-1" />

                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBlockquote().run()} className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 hover:text-black">
                        <Quote className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-4 bg-slate-200 mx-1" />

                    {/* New Attachment Button */}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="h-8 px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-black gap-2"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                        {isUploading ? "Uploading..." : "Attach"}
                    </Button>
                </FloatingMenu>
            )}

            {/* Editor Content Area */}
            <div className="flex-1 w-full max-w-4xl mx-auto md:px-8 py-4">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}