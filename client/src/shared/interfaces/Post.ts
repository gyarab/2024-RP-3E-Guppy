import { Comment } from "./Comment";

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  organizationId: number;
  comments: Comment[];
  likes: number;
  hasLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
