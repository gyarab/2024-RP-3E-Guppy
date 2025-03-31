import { useCallback, useEffect, useRef, useState } from "react";

import { useGetPostsQuery } from "../features/post/postApi";
import useDebounce from "../shared/hooks/useDebounce";

import Post from "../shared/ui/Post";
import Loader from "../shared/ui/Loader";
import { Post as IPost } from "../shared/interfaces/Post";
import { FETCH_POSTS_LIMIT } from "../shared/constants/post";
import { skipToken } from "@reduxjs/toolkit/query";

function FeedPage() {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const observer = useRef<IntersectionObserver | null>(null);
  const orgId = sessionStorage.getItem("orgId");

  useEffect(() => {
    setPosts([]);
    setPage(1);
  }, [orgId]);

  // if (!orgId) {
  //   return (
  //     <div className="container feed-container">
  //       <p>
  //         No organization selected. Please select an organization to view posts.
  //       </p>
  //     </div>
  //   );
  // }

  const parseSearchQuery = (query: string) => {
    if (!query) return {};

    if (query.startsWith("@")) {
      return { searchType: "user", query: query.slice(1) };
    }
    if (query.startsWith("#")) {
      return { searchType: "tags", query: query.slice(1) };
    }
    return { searchType: "title", query };
  };

  const { data, isLoading } = useGetPostsQuery(
    orgId
      ? {
          page,
          limit: FETCH_POSTS_LIMIT,
          ...parseSearchQuery(debouncedSearchQuery),
          orgId,
        }
      : skipToken,
    {
      skip: !!debouncedSearchQuery && page > 1,
    }
  );

  useEffect(() => {
    if (data) {
      if (debouncedSearchQuery) {
        if (data.posts.length > 0) {
          setPosts(data.posts);
          setHasMore(false);
        } else {
          setPosts([]);
          setHasMore(false);
        }
      } else {
        if (page === 1) {
          setPosts(data.posts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        }

        setHasMore(posts.length + data.posts.length < data.count);
      }
    }
  }, [data, debouncedSearchQuery]);

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

  if (!orgId) {
    return (
      <div className="container feed-container">
        <p>
          No organization selected. Please select an organization to view posts.
        </p>
      </div>
    );
  }

  return (
    <div className="container feed-container">
      {isLoading && <Loader />}
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-bar"
            placeholder="Search by title, tags, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-button" onClick={() => setSearchQuery("")}>
              ✖
            </button>
          )}
        </div>
        <p className="search-hint">
          Use <strong>#</strong> for tags, <strong>@</strong> for users, and
          plain text for titles.
        </p>
      </div>

      <div className="feed">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <Post
              key={post.id}
              data={post}
              ref={index === posts.length - 1 ? observeLastPost : null}
            />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
}

export default FeedPage;
