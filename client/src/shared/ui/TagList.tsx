import { useState } from "react";
import Tag from "./Tag";
import Button from "./Button";

function TagList({ tags }: { tags: string[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTagSelection = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((prevTag) => prevTag !== tag)
        : [...prev, tag]
    );
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  const selectAllTags = () => {
    setSelectedTags(tags);
  };

  return (
    <div className="tags">
      <section className="tags__available">
        <h4 className="tags__title">Available Tags:</h4>
        <div className="tags__content">
          <div className="tags__list">
            {tags.map((tag, index) => (
              <Tag
                key={index}
                value={tag}
                onClick={() => toggleTagSelection(tag)}
                isSelected={selectedTags.includes(tag)}
                tooltip={
                  selectedTags.includes(tag)
                    ? "Click to deselect"
                    : "Click to select"
                }
              />
            ))}
          </div>
          <div className="tags__controls">
            <Button
              onClick={selectAllTags}
              size="small"
              disabled={selectedTags.length === tags.length}
              variant="primary"
              noArrow
            >
              Select All
            </Button>
            {selectedTags.length > 0 && (
              <Button
                onClick={clearAllTags}
                size="small"
                variant="primary"
                noArrow
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default TagList;
