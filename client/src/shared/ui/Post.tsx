import { forwardRef, useState } from "react";
import DOMPurify from "dompurify";

import Avatar from "./Avatar";
import Button from "./Button";
import TagChip from "./TagChip";
import CommentSection from "./CommentSection";

import { Post as IPost } from "../interfaces/Post";
import { useLikePostMutation } from "../../features/post/postApi";
import { formatRelativeDate } from "../utils/formatRelativeDate";
import LikeIcon from "./LikeIcon";

interface PostProps {
  data: IPost;
}

const createMarkup = (dirty: string) => ({
  __html: DOMPurify.sanitize(dirty),
});

const Post = forwardRef<HTMLDivElement, PostProps>(({ data }, ref) => {
  const [isLiked, setIsLiked] = useState(data.hasLiked);
  const [likeCount, setLikeCount] = useState(data.likes);
  const [showComments, setShowComments] = useState(false);

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

  const toggleComments = () => {
    setShowComments((prev) => !prev);
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
            <LikeIcon isLiked={isLiked} />
            <span className="like-count">{likeCount}</span>
          </Button>

          <Button variant="basic" size="small" onClick={toggleComments}>
            <img src="/icons/comment.svg" alt="Comment Icon" />
            <span className="like-count">{data.commentsCount}</span>
          </Button>

          <Button variant="basic" size="small">
            <img src="/icons/share.svg" alt="Share Icon" />
          </Button>
        </div>

        {showComments && <CommentSection postId={data.id} />}
      </footer>
    </article>
  );
});

export default Post;
