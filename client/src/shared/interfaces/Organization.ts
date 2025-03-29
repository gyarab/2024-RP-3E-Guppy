import { Post } from "./Post";
import { User } from "./User";

interface UserOrganization {
  id: number;
  organizationId: number;
  role: { name: string };
  roleId: number;
  user: User;
  userId: number;
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  // joinCode: string;
  logoUrl: string;
  mainColor?: string;
  posts?: Post[];
  createdAt: Date;
  // users: UserOrganization[];
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
