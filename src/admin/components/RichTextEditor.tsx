import { useEffect, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import {
  LuBold,
  LuItalic,
  LuHeading2,
  LuHeading3,
  LuList,
  LuListOrdered,
  LuQuote,
  LuLink,
  LuUnlink,
  LuUndo,
  LuRedo,
  LuMinus,
  LuImage,
  LuUpload,
} from "react-icons/lu";
import { cn } from "../../lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton = ({
  onClick,
  active,
  disabled,
  title,
  children,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "w-9 h-9 flex items-center justify-center border border-transparent transition-all disabled:opacity-30",
      active
        ? "bg-gold text-black"
        : "text-foreground/60 hover:text-gold hover:border-border",
    )}
  >
    {children}
  </button>
);

const Toolbar = ({
  editor,
  onUploadImage,
}: {
  editor: Editor;
  onUploadImage: () => void;
}) => {
  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previous ?? "https://");
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const addImageByUrl = () => {
    const url = window.prompt("Enter image URL", "https://");
    if (!url) return; // cancelled or empty
    const alt = window.prompt("Alt text (optional)", "") ?? "";
    editor.chain().focus().setImage({ src: url, alt }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border border-border border-b-0 p-2 bg-muted/5">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <LuBold size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <LuItalic size={16} />
      </ToolbarButton>

      <span className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <LuHeading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <LuHeading3 size={16} />
      </ToolbarButton>

      <span className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet list"
      >
        <LuList size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Numbered list"
      >
        <LuListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Quote"
      >
        <LuQuote size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Divider"
      >
        <LuMinus size={16} />
      </ToolbarButton>

      <span className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        onClick={setLink}
        active={editor.isActive("link")}
        title="Add link"
      >
        <LuLink size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        title="Remove link"
      >
        <LuUnlink size={16} />
      </ToolbarButton>

      <span className="w-px h-6 bg-border mx-1" />

      <ToolbarButton onClick={addImageByUrl} title="Insert image by URL">
        <LuImage size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={onUploadImage} title="Upload image">
        <LuUpload size={16} />
      </ToolbarButton>

      <span className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <LuUndo size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <LuRedo size={16} />
      </ToolbarButton>
    </div>
  );
};

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: { class: "rounded" },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Write your article...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-96 max-h-[70vh] overflow-y-auto border border-border p-6 focus:outline-none focus:border-gold transition-colors",
      },
    },
  });

  // Keep the editor in sync if the value is replaced externally (e.g. loading a
  // different post into the same editor instance).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset the input so selecting the same file again still fires onChange.
    e.target.value = "";
    if (!file || !editor) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file.");
      return;
    }
    // No upload backend yet — embed the image inline as a base64 data URL.
    // When the API is wired up, swap this for an upload call that returns a URL.
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      editor.chain().focus().setImage({ src, alt: file.name }).run();
    };
    reader.readAsDataURL(file);
  };

  if (!editor) return null;

  return (
    <div>
      <Toolbar
        editor={editor}
        onUploadImage={() => fileInputRef.current?.click()}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
