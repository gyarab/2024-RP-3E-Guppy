// FIXME: change Comment fields according to the server
export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    avatar: string;
  };
}
