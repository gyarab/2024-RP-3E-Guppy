import React, { useEffect, useRef, useState } from "react";
import Fuse from "fuse.js";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";

import {
  useCreatePostMutation,
  useGetAllTagsQuery,
} from "../../features/post/postApi";
import { useUploadImageMutation } from "../../features/upload/uploadApi";
import { selectUser } from "../../features/auth/authSlice";

import Avatar from "./Avatar";
import Button from "./Button";
import Loader from "./Loader";
import RichTextEditor from "./RichTextEditor";
import TagChip from "./TagChip";
import PollForm from "./PollForm";

import { imageUrl } from "../utils/imageUrl";

function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState<Map<string, File>>(new Map());
  const [tags, setTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isPollActive, setIsPollActive] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const user = useSelector(selectUser);
  const orgId = sessionStorage.getItem("orgId");

  if (!orgId) {
    return (
      <div className="container feed-container">
        <p>
          No organization selected. Please select an organization to create a
          post.
        </p>
      </div>
    );
  }

  const [uploadImage, { isLoading: isUploadLoading }] =
    useUploadImageMutation();
  const [createPost, { isLoading: isPostLoading }] = useCreatePostMutation();
  const { data: fetchedTags, isLoading: isTagsLoading } = useGetAllTagsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: false,
    }
  );

  const tagOptions = fetchedTags?.map((tag) => tag.name) ?? [];

  const fuse = new Fuse(tagOptions ?? [], {
    threshold: 0.35,
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
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditingTitle(false);
    }
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
        imageMap.set(placeholder, imageUrl(url));
      }
    }

    let updatedContent = content;
    for (const [placeholder, url] of imageMap) {
      updatedContent = updatedContent.replace(
        new RegExp(`src="${placeholder}"`, "g"),
        `src="${url}"`
      );
    }

    await createPost({
      title,
      content: updatedContent,
      tags,
      orgId: parseInt(orgId),
    });
  };

  const handleEditClick = () => {
    setIsEditingTitle(true);
    titleInputRef.current?.focus();
  };

  const handlePollToggle = () => {
    setIsPollActive((prev) => !prev);
  };

  return (
    <>
      {(isPostLoading || isUploadLoading || isTagsLoading) && <Loader />}
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="post-form__header">
          <div className="title-editor">
            {isEditingTitle ? (
              <>
                <input
                  className="post-form__input"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  ref={titleInputRef}
                  onKeyDown={handleTitleKeyDown}
                />
                <Button
                  additionalClasses="post-form__button"
                  onClick={() => setIsEditingTitle(false)}
                  size="small"
                  noArrow
                >
                  Done
                </Button>
              </>
            ) : (
              <div className="post-form__title">
                <h3>{title || "New Post"}</h3>
                <img
                  src="/icons/pencil.svg"
                  alt="Edit"
                  onClick={handleEditClick}
                  className="edit-icon"
                />
              </div>
            )}
          </div>
          <Avatar
            src={user?.profilePictureUrl || "/images/avatar.png"}
            text={user?.name}
            secondaryText={user?.email}
          />
        </div>

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
          <div className="tags-list">
            <AnimatePresence>
              {tags.map((tag) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  removable
                  onRemove={handleTagRemove}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        <RichTextEditor
          value={content}
          onChange={setContent}
          onImageFilesChange={setImageFiles}
        />

        {isPollActive ? (
          <PollForm onClose={handlePollToggle} />
        ) : (
          <Button
            type="button"
            size="small"
            additionalClasses="add-poll-button"
            onClick={handlePollToggle}
            noArrow
          >
            Add Poll
          </Button>
        )}
        <Button type="submit">Create Post</Button>
      </form>
    </>
  );
}

export default CreatePostForm;
