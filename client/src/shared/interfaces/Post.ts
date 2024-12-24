import { Comment } from "./Comment";

// FIXME: change Post field according to the server
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
