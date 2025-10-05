"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";
import { Highlight } from "@tiptap/extension-highlight";
import { CodeBlockButton } from "../tiptap-ui/code-block-button";
import { BlockquoteButton } from "../tiptap-ui/blockquote-button";
import { ColorHighlightPopover } from "../tiptap-ui/color-highlight-popover";
import { HeadingDropdownMenu } from "../tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "../tiptap-ui/list-dropdown-menu";
import { MarkButton } from "../tiptap-ui/mark-button";
import { TextAlignButton } from "../tiptap-ui/text-align-button";
import { UndoRedoButton } from "../tiptap-ui/undo-redo-button";
import { LinkPopover } from "../tiptap-ui/link-popover";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Write something amazing...",
}: RichTextEditorProps): React.ReactElement {
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder,
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none px-4 py-1",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    content,
    autofocus: false,
    editable: true,
    injectCSS: true,
    immediatelyRender: false,
  });

  useEffect(() => {
    setIsClient(true);
    setIsMounted(true);
  }, []);

  if (!isClient || !isMounted || !editor) {
    return (
      <div className="border rounded-lg p-4 min-h-[200px] bg-muted/50">
        Loading editor...
      </div>
    );
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageInput(false);
    }
  };

  const setLink = () => {
    if (linkUrl && editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b p-2 flex flex-wrap gap-1 items-center">
        <UndoRedoButton
          editor={editor}
          action="undo"
          hideWhenUnavailable={true}
          showShortcut={false}
          onExecuted={() => console.log("Action executed!")}
        />
        <UndoRedoButton
          editor={editor}
          action="redo"
          hideWhenUnavailable={true}
          showShortcut={false}
          onExecuted={() => console.log("Action executed!")}
        />
        <div className=" border-r-2 border-muted-foreground h-6 w-2 p-0" />

        <HeadingDropdownMenu
          editor={editor}
          levels={[1, 2, 3, 4, 5, 6]}
          hideWhenUnavailable={true}
          portal={false}
          onOpenChange={(isOpen) =>
            console.log("Dropdown", isOpen ? "opened" : "closed")
          }
        />
        <ListDropdownMenu
          editor={editor}
          types={["bulletList", "orderedList", "taskList"]}
          hideWhenUnavailable={true}
          portal={false}
          onOpenChange={(isOpen) => console.log("Dropdown opened:", isOpen)}
        />
        <BlockquoteButton
          editor={editor}
          text="Quote"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Blockquote toggled!")}
        />
        <div className=" border-r-2 border-muted-foreground h-6 w-2 p-0" />
        <MarkButton
          editor={editor}
          type="bold"
          hideWhenUnavailable={true}
          showShortcut={false}
          onToggled={() => console.log("Mark toggled!")}
        />
        <MarkButton
          type="italic"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Mark toggled!")}
        />
        <MarkButton
          type="underline"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Mark toggled!")}
        />
        <MarkButton
          type="strike"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Mark toggled!")}
        />
        <ColorHighlightPopover
          editor={editor}
          hideWhenUnavailable={true}
          onApplied={({ color, label }) =>
            console.log(`Applied highlight: ${label} (${color})`)
          }
        />
        <LinkPopover
          editor={editor}
          hideWhenUnavailable={true}
          autoOpenOnLinkActive={true}
          onSetLink={() => console.log("Link set!")}
          onOpenChange={(isOpen) => console.log("Popover opened:", isOpen)}
        />
        <div className=" border-r-2 border-muted-foreground h-6 w-2 p-0" />
        <MarkButton
          type="code"
          text="Code"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Mark toggled!")}
        />
        <CodeBlockButton
          editor={editor}
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Code block toggled!")}
        />
        <div className=" border-r-2 border-muted-foreground h-6 w-2 p-0" />

        <TextAlignButton
          editor={editor}
          align="left"
          hideWhenUnavailable={true}
          showShortcut={true}
          onAligned={() => console.log("Text aligned!")}
        />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
        <div className=" border-r-2 border-muted-foreground h-6 w-2 p-0" />
      </div>

      {showImageInput && (
        <div className="p-2 border-b flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL..."
            className="flex-1 px-2 py-1 border rounded text-sm"
          />
          <Button type="button" onClick={addImage} size="sm">
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowImageInput(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {showLinkInput && (
        <div className="p-2 border-b flex gap-2">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter link URL..."
            className="flex-1 px-2 py-1 border rounded text-sm"
          />
          <Button type="button" onClick={setLink} size="sm">
            Set Link
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowLinkInput(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      <div className="p-4 min-h-[300px] prose max-w-none">
        <EditorContent editor={editor} className="outline-none" />
      </div>
    </div>
  );
}
