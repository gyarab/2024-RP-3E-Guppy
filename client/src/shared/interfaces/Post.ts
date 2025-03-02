import { Comment } from "./Comment";
import { Tag } from "./Tag";

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  organizationId: number;
  comments: Comment[];
  tags: Tag[];
  likes: number;
  hasLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
