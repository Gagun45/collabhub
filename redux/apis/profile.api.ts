import {
  getAvatarUrl,
  getProfilePageData,
} from "@/lib/actions/profile.actions";
import type { ProfilePageDataType } from "@/lib/types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["avatarUrl", "profilePageData"],
  endpoints: (builder) => ({
    getAvatarUrl: builder.query<{ avatarUrl: string }, void>({
      queryFn: async () => {
        try {
          const avatarUrl = await getAvatarUrl();
          return { data: avatarUrl };
        } catch {
          return { error: "Unexpected error" };
        }
      },
      providesTags: ["avatarUrl"],
    }),
    getProfilePageData: builder.query<ProfilePageDataType, void>({
      queryFn: async () => {
        try {
          const data = await getProfilePageData();
          return { data };
        } catch {
          return { error: "Unexpected error" };
        }
      },
      providesTags: ["profilePageData"],
    }),
  }),
});

export const { useGetAvatarUrlQuery, useGetProfilePageDataQuery } = profileApi;
