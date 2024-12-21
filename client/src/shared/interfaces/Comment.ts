export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    avatar: string;
  };
}
