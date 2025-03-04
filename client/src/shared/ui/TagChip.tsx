import { motion } from "framer-motion";

interface TagChipProps {
  tag: string;
  removable?: boolean;
  onRemove?: (tag: string) => void;
}

function TagChip({ tag, removable = false, onRemove }: TagChipProps) {
  return (
    <motion.div
      className="tag-chip"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {tag}
      {removable && onRemove && (
        <span className="remove-tag" onClick={() => onRemove(tag)}>
          ✕
        </span>
      )}
    </motion.div>
  );
}

export default TagChip;
