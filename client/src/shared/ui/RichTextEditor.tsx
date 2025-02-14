import { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import Dropcursor from "@tiptap/extension-dropcursor";
import Placeholder from "@tiptap/extension-placeholder";

import Button from "./Button";
import FileUploader from "./FileUploader";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageFilesChange?: (map: Map<string, File>) => void;
  placeholder?: string;
  limit?: number;
}

function RichTextEditor({
  value,
  onChange,
  onImageFilesChange,
  placeholder = "Write something...",
  limit = 250,
}: RichTextEditorProps) {
  const imageFiles = useRef<Map<string, File>>(new Map());

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      Bold,
      Italic,
      Strike,
      Underline,
      CharacterCount.configure({ limit }),
      Image,
      Dropcursor,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const handleFileUpload = (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          const imageSrc = URL.createObjectURL(file);

          editor.chain().focus().setImage({ src: imageSrc }).run();

          imageFiles.current.set(imageSrc, file);

          if (onImageFilesChange) {
            onImageFilesChange(imageFiles.current);
          }
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const percentage = editor
    ? Math.round((100 / limit) * editor.storage.characterCount.characters())
    : 0;

  return (
    <div className="rich-text-editor">
      <div className="toolbar" aria-label="Text Formatting Toolbar">
        <div className="button-group">
          <Button
            variant="basic"
            aria-label="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            additionalClasses={editor.isActive("bold") ? "active" : ""}
          >
            <strong>B</strong>
          </Button>

          <Button
            variant="basic"
            aria-label="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            additionalClasses={editor.isActive("italic") ? "active" : ""}
          >
            <em>I</em>
          </Button>

          <Button
            variant="basic"
            aria-label="Strike Through"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            additionalClasses={editor.isActive("strike") ? "active" : ""}
          >
            <s>S</s>
          </Button>
          <Button
            variant="basic"
            aria-label="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            additionalClasses={editor.isActive("underline") ? "active" : ""}
          >
            <u>U</u>
          </Button>

          {/* <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ marginTop: "10px" }}
          /> */}
          <FileUploader onFileChange={handleFileUpload} accept="image/*" />
        </div>
      </div>

      <EditorContent editor={editor} className="editor" />

      <div
        className={`character-count ${
          editor.storage.characterCount.characters() === limit
            ? "character-count--warning"
            : ""
        }`}
      >
        <svg height="20" width="20" viewBox="0 0 20 20">
          <circle r="10" cx="10" cy="10" fill="#e9ecef" />
          <circle
            r="5"
            cx="10"
            cy="10"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
            transform="rotate(-90) translate(-20)"
          />
          <circle r="6" cx="10" cy="10" fill="white" />
        </svg>
        {editor.storage.characterCount.characters()} / {limit} characters
      </div>
    </div>
  );
}

export default RichTextEditor;
