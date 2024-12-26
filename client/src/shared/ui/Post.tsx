import { forwardRef, useState } from "react";

import Avatar from "./Avatar";
import Button from "./Button";
import CommentSection from "./CommentSection";

import { truncate } from "../utils/truncate";
import { Post as IPost } from "../interfaces/Post";
import { MAX_POST_LENGTH } from "../constants/post";
import { useLikePostMutation } from "../../features/post/postApi";

interface PostProps {
  data: IPost;
}

const Post = forwardRef<HTMLDivElement, PostProps>(({ data }, ref) => {
  const [isReadMore, setIsReadMore] = useState(false);
  const [isLiked, setIsLiked] = useState(data.hasLiked);
  const [likeCount, setLikeCount] = useState(data.likes);

  const [likePost] = useLikePostMutation();

  const handleLikeClick = () => {
    setIsLiked((prevLiked) => !prevLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    // TODO: send a request to the server
    likePost(data.id);
  };

  const handleReadMoreToggle = () => {
    setIsReadMore((prev) => !prev);
  };

  return (
    <article className="post" ref={ref}>
      <header className="post__header">
        <Avatar
          src="https://placehold.co/50"
          text="Milan Tucek"
          secondaryText="CEO of laziness"
        />
      </header>

      <main className="post__main">
        <h3 className="post__title">{data.title}</h3>
        <p className="post__content">
          {isReadMore ? data.content : truncate(data.content, MAX_POST_LENGTH)}
        </p>
        {data.content.length > MAX_POST_LENGTH && (
          <button
            onClick={handleReadMoreToggle}
            className="post__button post__read-more"
          >
            {isReadMore ? "Read Less" : "Read More"}
          </button>
        )}
      </main>

      <footer className="post__footer">
        <div className="post__action">
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
          <button className="post__button" aria-label="Comment">
            <img src="/icons/comment.svg" alt="Comment" />
          </button>
          <button className="post__button" aria-label="Share">
            <img src="/icons/share.svg" alt="Share" />
          </button>
        </div>
        <CommentSection comments={data.comments} onLoadMore={() => {}} />
      </footer>
    </article>
  );
});

export default Post;
