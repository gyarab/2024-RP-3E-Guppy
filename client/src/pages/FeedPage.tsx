import { useCallback, useEffect, useRef, useState } from "react";

import { useGetPostsQuery } from "../features/post/postApi";

import Post from "../shared/ui/Post";
import Loader from "../shared/ui/Loader";
import { Post as IPost } from "../shared/interfaces/Post";
import { FETCH_POSTS_LIMIT } from "../shared/constants/post";

function FeedPage() {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const { data, isLoading } = useGetPostsQuery({
    page,
    limit: FETCH_POSTS_LIMIT,
  });

  useEffect(() => {
    if (data && data.posts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      console.log(data);

      if (posts.length + data.posts.length >= data.count) {
        setHasMore(false);
      }
    }
  }, [data]);

  const observeLastPost = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !hasMore) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { threshold: 1.0 } // FIXME: zmenit dle potreby
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, hasMore]
  );

  return (
    <div className="container">
      {isLoading && <Loader />}
      <h2 className="section__title">Welcome to your feed!</h2>
      <p className="section__subtitle">
        Here you can see posts from people you follow.
      </p>
      <div className="feed">
        {posts?.map((post, index) => (
          <Post
            key={post.id}
            data={post}
            ref={index === posts.length - 1 ? observeLastPost : null} // sledovani posledniho postu
          />
        ))}
      </div>
    </div>
  );
}

export default FeedPage;
