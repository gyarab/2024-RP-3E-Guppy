import { apiSlice } from "../../shared/api/apiSlice";

import { Post } from "../../shared/interfaces/Post";
import { CreatePostDto } from "../../shared/interfaces/CreatePostDto";
import { providesList } from "../../shared/utils/helpers";

export const postApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query<Post[], { page: number; limit: number }>({
      query: ({ page, limit }) => `/posts?page=${page}&limit=${limit}`,
      providesTags: (result) => providesList(result, "Post"),
    }),
    getPost: build.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: (_, __, id) => [{ type: "Post", id }],
    }),
    createPost: build.mutation<Post, CreatePostDto>({
      query: (data) => ({
        url: "/posts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    deletePost: build.mutation<Post, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Post", id }],
    }),
    likePost: build.mutation<Post, number>({
      query: (id) => ({
        url: `/posts/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Post", id }],
    }),
  }),
});

export const {
  useGetPostQuery,
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
} = postApi;
