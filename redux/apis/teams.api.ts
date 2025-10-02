import { createNewTeam } from "@/lib/actions/team.actions";
import type { newTeamSchemaType, SuccessAndMessageType } from "@/lib/types";
import type { Team } from "@prisma/client";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const teamsApi = createApi({
  reducerPath: "teamsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["myTeams"],
  endpoints: (builder) => ({
    createNewTeam: builder.mutation<
      SuccessAndMessageType & { team: Team | null },
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
    }),
  }),
});

export const { useCreateNewTeamMutation } = teamsApi;
