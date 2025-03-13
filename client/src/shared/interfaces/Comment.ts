export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    profilePictureUrl: string;
  };
  likes: number;
  hasLiked: boolean;
}
