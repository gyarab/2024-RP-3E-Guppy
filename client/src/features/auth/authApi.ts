import { apiSlice } from "../../shared/api/apiSlice";

import { User } from "../../shared/interfaces/User";
import { LoginCredentials } from "../../shared/interfaces/LoginCredentials";
import { SignupCredentials } from "../../shared/interfaces/SignupCredentials";
import { ForgotPasswordCredentials } from "../../shared/interfaces/ForgotPasswordCredentials";

type UserWithToken = User & {
  accessToken: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<UserWithToken, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: build.mutation<UserWithToken, SignupCredentials>({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    forgotPassword: build.mutation<User, ForgotPasswordCredentials>({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: email,
      }),
    }),
    resetPassword: build.mutation<User, { newPassword: string; token: string }>(
      {
        query: (credentials) => ({
          url: "/auth/reset-password",
          method: "POST",
          body: credentials,
        }),
      }
    ),
    verify: build.query<User, void>({
      query: () => "/auth/verify",
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyQuery,
} = authApi;
