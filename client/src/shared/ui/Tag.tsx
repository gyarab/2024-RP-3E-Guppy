interface TagProps {
  value: string;
  onClick: () => void;
  isSelected?: boolean;
  showRemoveIcon?: boolean;
}

function Tag({ value, onClick, isSelected, showRemoveIcon }: TagProps) {
  return (
    <span
      onClick={onClick}
      className={`tag ${isSelected ? "tag--selected" : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      {value}
      {showRemoveIcon && (
        <span
          className="tag__remove-icon"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          &times;
        </span>
      )}
    </span>
  );
}

export default Tag;
