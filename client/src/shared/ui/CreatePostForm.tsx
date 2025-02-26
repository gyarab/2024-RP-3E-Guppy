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
  const [tagSearch, setTagSearch] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const [uploadImage, { isLoading: isUploadLoading }] =
    useUploadImageMutation();
  const [createPost, { isLoading: isPostLoading }] = useCreatePostMutation();

  const filteredTags = tagOptions.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

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

  const handleClickOutside = (e: MouseEvent) => {
    if (
      titleInputRef.current &&
      !titleInputRef.current.contains(e.target as Node)
    ) {
      setIsEditingTitle(false);
    }
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setIsEditingTitle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title cannot be empty.");
      return;
    }

    const imageMap = new Map();
    for (const [placeholder, file] of imageFiles) {
      const { data: url } = await uploadImage({ file, type: "post" });
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

  const handleTagSelect = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagSearch("");
    setHighlightedIndex(-1);
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setTagSearch(e.target.value);
  //   setHighlightedIndex(-1);
  // };

  const fetchAnswers = async (query: string) => {
    const allAnswers = [
      "How to use React state?",
      "What is the best way to manage CSS in React?",
      "Differences between Next.js and React?",
    ];

    return allAnswers.filter((answer) =>
      answer.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleTagInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = e.target.value;
    setTagSearch(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = tagOptions.filter((tag) =>
      tag.toLowerCase().includes(query.toLowerCase())
    );

    const fetchedAnswers = await fetchAnswers(query);

    setSearchResults(fetchedAnswers);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredTags.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredTags.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();

      if (highlightedIndex >= 0 && filteredTags.length > 0) {
        handleTagSelect(filteredTags[highlightedIndex]);
      } else if (tagSearch.trim()) {
        handleAddNewTag();
      }
    } else if (e.key === "Escape") {
      setTagSearch("");
      setHighlightedIndex(-1);
    }
  };

  const handleAddNewTag = () => {
    if (tagSearch.trim() && !tags.includes(tagSearch)) {
      setTags([...tags, tagSearch]);
      setTagOptions([...tagOptions, tagSearch]);
    }
    setTagSearch("");
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
              ref={tagInputRef}
              type="text"
              placeholder="Search or add a tag..."
              value={tagSearch}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
            />
          </div>

          {/* Tag suggestions dropdown
          {tagSearch && filteredTags.length > 0 && (
            <div className="tag-dropdown">
              {filteredTags.map((tag, index) => (
                <div
                  key={tag}
                  className={`tag-dropdown-item ${
                    index === highlightedIndex ? "highlighted" : ""
                  }`}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          )} */}
          {tagSearch && (
            <div className="tag-dropdown">
              {/* Show matching tags */}
              {filteredTags.length > 0 && (
                <>
                  <h5>Tags</h5>
                  {filteredTags.map((tag, index) => (
                    <div
                      key={tag}
                      className={`tag-dropdown-item ${
                        index === highlightedIndex ? "highlighted" : ""
                      }`}
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </>
              )}

              {/* Show relevant answers */}
              {searchResults.length > 0 && (
                <>
                  <h5>Answers</h5>
                  {searchResults.map((answer) => (
                    <div
                      key={answer}
                      className="tag-dropdown-item answer-item"
                      onClick={() => console.log(`Navigating to: ${answer}`)}
                    >
                      {answer}
                    </div>
                  ))}
                </>
              )}
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
