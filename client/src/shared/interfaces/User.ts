export interface User {
  id: number;
  email: string;
  name: string;
  birthdate: Date;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  profilePictureUrl: string;
  bio: string;
  phoneNumber: string;
  isVerified: boolean;
  lastLogin: Date;
}
