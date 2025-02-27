import React, { useEffect, useRef, useState } from "react";
import Fuse from "fuse.js";

import { useCreatePostMutation } from "../../features/post/postApi";
import { useUploadImageMutation } from "../../features/upload/uploadApi";

import Avatar from "./Avatar";
import Button from "./Button";
import Loader from "./Loader";
import RichTextEditor from "./RichTextEditor";
import { AnimatePresence, motion, Reorder } from "framer-motion";

// TODO: Fetch initial tags from the server
const initialTags = [
  "React",
  "JavaScript",
  "CSS",
  "UI/UX",
  "Next.js",
  "Science",
  "Machine Learning",
  "Frontend",
  "Backend",
];

function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState<Map<string, File>>(new Map());
  const [tags, setTags] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>(initialTags);
  const [tagSearch, setTagSearch] = useState("");
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draggedTag, setDraggedTag] = useState<string | null>(null); // To track the currently dragged tag
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const titleInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const [uploadImage, { isLoading: isUploadLoading }] =
    useUploadImageMutation();
  const [createPost, { isLoading: isPostLoading }] = useCreatePostMutation();

  const fuse = new Fuse(tagOptions, {
    threshold: 0.35, // Allows minor typos
    includeScore: true,
  });

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        tagInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  // Close the dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    if (
      tagInputRef.current &&
      !tagInputRef.current.contains(e.target as Node)
    ) {
      setTagSearch("");
      setFilteredTags([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setTagSearch(query);

    if (!query.trim()) {
      setHighlightedIndex(-1);
      setFilteredTags([]);
      return;
    }

    const results = fuse.search(query);
    setFilteredTags(results.map((result) => result.item));

    setHighlightedIndex(0); // Auto-highlight the best match (first result)
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
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredTags.length > 0) {
        handleTagSelect(filteredTags[highlightedIndex]);
      } else if (tagSearch.trim()) {
        handleAddNewTag();
      }
    } else if (e.key === "Escape") {
      setTagSearch("");
      setHighlightedIndex(-1);
      setFilteredTags([]);
    }
  };

  const handleTagSelect = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagSearch("");
    setHighlightedIndex(-1);
    setFilteredTags([]);
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddNewTag = () => {
    if (tagSearch.trim() && !tags.includes(tagSearch)) {
      setTags([...tags, tagSearch]);
      setTagOptions([...tagOptions, tagSearch]);
    }
    setTagSearch("");
    setFilteredTags([]);
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

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    e.dataTransfer.setData("tagIndex", index.toString());
  };

  const handleDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData("tagIndex"));
    if (draggedIndex !== index) {
      const updatedTags = [...tags];
      const [removedTag] = updatedTags.splice(draggedIndex, 1);
      updatedTags.splice(index, 0, removedTag);
      setTags(updatedTags);
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
                ref={titleInputRef}
              />
            ) : (
              <div className="post-form__title">
                <h3>{title || "New Post"}</h3>
                <img
                  src="/icons/pencil.svg"
                  alt="Edit"
                  onClick={() => setIsEditingTitle(true)}
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
          {/* Tag suggestions dropdown */}
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
          )}
          {/* Selected tags display */}
          {/* <div className="tags-list">
            {tags.map((tag, index) => (
              <div
                key={tag}
                className="tag-chip"
                onDragStart={handleDragStart(index)}
                onDrop={handleDrop(index)}
                onDragOver={(e) => e.preventDefault()}
                draggable
              >
                {tag}
                <span
                  className="remove-tag"
                  onClick={() => handleTagRemove(tag)}
                >
                  ✕
                </span>
              </div>
            ))}
          </div> */}
          {/* Selected tags display with animation */}
          {/* <Reorder.Group
            as="div"
            axis="y"
            values={tags}
            onReorder={handleReorder}
            className="tags-list"
          >
            <AnimatePresence>
              {tags.map((tag) => (
                <Reorder.Item
                  key={tag}
                  value={tag}
                  className="tag-chip"
                  layout
                  drag
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {tag}
                  <span
                    className="remove-tag"
                    onClick={() => handleTagRemove(tag)}
                  >
                    ✕
                  </span>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group> */}
          <div className="tags-list">
            <AnimatePresence>
              <Reorder.Group
                axis="x" // Makes tags reorder horizontally
                values={tags}
                onReorder={setTags}
                className="tag-container"
              >
                {tags.map((tag) => (
                  <Reorder.Item
                    key={tag}
                    value={tag}
                    className="tag-chip"
                    whileDrag={{ scale: 1.1, zIndex: 10 }}
                    dragElastic={0.3}
                    dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
                    initial={{ opacity: 0, scale: 0.5 }} // Initial state for appearance
                    animate={{ opacity: 1, scale: 1 }} // Animation on appearance
                  >
                    {tag}
                    <span
                      className="remove-tag"
                      onClick={() => handleTagRemove(tag)}
                    >
                      ✕
                    </span>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </AnimatePresence>
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
