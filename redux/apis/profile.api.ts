import {
  getAvatarUrl,
  getProfilePageData,
  updateProfilePageData,
} from "@/lib/actions/profile.actions";
import type {
  editProfileSchemaType,
  ProfilePageDataType,
  SuccessAndMessageType,
} from "@/lib/types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["avatarUrl", "profilePageData"],
  endpoints: (builder) => ({
    getAvatarUrl: builder.query<
      SuccessAndMessageType & { avatarUrl: string },
      void
    >({
      queryFn: async () => {
        try {
          const result = await getAvatarUrl();
          if (!result.success) return { error: result.message };
          return { data: result };
        } catch {
          return { error: "Unexpected error" };
        }
      },
      providesTags: ["avatarUrl"],
    }),
    getProfilePageData: builder.query<ProfilePageDataType, void>({
      queryFn: async () => {
        try {
          const result = await getProfilePageData();
          if (!result.success) return { error: result.message };
          return { data: result };
        } catch {
          return { error: "Unexpected error" };
        }
      },
      providesTags: ["profilePageData"],
    }),
    updateProfilePageData: builder.mutation<
      SuccessAndMessageType,
      { values: editProfileSchemaType }
    >({
      queryFn: async ({ values }) => {
        try {
          const result = await updateProfilePageData(values);
          if (!result.success) {
            return { error: result.message };
          }
          return { data: result };
        } catch {
          return { error: "Unexpected error" };
        }
      },
      invalidatesTags: ["profilePageData"],
    }),
  }),
});

export const {
  useGetAvatarUrlQuery,
  useGetProfilePageDataQuery,
  useUpdateProfilePageDataMutation,
} = profileApi;
