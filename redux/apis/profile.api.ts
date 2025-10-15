import {
  getAvatarUrl,
  getProfilePageData,
  updateAvatarUrl,
  updateProfilePageData,
} from "@/lib/actions/profile.actions";
import { UNEXPECTED_ERROR } from "@/lib/constants";
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
    updateAvatarUrl: builder.mutation<
      SuccessAndMessageType,
      { userPid: string; url: string }
    >({
      queryFn: async ({ url, userPid }) => {
        try {
          const result = await updateAvatarUrl(userPid, url);
          if (!result.success) {
            return { error: result.message };
          }
          return { data: result };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      onQueryStarted: async ({ url }, { dispatch, queryFulfilled }) => {
        const patchResults = [
          dispatch(
            profileApi.util.updateQueryData(
              "getAvatarUrl",
              undefined,
              (draft) => {
                draft.avatarUrl = url;
              }
            )
          ),
          dispatch(
            profileApi.util.updateQueryData(
              "getProfilePageData",
              undefined,
              (draft) => {
                if (!draft.data?.UserInformation?.avatarUrl) return;
                draft.data.UserInformation.avatarUrl = url;
              }
            )
          ),
        ];
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: ["avatarUrl", "profilePageData"],
    }),
  }),
});

export const {
  useGetAvatarUrlQuery,
  useGetProfilePageDataQuery,
  useUpdateProfilePageDataMutation,
  useUpdateAvatarUrlMutation,
} = profileApi;
