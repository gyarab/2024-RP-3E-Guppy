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
  const [searchQuery, setSearchQuery] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);

  const parseSearchQuery = (query: string) => {
    if (query.startsWith("@")) {
      return { searchType: "user", query: query.slice(1) };
    }
    if (query.startsWith("#")) {
      return { searchType: "tags", query: query.slice(1) };
    }
    return { searchType: "title", query };
  };

  const { data, isLoading, refetch } = useGetPostsQuery(
    {
      page,
      limit: FETCH_POSTS_LIMIT,
      ...parseSearchQuery(searchQuery),
    },
    {
      skip: !searchQuery && page === 1,
    }
  );

  useEffect(() => {
    if (data && data.posts.length > 0) {
      if (searchQuery) {
        setPosts(data.posts);
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        if (posts.length + data.posts.length >= data.count) {
          setHasMore(false);
        }
      }
    }
  }, [data, searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      setPage(1);
      setHasMore(false);
      refetch();
    } else {
      setHasMore(true);
    }
  }, [searchQuery, refetch]);

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
        { threshold: 1.0 }
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
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="feed">
        {posts?.map((post, index) => (
          <Post
            key={post.id}
            data={post}
            ref={index === posts.length - 1 ? observeLastPost : null}
          />
        ))}
      </div>
    </div>
  );
}

export default FeedPage;
