import { Card, CardContent } from "@/components/ui/card";
import type { MemberAvatarInterface, ProjectType } from "@/lib/types";
import AddColumnBtn from "./AddColumnBtn/AddColumnBtn";
import Board from "./Board/Board";
import type { $Enums } from "@prisma/client";
import InviteToProject from "./InviteToProject/InviteToProject";
import DeleteProjectBtn from "./DeleteProjectBtn/DeleteProjectBtn";
import EditableProjectTitle from "./EditableProjectTitle/EditableProjectTitle";
import MembersAvatars from "@/components/General/MembersAvatars/MembersAvatars";

interface Props {
  project: ProjectType;
  role: $Enums.ProjectRole;
}

const ProjectCard = ({ project, role }: Props) => {
  const { projectPid } = project;

  const memberAvatars: MemberAvatarInterface[] = project.ProjectMember.map(
    (pm) => ({
      avatarUrl: pm.user.UserInformation?.avatarUrl ?? "",
      username: pm.user.UserInformation?.username ?? "",
      userPid: pm.user.UserInformation?.userPid ?? "",
    })
  );

  return (
    <Card className="w-full overflow-x-hidden">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span>Project members:</span>
          <MembersAvatars amountToShow={5} memberAvatars={memberAvatars} />
        </div>
        <InviteToProject projectPid={project.projectPid} />
        <div className="flex items-center">
          <EditableProjectTitle
            role={role}
            projectPid={projectPid}
            projectTitle={project.title}
            teamPid={project.teamPid}
          />

          {role === "ADMIN" && <DeleteProjectBtn projectPid={projectPid} />}
        </div>
        <AddColumnBtn projectPid={projectPid} />
        <Board projectPid={projectPid} />
      </CardContent>
    </Card>
  );
};
export default ProjectCard;
