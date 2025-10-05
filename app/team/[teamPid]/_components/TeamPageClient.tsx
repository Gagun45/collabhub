"use client";

import LoadingIndicator from "@/components/General/LoadingIndicator";
import { SMTH_WENT_WRONG } from "@/lib/constants";
import { useGetTeamByTeamPidQuery } from "@/redux/apis/teams.api";
import LeftCard from "./LeftCard/LeftCard";
import RightCard from "./RightCard/RightCard";

interface Props {
  teamPid: string;
}

const TeamPageClient = ({ teamPid }: Props) => {
  const { data, isLoading } = useGetTeamByTeamPidQuery({ teamPid });
  if (isLoading) return <LoadingIndicator />;
  if (!data?.success || !data.team) return <span>{SMTH_WENT_WRONG}</span>;
  return (
    <div className="flex gap-4 w-full flex-col xl:flex-row">
      <LeftCard teamPid={teamPid}/>
      <RightCard />
    </div>
  );
};
export default TeamPageClient;
