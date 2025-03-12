import { apiSlice } from "../../shared/api/apiSlice";
import { Comment } from "../../shared/interfaces/Comment";
import { CreateCommentDto } from "../../shared/interfaces/CreateCommentDto";
import { providesList } from "../../shared/utils/helpers";

export const commentApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCommentsByPostId: build.query<Comment[], number>({
      query: (postId) => `comments/post/${postId}`,
      providesTags: (result) => providesList(result, "Comment"),
    }),
    addComment: build.mutation<Comment, CreateCommentDto>({
      query: ({ postId, ...payload }) => ({
        url: `comments/${postId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Comment", id: "LIST" }],
    }),
    likeComment: build.mutation<Comment, number>({
      query: (id) => ({
        url: `/comments/${id}/like`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCommentsByPostIdQuery,
  useAddCommentMutation,
  useLikeCommentMutation,
} = commentApi;
