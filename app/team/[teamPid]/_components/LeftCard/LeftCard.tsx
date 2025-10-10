"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTeamByTeamPidQuery } from "@/redux/apis/teams.api";
import NewProjectDialog from "./NewProjectDialog/NewProjectDialog";
import Projects from "./Projects/Projects";
import MembersAvatars from "@/components/General/MembersAvatars/MembersAvatars";
import type { MemberAvatarInterface } from "@/lib/types";

interface Props {
  teamPid: string;
}

const LeftCard = ({ teamPid }: Props) => {
  const { data: teamData } = useGetTeamByTeamPidQuery({ teamPid });
  if (!teamData?.team) return null;
  const { team, role } = teamData;

  const memberAvatars: MemberAvatarInterface[] = team.TeamMembers.map((tm) => ({
    avatarUrl: tm.user.UserInformation?.avatarUrl ?? "",
    username: tm.user.UserInformation?.username ?? "",
    userPid: tm.user.UserInformation?.userPid ?? "",
  }));

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
          <div className="flex items-center gap-2">
            <span>Team members:</span>
            <MembersAvatars amountToShow={5} memberAvatars={memberAvatars} />
          </div>
        </div>
        <Projects teamPid={teamPid} />
        {role === "ADMIN" && <NewProjectDialog teamPid={teamPid} />}
      </CardContent>
    </Card>
  );
};
export default LeftCard;
