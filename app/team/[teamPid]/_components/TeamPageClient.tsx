"use client";

import LoadingIndicator from "@/components/General/LoadingIndicator";
import { SMTH_WENT_WRONG } from "@/lib/constants";
import { useGetTeamByTeamPidQuery } from "@/redux/apis/teams.api";
import LeftCard from "./LeftCard/LeftCard";
import RightCard from "./RightCard/RightCard";
import { useSearchParams } from "next/navigation";
import { ProjectPidProvider } from "./ProjectPidContext";

interface Props {
  teamPid: string;
}

const TeamPageClient = ({ teamPid }: Props) => {
  const projectPid = useSearchParams().get("projectPid") ?? "";
  const { data, isLoading } = useGetTeamByTeamPidQuery({ teamPid });
  if (isLoading) return <LoadingIndicator />;
  if (!data?.success || !data.team) return <span>{SMTH_WENT_WRONG}</span>;
  return (
    <div className="flex gap-4 w-full flex-col xl:flex-row">
      <ProjectPidProvider value={{ projectPid, teamPid }}>
        <LeftCard />
        <RightCard />
      </ProjectPidProvider>
    </div>
  );
};
export default TeamPageClient;
