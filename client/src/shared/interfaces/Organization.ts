import { Post } from "./Post";

export interface Organization {
  id: number;
  name: string;
  description: string;
  joinCode: string;
  logoUrl: string;
  posts?: Post[];
  createdAt: Date;
}
