"use client";

import { useGetMyTeamsQuery } from "@/redux/apis/teams.api";
import MyTeamCard from "./MyTeamCard/MyTeamCard";
import LoadingIndicator from "@/components/General/LoadingIndicator";

const MyTeams = () => {
  const { data, isError, error, isLoading } = useGetMyTeamsQuery();
  if (isLoading)
    return (
      <div>
        <LoadingIndicator />
      </div>
    );
  if (isError) return <div>{error as string}</div>;
  if (!data) return <div>Unexpected error</div>;
  const { teams } = data;
  return (
    <>
      {teams.map((team) => (
        <MyTeamCard key={team.teamPid} team={team} />
      ))}
    </>
  );
};
export default MyTeams;
