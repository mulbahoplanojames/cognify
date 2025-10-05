"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import Code from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import {
  Details,
  DetailsSummary,
  DetailsContent,
} from "@tiptap/extension-details";

import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link2,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  CodeIcon,
  SquareDashedBottomCode,
  ReceiptText,
} from "lucide-react";
import { useState, useEffect } from "react";

import { lowlight } from "lowlight";
import { CodeBlockButton } from "../tiptap-ui/code-block-button";
import { BlockquoteButton } from "../tiptap-ui/blockquote-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
} from "../tiptap-ui/color-highlight-popover";
import { HeadingDropdownMenu } from "../tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "../tiptap-ui/list-dropdown-menu";
import { MarkButton } from "../tiptap-ui/mark-button";

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
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Code.configure({
        HTMLAttributes: {
          class: "my-custom-class",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TableKit,
      Details.configure({
        persist: true,
        HTMLAttributes: {
          class: "details",
        },
      }),
      DetailsSummary,
      DetailsContent,
      Placeholder.configure({
        includeChildren: true,
        placeholder: ({ node }) => {
          if (node.type.name === "detailsSummary") {
            return "Summary";
          }
          return "";
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    content,
    autofocus: false,
    editable: true,
    injectCSS: true,
    // @ts-ignore - The type definition might not include this option yet
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
        <div className=" border-r-2 border-muted-foreground h-6 w-2 p-0" />

        <div className=" border-r-2 border-muted-foreground h-6 w-2 p-0" />
        <TextAlignButton
          editor={editor}
          align="left"
          text="Left"
          hideWhenUnavailable={true}
          showShortcut={true}
          onAligned={() => console.log("Text aligned!")}
        />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
        <CodeBlockButton
          editor={editor}
          text="Code"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Code block toggled!")}
        />
        <BlockquoteButton
          editor={editor}
          text="Quote"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Blockquote toggled!")}
        />
        <ColorHighlightPopover
          editor={editor}
          hideWhenUnavailable={true}
          onApplied={({ color, label }) =>
            console.log(`Applied highlight: ${label} (${color})`)
          }
        />
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
        <MarkButton
          editor={editor}
          type="bold"
          text="Bold"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Mark toggled!")}
        />
        <MarkButton
          type="italic"
          text="Italic"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Mark toggled!")}
        />
        <MarkButton
          type="strike"
          text="Strike"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Mark toggled!")}
        />
        <MarkButton
          type="code"
          text="Code"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Mark toggled!")}
        />
        <MarkButton
          type="underline"
          text="Underline"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Mark toggled!")}
        />
        <MarkButton
          type="superscript"
          text="Superscript"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Mark toggled!")}
        />
        <MarkButton
          type="subscript"
          text="Subscript"
          hideWhenUnavailable={true}
          showShortcut={true}
          onToggled={() => console.log("Mark toggled!")}
        />
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
