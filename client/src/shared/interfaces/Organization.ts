import { Post } from "./Post";
import { User } from "./User";

export interface Organization {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  posts?: Post[];
  createdAt: Date;
}

export interface OrgnizationWithJoin extends Organization {
  userJoined: boolean;
}

export interface OrganizationInfo {
  name: string;
  description: string;
  owner: User;
  totalMembers: number;
  totalPosts: number;
  joinCode: string;
}
