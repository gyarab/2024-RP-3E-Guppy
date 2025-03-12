import { Comment } from "./Comment";
import { Tag } from "./Tag";

export interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    profilePictureUrl: string;
  };
  organizationId: number;
  comments: Comment[];
  tags: Tag[];
  likes: number;
  commentsCount: number;
  hasLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
