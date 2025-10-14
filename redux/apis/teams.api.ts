import {
  createNewTeam,
  getMyTeams,
  getTeamByTeamPid,
} from "@/lib/actions/team.actions";
import { UNEXPECTED_ERROR } from "@/lib/constants";
import type {
  MyTeamType,
  newTeamSchemaType,
  SuccessAndMessageType,
  TeamType,
} from "@/lib/types";
import type { $Enums } from "@prisma/client";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const teamsApi = createApi({
  reducerPath: "teamsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["myTeams"],
  endpoints: (builder) => ({
    createNewTeam: builder.mutation<
      SuccessAndMessageType,
      { values: newTeamSchemaType }
    >({
      queryFn: async ({ values }) => {
        try {
          const result = await createNewTeam(values);
          if (!result.success) return { error: result.message };
          return { data: result };
        } catch {
          return { error: "Unexpected error" };
        }
      },
      invalidatesTags: ["myTeams"],
    }),
    getMyTeams: builder.query<
      SuccessAndMessageType & { teams: MyTeamType[] },
      void
    >({
      queryFn: async () => {
        try {
          const result = await getMyTeams();
          if (!result.success) return { error: result.message };
          return { data: result };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      providesTags: ["myTeams"],
    }),
    getTeamByTeamPid: builder.query<
      SuccessAndMessageType & {
        team: TeamType | null;
        role: $Enums.TeamRole | null;
      },
      { teamPid: string }
    >({
      queryFn: async ({ teamPid }) => {
        try {
          const result = await getTeamByTeamPid(teamPid);
          if (!result.success) return { error: result.message };
          return { data: result };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
    }),
  }),
});

export const {
  useCreateNewTeamMutation,
  useGetMyTeamsQuery,
  useGetTeamByTeamPidQuery,
} = teamsApi;
