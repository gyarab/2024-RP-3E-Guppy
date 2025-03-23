import { forwardRef, useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";

import Avatar from "./Avatar";
import Button from "./Button";
import TagChip from "./TagChip";
import CommentSection from "./CommentSection";
import Poll from "./Poll";

import { Post as IPost } from "../interfaces/Post";
import {
  useLikePostMutation,
  useRemoveVoteMutation,
  useVotePollMutation,
} from "../../features/post/postApi";
import { formatRelativeDate } from "../utils/formatRelativeDate";
import LikeIcon from "./LikeIcon";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [likePost] = useLikePostMutation();
  const [votePoll] = useVotePollMutation();
  const [removeVote] = useRemoveVoteMutation();
  const user = useSelector(selectUser);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

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

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const timeAgo = formatRelativeDate(new Date(data.createdAt));

  const handleVote = (optionId: number) => {
    votePoll({ postId: data.id, optionId });
  };

  const handleRemoveVote = () => {
    removeVote(data.id);
  };

  return (
    <article className="post" ref={ref}>
      <header className="post__header">
        <Avatar
          src={data.author.profilePictureUrl || "/images/avatar.png"}
          text={data.author.name}
          secondaryText={timeAgo}
        />
        <div className="post__header__actions" ref={dropdownRef}>
          <button
            className="post__header__actions-button"
            onClick={toggleDropdown}
          >
            ⋮
          </button>

          {showDropdown && (
            <div className="post__dropdown">
              {user?.id === data.author.id && (
                <>
                  <Link
                    className="post__dropdown__item"
                    to={`/edit/${data.id}`}
                  >
                    Edit
                  </Link>
                  <Link
                    className="post__dropdown__item"
                    to={`/edit/${data.id}`}
                  >
                    Delete
                  </Link>
                </>
              )}
              <Link
                className="post__dropdown__item post__dropdown__item--danger"
                to={`/edit/${data.id}`}
              >
                Report
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="post__main">
        <h3 className="post__title">{data.title}</h3>
        <p
          className="post__content"
          dangerouslySetInnerHTML={createMarkup(data.content)}
        />

        {data.poll && (
          <Poll
            poll={data.poll}
            onVote={handleVote}
            onRemoveVote={handleRemoveVote}
          />
        )}

        {data.tags.length > 0 && (
          <div className="tags-list">
            {data.tags.map((tag) => (
              <TagChip key={tag.name} tag={tag.name} />
            ))}
          </div>
        )}
      </main>

      <footer className="post__footer">
        <div className="post__actions">
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
