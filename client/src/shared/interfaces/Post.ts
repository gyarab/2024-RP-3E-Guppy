export interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  topComment: string;
  createdAt: Date;
  updatedAt: Date;
}
