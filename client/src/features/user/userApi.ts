import { apiSlice } from "../../shared/api/apiSlice";
import { User } from "../../shared/interfaces/User";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    updateProfile: build.mutation<User & { accessToken: string }, User>({
      query: ({ id, ...payload }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const { useUpdateProfileMutation } = userApi;
