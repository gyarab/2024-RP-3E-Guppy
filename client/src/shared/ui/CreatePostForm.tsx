import React, { useEffect, useRef, useState } from "react";

import { useCreatePostMutation } from "../../features/post/postApi";
import { useUploadImageMutation } from "../../features/upload/uploadApi";

import Avatar from "./Avatar";
import Button from "./Button";
import Loader from "./Loader";
import RichTextEditor from "./RichTextEditor";

const initialTags = ["React", "JavaScript", "CSS", "UI/UX", "Next.js"];

function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState<Map<string, File>>(new Map());
  const [tags, setTags] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>(initialTags);
  const [tagSearch, setTagSearch] = useState(""); // Search input for tags
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  const [uploadImage, { isLoading: isUploadLoading }] =
    useUploadImageMutation();
  const [createPost, { isLoading: isPostLoading }] = useCreatePostMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const imageMap = new Map();
    for (const [placeholder, file] of imageFiles) {
      const { data: url } = await uploadImage({
        file,
        type: "post",
      });
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

    await createPost({ title, content: updatedContent }); // TODO: include tags
  };

  const handleTagSelect = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagSearch(""); // Clear search input
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagSearch(e.target.value);
  };

  const handleAddNewTag = () => {
    if (tagSearch.trim() && !tags.includes(tagSearch)) {
      setTags([...tags, tagSearch]);
      setTagOptions([...tagOptions, tagSearch]); // Add new tag to options
    }
    setTagSearch(""); // Reset input field
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
        {/* Tag Selection UI */}
        <div className="tags-selector">
          <h4>Tags</h4>
          <div className="tag-input-container">
            <input
              type="text"
              placeholder="Search or add a tag..."
              value={tagSearch}
              onChange={handleTagInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleAddNewTag()}
            />
            <button type="button" onClick={handleAddNewTag}>
              Add
            </button>
          </div>

          {/* Tag suggestions dropdown */}
          {tagSearch && (
            <div className="tag-dropdown">
              {tagOptions
                .filter((tag) =>
                  tag.toLowerCase().includes(tagSearch.toLowerCase())
                )
                .map((tag) => (
                  <div
                    key={tag}
                    className="tag-dropdown-item"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </div>
                ))}
            </div>
          )}

          {/* Selected tags display */}
          <div className="tags-list">
            {tags.map((tag) => (
              <div key={tag} className="tag-chip">
                {tag}
                <span
                  className="remove-tag"
                  onClick={() => handleTagRemove(tag)}
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
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
