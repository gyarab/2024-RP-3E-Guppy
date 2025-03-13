import { useState } from "react";

import Avatar from "./Avatar";
import Button from "./Button";

import { formatRelativeDate } from "../utils/formatRelativeDate";
import { Comment as IComment } from "../interfaces/Comment";
import { useLikeCommentMutation } from "../../features/comments/commentApi";
import LikeIcon from "./LikeIcon";

interface CommentProps {
  data: IComment;
}

function Comment({ data }: CommentProps) {
  const [isLiked, setIsLiked] = useState(data.hasLiked);
  const [likeCount, setLikeCount] = useState(data.likes);

  const [likeComment] = useLikeCommentMutation();

  const handleLikeClick = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));

    try {
      await likeComment(data.id).unwrap();
    } catch (error) {
      console.error("Error liking post:", error);
      setIsLiked(!newLikedState);
      setLikeCount((prev) => (newLikedState ? prev - 1 : prev + 1));
    }
  };

  return (
    <div className="comment">
      <Avatar src={data.author.profilePictureUrl} />
      <div className="comment__body">
        <div className="comment__header">
          <span className="comment__author">{data.author.name}</span>
          <time
            dateTime={new Date(data.createdAt).toISOString()}
            className="comment__date"
          >
            {formatRelativeDate(new Date(data.createdAt))}
          </time>
        </div>
        <p className="comment__content">
          <span>{data.content}</span>
          <Button variant="basic" size="small" onClick={handleLikeClick}>
            <LikeIcon isLiked={isLiked} />
            <span className="like-count">{likeCount}</span>
          </Button>
        </p>
      </div>
    </div>
  );
}

export default Comment;
