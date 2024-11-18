import { useState } from "react";
import Tag from "./Tag";

function TagList({ tags }: { tags: string[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="tag-list">
      <section className="tag-list__selected">
        <h4 className="tag-list__title">Selected Tags:</h4>
        <div className="tag-list__content tag-list__content--selected">
          {selectedTags.length ? (
            <div className="tag-list__tags tag-list__tags--selected">
              {selectedTags.map((tag, index) => (
                <Tag
                  key={index}
                  value={tag}
                  onClick={() => handleTagClick(tag)}
                  isSelected
                  showRemoveIcon
                />
              ))}
            </div>
          ) : (
            <p className="tag-list__placeholder">No tags selected</p>
          )}
        </div>
      </section>

      <section className="tag-list__available">
        <h4 className="tag-list__title">Available Tags:</h4>
        <div className="tag-list__content tag-list__content--available">
          <div className="tag-list__tags">
            {tags.map((tag, index) => (
              <Tag
                key={index}
                value={tag}
                onClick={() => {
                  if (!selectedTags.includes(tag)) {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
                isSelected={selectedTags.includes(tag)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default TagList;
