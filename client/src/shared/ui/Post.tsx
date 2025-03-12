import { forwardRef, useState } from "react";
import DOMPurify from "dompurify";

import Avatar from "./Avatar";
import Button from "./Button";
import CommentSection from "./CommentSection";

import { Post as IPost } from "../interfaces/Post";
import { useLikePostMutation } from "../../features/post/postApi";
import { formatRelativeDate } from "../utils/formatRelativeDate";
import TagChip from "./TagChip";

interface PostProps {
  data: IPost;
}

const createMarkup = (dirty: string) => ({
  __html: DOMPurify.sanitize(dirty),
});

const Post = forwardRef<HTMLDivElement, PostProps>(({ data }, ref) => {
  const [isLiked, setIsLiked] = useState(data.hasLiked);
  const [likeCount, setLikeCount] = useState(data.likes);

  const [likePost] = useLikePostMutation();

  const handleLikeClick = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));

    try {
      await likePost(data.id).unwrap();
    } catch (error) {
      console.error("Error liking post:", error);
      setIsLiked(!newLikedState);
      setLikeCount((prev) => (newLikedState ? prev - 1 : prev + 1));
    }
  };

  const timeAgo = formatRelativeDate(new Date(data.createdAt));

  return (
    <article className="post" ref={ref}>
      <header className="post__header">
        <Avatar
          src={data.author.profilePictureUrl || "/images/avatar.png"}
          text={data.author.name}
          secondaryText={timeAgo}
        />
      </header>

      <main className="post__main">
        <h3 className="post__title">{data.title}</h3>
        <p
          className="post__content"
          dangerouslySetInnerHTML={createMarkup(data.content)}
        />

        {data.tags.length > 0 && (
          <div className="tags-list">
            {data.tags.map((tag) => (
              <TagChip key={tag.name} tag={tag.name} />
            ))}
          </div>
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
                aria-hidden="true"
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

        <CommentSection postId={data.id} />
      </footer>
    </article>
  );
});

export default Post;
