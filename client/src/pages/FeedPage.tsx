import { useGetPostsQuery } from "../features/post/postApi";
import Post from "../shared/ui/Post";
import Loader from "../shared/ui/Loader";

const posts = [
  {
    id: 1,
    title: "Hello, world!",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    authorId: 1,
    comments: [
      {
        id: 1,
        content:
          "Another comment here. Some dummy text in order to fill the space.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        author: {
          name: "Jane Smith",
          avatar: "https://placehold.co/40",
        },
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    organizationId: 1,
    published: true,
  },
  {
    id: 2,
    title: "Hello, world!",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    authorId: 1,
    comments: [
      {
        id: 3,
        content:
          "Another comment here. Some dummy text in order to fill the space.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        author: {
          name: "Jane Smith",
          avatar: "https://placehold.co/40",
        },
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    organizationId: 1,
    published: true,
  },
];

function FeedPage() {
  const { data: posts, isLoading } = useGetPostsQuery();

  return (
    <div className="container">
      {isLoading && <Loader />}
      <h2 className="section__title">Welcome to your feed!</h2>
      <p className="section__subtitle">
        Here you can see posts from people you follow.
      </p>
      <div className="feed">
        {posts?.map((post) => (
          <Post key={post.id} data={post} />
        ))}
      </div>
    </div>
  );
}

export default FeedPage;
