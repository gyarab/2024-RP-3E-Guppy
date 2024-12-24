import { Comment } from "./Comment";

// FIXME: change Post field according to the server
export interface Post {
  id: number;
  title: string;
  content: string;
  // author: {
  //   name: string;
  //   avatar: string;
  // };
  authorId: number;
  published: boolean;
  organizationId: number;
  comments: Comment[];
  likeCount: number;
  userLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
