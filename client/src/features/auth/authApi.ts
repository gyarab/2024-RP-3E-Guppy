import { LoginCredentials } from "../../shared/interfaces/LoginCredentials";
import { apiSlice } from "../../shared/api/apiSlice";
import { User } from "../../shared/interfaces/User";
import { SignupCredentials } from "../../shared/interfaces/SignupCredentials";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<User, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: build.mutation<User, SignupCredentials>({
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
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
