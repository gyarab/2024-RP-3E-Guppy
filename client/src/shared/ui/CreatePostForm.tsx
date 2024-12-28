import React, { useEffect, useRef, useState } from "react";

import { useCreatePostMutation } from "../../features/post/postApi";
import { useUploadImageMutation } from "../../features/upload/uploadApi";

import Avatar from "./Avatar";
import Button from "./Button";
import Loader from "./Loader";
import RichTextEditor from "./RichTextEditor";

function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState<Map<string, File>>(new Map());
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  const [uploadImage, { isLoading: isUploadLoading }] =
    useUploadImageMutation();
  const [createPost, { isLoading: isPostLoading }] = useCreatePostMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const imageMap = new Map();
    for (const [placeholder, file] of imageFiles) {
      const { data: url } = await uploadImage(file);
      if (url) {
        imageMap.set(placeholder, `http://localhost:3000/${url}`);
      }
    }

    let updatedContent = content;
    for (const [placeholder, url] of imageMap) {
      updatedContent = updatedContent.replace(
        new RegExp(`src="${placeholder}"`, "g"),
        `src="${url}"`
      );
    }

    await createPost({ title, content: updatedContent });
  };

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
    if (e.key === "Enter" || e.key === "Escape") {
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
    <>
      {(isPostLoading || isUploadLoading) && <Loader />}
      <form className="post-form" onSubmit={handleSubmit}>
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
            src="https://i.pravatar.cc/50"
            text="Milan Tucek"
            secondaryText="UI & UX Developer"
          />
        </div>
        <RichTextEditor
          value={content}
          onChange={setContent}
          onImageFilesChange={setImageFiles}
        />
        <Button type="submit">Create Post</Button>
      </form>
    </>
  );
}

export default CreatePostForm;
