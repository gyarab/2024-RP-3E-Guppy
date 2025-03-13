import { apiSlice } from "../../shared/api/apiSlice";

import { Post } from "../../shared/interfaces/Post";
import { CreatePostDto } from "../../shared/interfaces/CreatePostDto";
import { providesList } from "../../shared/utils/helpers";

export const postApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query<
      { posts: Post[]; count: number },
      {
        page: number;
        limit: number;
        orgId: string;
        searchType?: string;
        query?: string;
      }
    >({
      query: ({ orgId, ...params }) => ({
        url: `/posts/organization/${orgId}`,
        params,
      }),
      providesTags: (result) => providesList(result?.posts, "Post"),
    }),
    getPost: build.query<Post, number>({
      query: (id) => `/posts/${id}/organization/2`,
      providesTags: (_, __, id) => [{ type: "Post", id }],
    }),
    createPost: build.mutation<Post, CreatePostDto>({
      query: ({ orgId, ...payload }) => ({
        url: `/posts/organization/${orgId}`,
        method: "POST",
        body: payload,
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
