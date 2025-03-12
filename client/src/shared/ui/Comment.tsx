import { useState } from "react";

import Avatar from "./Avatar";
import Button from "./Button";

import { formatRelativeDate } from "../utils/formatRelativeDate";
import { Comment as IComment } from "../interfaces/Comment";

interface CommentProps {
  data: IComment;
}

function Comment({ data }: CommentProps) {
  const [isLiked, setIsLiked] = useState(data.hasLiked);
  const [likeCount, setLikeCount] = useState(data.likes);

  const handleLikeClick = () => {
    setIsLiked((prev) => !prev);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    // TODO: send request to the server
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
            <div className="like">
              <svg
                className="like-icon"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ fill: isLiked ? "#fc4e4e" : "#505050" }}
              >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"></path>
              </svg>
            </div>
            <span className="like-count">{likeCount}</span>
          </Button>
        </p>
        <div className="comment__actions">
          <Button variant="basic">Reply</Button>
        </div>
      </div>
    </div>
  );
}

export default Comment;
