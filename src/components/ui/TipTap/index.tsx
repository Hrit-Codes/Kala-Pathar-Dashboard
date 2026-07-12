"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import "./style.css";
import { useEffect, useState } from "react";

interface TiptapEditorProps {
  onChange?: (html: string) => void;
  initialContent?: string;
  placeholder?: string;
  error?: boolean;
}

export const TiptapEditor = ({
  onChange,
  initialContent = "",
  placeholder = "Write your response...",
  error = false,
}: TiptapEditorProps) => {
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: initialContent,
    onCreate: ({ editor }) => {
      setIsEditorEmpty(editor.isEmpty);
    },
    onUpdate: ({ editor }) => {
      setIsEditorEmpty(editor.isEmpty);
      onChange?.(editor.getHTML());
    },
    onTransaction: ({ editor }) => {
      setIsEditorEmpty(editor.isEmpty);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[280px] text-neutral-800 leading-relaxed tracking-wide text-sm px-5 py-4",
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent || "");
      setIsEditorEmpty(editor.isEmpty);
    }
  }, [editor, initialContent]);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    label,
    disabled = false,
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    label: string;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-all duration-150 cursor-pointer ${
        isActive
          ? "bg-primary-700 text-white shadow-sm"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
      title={label}
    >
      <Icon size={15} strokeWidth={2.5} />
    </button>
  );

  const Divider = () => <div className="w-px h-4 bg-neutral-200" />;

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-200 bg-white border ${
        error
          ? "ring-2 ring-red-500 border-red-500"
          : "border-neutral-200/80 focus-within:border-primary-500/50 focus-within:ring-1 focus-within:ring-primary-500/20"
      }`}
    >
      {/* Modern Compact Inline Toolbar */}
      <div className="border-b border-neutral-100 bg-neutral-50/50 px-3 py-1.5 flex flex-wrap gap-1 items-center">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={Bold}
          label="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={Italic}
          label="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          icon={Strikethrough}
          label="Strikethrough"
        />

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          label="Subheading"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          icon={Quote}
          label="Quote"
        />

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={List}
          label="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={ListOrdered}
          label="Numbered List"
        />

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          icon={AlignLeft}
          label="Align Left"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          icon={AlignCenter}
          label="Align Center"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          icon={AlignRight}
          label="Align Right"
        />

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo}
          label="Undo"
          disabled={!editor.can().undo()}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo}
          label="Redo"
          disabled={!editor.can().redo()}
        />
      </div>

      {/* Interactive Editor Dynamic Content Workspace */}
      <div className="relative max-h-[360px] overflow-y-auto">
        <EditorContent editor={editor} />
        {isEditorEmpty && (
          <div className="absolute top-4 left-5 text-sm font-medium text-neutral-400 pointer-events-none select-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};