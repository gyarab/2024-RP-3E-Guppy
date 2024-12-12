import React from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

import FileInput from "../FileInput";
import { capitalize } from "../../utils/capitalize";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  console.count("editor render");

  const editor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: true })],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Image upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      const uploadedImageUrl = data.imageUrl;

      editor?.chain().focus().setImage({ src: uploadedImageUrl }).run();
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleHeadingChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const level = parseInt(event.target.value, 10) as HeadingLevel | 0;
    if (level === 0) {
      editor?.chain().focus().setParagraph().run();
    } else {
      editor?.chain().focus().toggleHeading({ level }).run();
    }
  };

  const getHeadingLevel = (editor: any): string => {
    for (let level = 1; level <= 6; level++) {
      if (editor.isActive("heading", { level })) {
        return level.toString();
      }
    }
    return "0";
  };

  if (!editor) return null;

  return (
    <div className="rich-text-editor">
      <div className="toolbar">
        <button
          type="button"
          aria-label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "active" : ""}
        >
          Bold
        </button>

        <button
          type="button"
          aria-label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "active" : ""}
        >
          Italic
        </button>

        <button
          type="button"
          aria-label="Strike Through"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "active" : ""}
        >
          Strike
        </button>

        <select onChange={handleHeadingChange} value={getHeadingLevel(editor)}>
          <option value="0">Paragraph</option>
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <option key={level} value={level}>
              Heading {level}
            </option>
          ))}
        </select>

        <button
          type="button"
          aria-label="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "active" : ""}
        >
          Bullet List
        </button>

        <button
          type="button"
          aria-label="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "active" : ""}
        >
          Ordered List
        </button>

        <button
          type="button"
          aria-label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          Undo
        </button>

        <button
          type="button"
          aria-label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          Redo
        </button>
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

      <div>
        <FileInput accept="image/*" onFileSelect={handleImageUpload} />
      </div>
    </div>
  );
}

export default RichTextEditor;
