import { User } from '@prisma/client';

type AccessToken = {
  accessToken: string;
};

type RefreshToken = {
  refreshToken: string;
};

export type Tokens = AccessToken & RefreshToken;
export type UserWithoutPassword = Omit<User, 'password'>;

export type UserWithTokens = UserWithoutPassword & Tokens;

export type SignInResponse = UserWithoutPassword;
export type SignUpResponse = UserWithoutPassword;
export type RefreshResponse = AccessToken;
