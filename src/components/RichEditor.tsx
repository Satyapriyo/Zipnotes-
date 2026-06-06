'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'; // <-- Added FloatingMenu
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
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
    Quote
} from 'lucide-react'; // <-- Added block icons
import '@/styles/editor.css';

interface RichEditorProps {
    value: string;
    onChange: (content: string) => void;
}

export function RichEditor({ value, onChange }: RichEditorProps) {
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
                    class: 'rounded-lg border border-gray-200 max-w-full my-4',
                },
            }),
            Placeholder.configure({
                placeholder: "Press '/' or use the menu to format...",
                // This ensures it applies to all standard paragraph blocks
                emptyNodeClass: 'is-empty',
            }),
        ],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[500px] text-gray-800',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

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

            {/* 1. NOTION BUBBLE MENU (Appears when text is selected) */}
            {editor && (
                <BubbleMenu
                    editor={editor}
                    options={{ placement: 'top' }}
                    className="flex items-center gap-1 bg-white border border-gray-200 shadow-xl rounded-lg p-1"
                >
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-gray-100 text-black' : 'text-gray-600'}`}
                    >
                        <Bold className="w-4 h-4" />
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-gray-100 text-black' : 'text-gray-600'}`}
                    >
                        <Italic className="w-4 h-4" />
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`h-8 w-8 p-0 ${editor.isActive('strike') ? 'bg-gray-100 text-black' : 'text-gray-600'}`}
                    >
                        <Strikethrough className="w-4 h-4" />
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={`h-8 w-8 p-0 ${editor.isActive('code') ? 'bg-gray-100 text-black' : 'text-gray-600'}`}
                    >
                        <Code className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-4 bg-gray-300 mx-1" />

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={setLink}
                        className={`h-8 w-8 p-0 ${editor.isActive('link') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    >
                        <LinkIcon className="w-4 h-4" />
                    </Button>
                </BubbleMenu>
            )}

            {/* 2. NOTION FLOATING MENU (Appears on empty lines!) */}
            {editor && (
                <FloatingMenu
                    editor={editor}
                    options={{ placement: 'right' }}
                    className="flex items-center gap-1 bg-white border border-gray-200 shadow-lg rounded-lg p-1 animate-in fade-in zoom-in-95 duration-200"
                >
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="h-8 px-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-black"
                    >
                        H2
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className="h-8 px-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-black"
                    >
                        H3
                    </Button>

                    <div className="w-px h-4 bg-gray-300 mx-1" />

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100 hover:text-black"
                    >
                        <List className="w-4 h-4" />
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100 hover:text-black"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-4 bg-gray-300 mx-1" />

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100 hover:text-black"
                    >
                        <Quote className="w-4 h-4" />
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