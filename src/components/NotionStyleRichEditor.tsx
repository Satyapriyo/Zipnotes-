"use client";

import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect } from "react";
// import {
//     darkDefaultTheme,
//     lightDefaultTheme,
//     Theme,
// } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
// import "./NotionStyleRichEditor.css";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useTheme } from "next-themes";
interface RichEditorProps {
    value: string;
}



export function NotionStyleRichEditor({ value }: RichEditorProps) {
    const editor = useCreateBlockNote();
    const { resolvedTheme } = useTheme();

    const blockNoteTheme: "light" | "dark" =
        resolvedTheme === "dark" ? "dark" : "light";

    useEffect(() => {
        async function load() {
            const blocks = await editor.tryParseMarkdownToBlocks(value);

            editor.replaceBlocks(editor.document, blocks);
        }

        load();
    }, [editor, value]);

    return <BlockNoteView editor={editor} theme={blockNoteTheme} />;
}