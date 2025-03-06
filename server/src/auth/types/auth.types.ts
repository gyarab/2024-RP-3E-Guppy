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

export type SignInResponse = UserWithoutPassword & AccessToken;
export type SignUpResponse = UserWithoutPassword & AccessToken;
export type RefreshResponse = AccessToken;
