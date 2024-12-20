interface TagProps {
  value: string;
  onClick: () => void;
  isSelected: boolean;
  tooltip?: string;
}

function Tag({ value, onClick, isSelected, tooltip }: TagProps) {
  return (
    <span
      onClick={onClick}
      className={`tag ${isSelected ? "tag--selected" : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      title={tooltip}
    >
      {value}
    </span>
  );
}

export default Tag;
