import { useEffect, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import {
  LuBold,
  LuItalic,
  LuUnderline,
  LuHeading2,
  LuHeading3,
  LuHeading4,
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

// Tiptap marks are inclusive by default, so typing after a styled run keeps the
// style — it reads as bleeding. Non-inclusive confines a mark to its selection.
const NonInclusiveBold = Bold.extend({ inclusive: false });
const NonInclusiveItalic = Italic.extend({ inclusive: false });
const NonInclusiveUnderline = Underline.extend({ inclusive: false });

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  invalid?: boolean;
}

const editorClass = (invalid?: boolean) =>
  cn(
    "tiptap min-h-96 max-h-[70vh] overflow-y-auto border p-6 focus:outline-none transition-colors",
    invalid
      ? "border-red-500 focus:border-red-500"
      : "border-border focus:border-gold",
  );

/**
 * Sanitizes HTML entering the editor, including web pastes. Their invisible
 * artifacts still occupy document positions, which drifts the visual selection
 * from the real one and makes marks appear to grab adjacent text.
 */
const cleanHtml = (html: string): string =>
  html
    // Empty inline wrappers, e.g. leftover footnote markers `<sup></sup>`.
    .replace(/<(sup|sub|span|strong|em|b|i|u|mark)\b[^>]*>\s*<\/\1>/gi, "")
    // Superscript/subscript aren't supported here — unwrap, keeping any text.
    .replace(/<\/?(?:sup|sub)\b[^>]*>/gi, "")
    // Non-breaking spaces look like spaces but break word selection.
    .replace(/&nbsp;|\u00A0/g, " ");

const buildEditorProps = (invalid?: boolean) => ({
  attributes: { class: editorClass(invalid) },
  transformPastedHTML: cleanHtml,
});

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
  invalid,
}: {
  editor: Editor;
  onUploadImage: () => void;
  invalid?: boolean;
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
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 border border-b-0 p-2 bg-muted/5",
        invalid ? "border-red-500" : "border-border",
      )}
    >
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
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Underline"
      >
        <LuUnderline size={16} />
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
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 4 }).run()
        }
        active={editor.isActive("heading", { level: 4 })}
        title="Heading 4"
      >
        <LuHeading4 size={16} />
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
  invalid,
}: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Replaced below with non-inclusive versions.
        bold: false,
        italic: false,
        underline: false,
        // Configured here because StarterKit v3 ships Link; adding a second
        // Link extension would duplicate-register it.
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      NonInclusiveBold,
      NonInclusiveItalic,
      NonInclusiveUnderline,
      Image.configure({
        inline: false,
        HTMLAttributes: { class: "rounded" },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Write your article...",
      }),
    ],
    // Set once — the editor is uncontrolled after mount, and PostEditorForm's
    // `key` remounts it per post. Syncing value→setContent instead would rebuild
    // the doc and drop the selection mid-edit.
    content: cleanHtml(value),
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: buildEditorProps(invalid),
  });

  // editorProps is fixed at init, so re-apply on an `invalid` flip. Rebuilding
  // the whole object also preserves the paste sanitizer.
  useEffect(() => {
    editor?.setOptions({ editorProps: buildEditorProps(invalid) });
  }, [editor, invalid]);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset the input so selecting the same file again still fires onChange.
    e.target.value = "";
    if (!file || !editor) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file.");
      return;
    }
    // Embedded as base64 for an instant preview; resolvePostImages swaps it for
    // a Cloudinary URL at save time.
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
        invalid={invalid}
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
