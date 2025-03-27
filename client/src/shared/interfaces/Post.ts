import { Comment } from "./Comment";
import { Tag } from "./Tag";

export interface Poll {
  id: number;
  postId: number;
  totalVotes: number;
  options: PollOption[];
  userVote?: number | null;
}

export interface PollOption {
  id: number;
  name: string;
  votes: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    profilePictureUrl: string;
  };
  organizationId: number;
  comments: Comment[];
  tags: Tag[];
  poll: Poll;
  likes: number;
  commentsCount: number;
  hasLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
