import { apiSlice } from "../../shared/api/apiSlice";

import { Post } from "../../shared/interfaces/Post";
import { CreatePostDto } from "../../shared/interfaces/CreatePostDto";
import { providesList } from "../../shared/utils/helpers";

export const postApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query<
      { posts: Post[]; count: number },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: "/posts",
        params: { page, limit },
      }),
      providesTags: (result) => providesList(result?.posts, "Post"),
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
      // DO NOT UNCOMMENT - jsou kvuli tomu bugy
      // invalidatesTags: (_, __, id) => [{ type: "Post", id }],
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
