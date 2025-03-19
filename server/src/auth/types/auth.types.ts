import { User } from '@prisma/client';

type AccessToken = {
  accessToken: string;
};

type RefreshToken = {
  refreshToken: string;
};

export type Tokens = AccessToken & RefreshToken;
export type UserWithoutPassword = Omit<User, 'password'>;
export type TokenValidateResponse = UserWithoutPassword & {
  iat: number;
  exp: number;
};

export type UserWithTokens = UserWithoutPassword & Tokens;

export type SignInResponse = UserWithoutPassword & Partial<AccessToken>;
export type SignUpResponse = UserWithoutPassword & Partial<AccessToken>;
export type RefreshResponse = Partial<AccessToken> | { success: boolean };
