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
    updateProfilePageData: builder.mutation<
      SuccessAndMessageType,
      { values: editProfileSchemaType }
    >({
      queryFn: async ({ values }) => {
        try {
          const data = await updateProfilePageData(values);
          return { data };
        } catch {
          return { error: "Unexpected error" };
        }
      },
      onQueryStarted: async ({ values }, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          profileApi.util.updateQueryData(
            "getProfilePageData",
            undefined,
            (draft) => {
              Object.assign(draft, values);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
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
