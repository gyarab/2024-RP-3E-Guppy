import { Comment as IComment } from "../interfaces/Comment";
import Button from "./Button";
import Comment from "./Comment";

interface CommentSectionProps {
  comments: IComment[];
  onLoadMore: () => void;
}

function CommentSection({ comments, onLoadMore }: CommentSectionProps) {
  return (
    <div className="comment-section">
      {comments.map((comment) => (
        <Comment key={comment.id} data={comment} />
      ))}
      <Button variant="basic" onClick={onLoadMore}>
        Load More Comments
      </Button>
    </div>
  );
}

export default CommentSection;
