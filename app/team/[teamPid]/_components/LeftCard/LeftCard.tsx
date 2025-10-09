"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTeamByTeamPidQuery } from "@/redux/apis/teams.api";
import NewProjectDialog from "./NewProjectDialog/NewProjectDialog";
import Projects from "./Projects/Projects";

interface Props {
  teamPid: string;
}

const LeftCard = ({ teamPid }: Props) => {
  const { data: teamData } = useGetTeamByTeamPidQuery({ teamPid });
  if (!teamData?.team) return null;
  const { team, role } = teamData;

  return (
    <Card className="w-full max-w-128 mx-auto shrink-0 xl:w-80">
      <CardHeader>
        <CardTitle className="tracking-wider mx-auto flex flex-col">
          Team {team?.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col">
        <div className="flex flex-col">
          <span>My role: {role}</span>
          <span>Members:</span>
          <div className="flex flex-col">
            {team.TeamMembers.map((tm) => (
              <span key={`${tm.teamId}-${tm.userId}`}>
                {tm.user.UserInformation?.username} - {tm.role}
              </span>
            ))}
          </div>
        </div>
        <Projects teamPid={teamPid} />
        {role === "ADMIN" && <NewProjectDialog teamPid={teamPid} />}
      </CardContent>
    </Card>
  );
};
export default LeftCard;
