import { Card, CardContent } from "@/components/ui/card";
import type { MemberAvatarInterface, ProjectType } from "@/lib/types";
import AddColumnBtn from "./AddColumnBtn/AddColumnBtn";
import Board from "./Board/Board";
import type { $Enums } from "@prisma/client";
import DeleteProjectBtn from "./DeleteProjectBtn/DeleteProjectBtn";
import EditableProjectTitle from "./EditableProjectTitle/EditableProjectTitle";
import MembersAvatars from "@/components/General/MembersAvatars/MembersAvatars";
import AddMembersToProject from "./AddMembersToProject/AddMembersToProject";
import ManageProjectMembers from "./ManageProjectMembers/ManageProjectMembers";
import { isAtLeastProjectAdmin } from "@/lib/utils";

interface Props {
  project: ProjectType;
  role: $Enums.ProjectRole;
}

const ProjectCard = ({ project, role }: Props) => {
  const { title } = project;

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
        <div className="flex gap-2 flex-col">
          <div className="flex items-center flex-wrap">
            <span>Project members:</span>
            <MembersAvatars amountToShow={2} memberAvatars={memberAvatars} />
          </div>

          {isAtLeastProjectAdmin(role) && (
            <div className="flex items-center gap-2 flex-wrap">
              <AddMembersToProject projectTitle={title} />
              <ManageProjectMembers
                members={project.ProjectMember}
                projectTitle={title}
                currentUserRole={role}
              />
            </div>
          )}
        </div>
        <div className="flex items-center">
          <EditableProjectTitle role={role} projectTitle={project.title} />

          {isAtLeastProjectAdmin(role) && <DeleteProjectBtn />}
        </div>
        <AddColumnBtn />
        <Board />
      </CardContent>
    </Card>
  );
};
export default ProjectCard;
