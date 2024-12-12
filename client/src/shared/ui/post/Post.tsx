import { useState } from "react";

import { Post as IPost } from "../../interfaces/Post";
import { truncate } from "../../utils/truncate";

interface PostProps {
  data: IPost;
}

function Post({ data }: PostProps) {
  const maxContentLength = 300;

  const [isReadMore, setIsReadMore] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  const handleReadMoreToggle = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <article className="post">
      <div className="post__header">
        <img
          src={data.author.avatar}
          alt={`${data.author.name}'s avatar`}
          className="post__avatar"
        />
        <h4 className="post__author">{data.author.name}</h4>
      </div>
      <div className="post__main">
        <h3 className="post__title">{data.title}</h3>
        <p className="post__content">
          {isReadMore ? data.content : truncate(data.content, maxContentLength)}
        </p>
        {data.content.length > maxContentLength && (
          <button
            onClick={handleReadMoreToggle}
            className="btn post__read-more"
          >
            {isReadMore ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
      <div className="post__footer">
        <div className="post__action">
          <button className="btn post__button--like" onClick={handleLikeToggle}>
            {isLiked ? (
              <img src="/icons/like-filled.svg" alt="" />
            ) : (
              <img src="/icons/like.svg" alt="" />
            )}
          </button>
          <button className="btn post__button--comment">
            <img src="/icons/comment.svg" alt="Comment icon" />
          </button>
          <button className="btn post__button--share">
            <img src="/icons/share.svg" alt="Share icon" />
          </button>
        </div>
        <div className="post__date">{data.createdAt.toLocaleDateString()}</div>
        <div className="post__comment">{data.mostPopularComment}</div>
      </div>
    </article>
  );
}

export default Post;
