import { useEffect, useRef, useState } from "react";

import RichTextEditor from "./RichTextEditor";
import Button from "../Button";
import Avatar from "../Avatar";

function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditingTitle]);

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditingTitle(false);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      titleInputRef.current &&
      !titleInputRef.current.contains(e.target as Node)
    ) {
      setIsEditingTitle(false);
    }
  };

  return (
    <form className="post-form">
      <div className="post-form__header">
        <div className="title-editor">
          {isEditingTitle ? (
            <input
              className="post-form__input"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleTitleSave}
              ref={titleInputRef}
            />
          ) : (
            <div className="post-form__title">
              <h3>{title || "New Post"}</h3>
              <img
                src="/icons/pencil.svg"
                alt="Pencil icon"
                onClick={handleTitleEdit}
                className="edit-icon"
              />
            </div>
          )}
        </div>
        <Avatar
          image="https://i.pravatar.cc/50"
          text="Milan Tucek"
          secondaryText="UI & UX Developer"
        />
      </div>
      <RichTextEditor value={content} onChange={setContent} />
      <Button type="submit">Create Post</Button>
    </form>
  );
}

export default CreatePostForm;
