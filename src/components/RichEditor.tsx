'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo2,
    Redo2,
} from 'lucide-react';
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
            }),
            Image,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url })
                .run();
        }
    };

    const addImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-3 flex flex-wrap gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-gray-200' : ''}
                >
                    <Bold className="w-4 h-4" />
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-gray-200' : ''}
                >
                    <Italic className="w-4 h-4" />
                </Button>

                <div className="w-px bg-gray-300" />

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
                >
                    <Heading2 className="w-4 h-4" />
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
                >
                    <Heading3 className="w-4 h-4" />
                </Button>

                <div className="w-px bg-gray-300" />

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
                >
                    <List className="w-4 h-4" />
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>

                <div className="w-px bg-gray-300" />

                <Button
                    size="sm"
                    variant="outline"
                    onClick={addLink}
                >
                    <LinkIcon className="w-4 h-4" />
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={addImage}
                >
                    <ImageIcon className="w-4 h-4" />
                </Button>

                <div className="w-px bg-gray-300" />

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <Undo2 className="w-4 h-4" />
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <Redo2 className="w-4 h-4" />
                </Button>
            </div>

            {/* Editor */}
            <EditorContent
                editor={editor}
                className="prose max-w-none p-6 min-h-96 focus:outline-none"
            />
        </div>
    );
}
