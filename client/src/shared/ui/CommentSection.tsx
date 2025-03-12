import Button from "./Button";
import Comment from "./Comment";

// import { Comment as IComment } from "../interfaces/Comment";
import { useGetPostCommentsQuery } from "../../features/post/postApi";
import Loader from "./Loader";

interface CommentSectionProps {
  postId: number;
}

function CommentSection({ postId }: CommentSectionProps) {
  const { data: comments, isLoading } = useGetPostCommentsQuery(postId);

  return (
    <>
      {isLoading && <Loader />}
      <div className="comment-section">
        {comments?.map((comment) => (
          <Comment key={comment.id} data={comment} />
        ))}
        {/* <Button variant="basic">Load More Comments</Button> */}
      </div>
    </>
  );
}

export default CommentSection;
