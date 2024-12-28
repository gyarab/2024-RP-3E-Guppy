import { apiSlice } from "../../shared/api/apiSlice";

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    uploadImage: build.mutation<string, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/upload",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: { path: string }) => {
        return response.path;
      },
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
