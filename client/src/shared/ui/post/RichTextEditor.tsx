import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";

// Extensions for the text editor
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Image from "@tiptap/extension-image";

import { capitalize } from "../../utils/capitalize";
import { useState } from "react";
import FileUploader from "../FileUploader";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [isDragging, setIsDragging] = useState(false);

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      Bold,
      Italic,
      Strike,
      BulletList,
      OrderedList,
      ListItem,
      Image,
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const handleImageUpload = (file: File | null) => {
    if (!file) {
      editor.chain().focus().deleteSelection().run();
      return;
    }

    if (!file.type.startsWith("image/")) {
      console.error("Unsupported file type:", file.name);
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      editor
        .chain()
        .focus()
        .setImage({ src: event.target?.result as string })
        .run();
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    handleImageUpload(files[0]);
  };

  return (
    <div
      className={`rich-text-editor ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="toolbar" aria-label="Text Formatting Toolbar">
        <div className="button-group">
          <button
            type="button"
            aria-label="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "active" : ""}
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            aria-label="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "active" : ""}
          >
            <em>I</em>
          </button>

          <button
            type="button"
            aria-label="Strike Through"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "active" : ""}
          >
            <s>S</s>
          </button>
        </div>

        <div className="button-group">
          <button
            type="button"
            aria-label="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "active" : ""}
          >
            • List
          </button>

          <button
            type="button"
            aria-label="Ordered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "active" : ""}
          >
            1. List
          </button>
        </div>
      </div>

      <BubbleMenu editor={editor} className="bubble-menu">
        {["bold", "italic", "strike"].map((mark) => (
          <button
            type="button"
            key={mark}
            onClick={() =>
              (editor.chain().focus() as any)
                [`toggle${capitalize(mark)}`]()
                .run()
            }
            className={editor.isActive(mark) ? "active" : ""}
          >
            {capitalize(mark)}
          </button>
        ))}
      </BubbleMenu>

      <EditorContent editor={editor} className="editor" />

      <FileUploader onFileChange={handleImageUpload} accept="image/*" />
    </div>
  );
}

export default RichTextEditor;
