import { useState } from "react";

import {
  useAddCommentMutation,
  useGetCommentsByPostIdQuery,
} from "../../features/comments/commentApi";
import { isApiError } from "../utils/helpers";

import Comment from "./Comment";
import Loader from "./Loader";
import Button from "./Button";

interface CommentSectionProps {
  postId: number;
}

function CommentSection({ postId }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: comments, isLoading } = useGetCommentsByPostIdQuery(postId);
  const [addComment, { isLoading: isAdding }] = useAddCommentMutation();

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addComment({ postId, content: commentText }).unwrap();
      setCommentText("");
    } catch (error) {
      if (isApiError(error)) {
        setErrorMessage(error.data.message);
      }
    }
  };

  return (
    <div className="comment-section">
      {isLoading && <Loader />}
      <div className="comment-input">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={isAdding}
          className="comment-input__field"
        />
        <Button
          variant="primary"
          size="small"
          onClick={handleAddComment}
          disabled={isAdding || !commentText.trim()}
          noArrow
        >
          {isAdding ? "Posting..." : "Comment"}
        </Button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {isLoading ? (
        <Loader />
      ) : comments?.length ? (
        comments.map((comment) => <Comment key={comment.id} data={comment} />)
      ) : (
        <p className="no-comments">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
}

export default CommentSection;
