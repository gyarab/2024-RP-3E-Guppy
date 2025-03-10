import { apiSlice } from "../../shared/api/apiSlice";
import { Organization } from "../../shared/interfaces/Organization";

type GetOrganizationsResponse = {
  organizations: Organization[];
  count: number;
};

type GetOrganizationsParams = {
  page?: number;
  limit?: number;
};

export const organizationApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getOrganization: build.query<Organization, number>({
      query: (id) => `/organizations/${id}`,
    }),
    getOrganizations: build.query<
      GetOrganizationsResponse,
      GetOrganizationsParams
    >({
      query: (params) => ({ url: "/organizations", params }),
    }),
    getUserOrganizations: build.query<
      GetOrganizationsResponse,
      GetOrganizationsParams
    >({
      query: (params) => ({ url: "/organizations/user", params }),
    }),
    createOrganization: build.mutation<Organization, Partial<Organization>>({
      query: (body) => ({
        url: "/organizations",
        method: "POST",
        body,
      }),
    }),
    checkOrgName: build.mutation<{ available: boolean }, string>({
      query: (name) => ({
        url: "/organizations/check-name",
        method: "POST",
        body: { name },
      }),
    }),
    joinOrganization: build.mutation<Organization, string>({
      query: (joinCode) => ({
        url: `/organizations/join/${joinCode}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetOrganizationQuery,
  useGetOrganizationsQuery,
  useGetUserOrganizationsQuery,
  useCreateOrganizationMutation,
  useCheckOrgNameMutation,
  useJoinOrganizationMutation,
} = organizationApi;
