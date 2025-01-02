import { apiSlice } from "../../shared/api/apiSlice";
import { Organization } from "../../shared/interfaces/Organization";

export const organizationApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getOrganization: build.query<Organization, number>({
      query: (id) => `/organizations/${id}`,
    }),
    getOrganizations: build.query<Organization[], any>({
      query: (params) => ({ url: "/organizations", params }),
    }),
    createOrganization: build.mutation<Organization, Partial<Organization>>({
      query: (body) => ({
        url: "/organizations",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetOrganizationQuery,
  useGetOrganizationsQuery,
  useCreateOrganizationMutation,
} = organizationApi;
