import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { logout } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  // Set baseUrl based on environment (dev or prod)
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "http://localhost:5000/api" // backend API in production (Docker)
      : "http://localhost:5173/api", // Vite development server in local dev
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = sessionStorage.getItem("accessToken");
    headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const { accessToken } = refreshResult.data as { accessToken: string };
      sessionStorage.setItem("accessToken", accessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["User", "Post", "Comment"],
  endpoints: () => ({}),
});
