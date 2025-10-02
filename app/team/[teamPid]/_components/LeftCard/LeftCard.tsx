"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetTeamByTeamPidQuery,
} from "@/redux/apis/teams.api";
import NewProjectDialog from "./NewProjectDialog/NewProjectDialog";
import Projects from "./Projects/Projects";

interface Props {
  teamPid: string;
}

const LeftCard = ({ teamPid }: Props) => {
  const { data: teamData } = useGetTeamByTeamPidQuery({ teamPid });
  const { team } = teamData!;

  return (
    <Card className="w-84 shrink-0">
      <CardHeader>
        <CardTitle className="tracking-wider mx-auto flex flex-col">
          Team {team?.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col">
        <Projects teamPid={teamPid} />
        <NewProjectDialog teamPid={teamPid} />
      </CardContent>
    </Card>
  );
};
export default LeftCard;
