import { Card, CardContent } from "@/components/ui/card";
import type { ProjectType } from "@/lib/types";
import AddColumnBtn from "./AddColumnBtn/AddColumnBtn";
import Board from "./Board/Board";
import type { $Enums } from "@prisma/client";
import InviteToProject from "./InviteToProject/InviteToProject";
import DeleteProjectBtn from "./DeleteProjectBtn/DeleteProjectBtn";
import EditableProjectTitle from "./EditableProjectTitle/EditableProjectTitle";

interface Props {
  project: ProjectType;
  role: $Enums.ProjectRole;
}

const ProjectCard = ({ project, role }: Props) => {
  const { projectPid } = project;

  return (
    <Card className="w-full overflow-x-hidden">
      <CardContent className="space-y-4">
        <span>{role}</span>
        <div className="flex flex-col">
          {project.ProjectMember.map((pm) => (
            <span key={`${pm.projectId}-${pm.userId}`}>
              {pm.user.UserInformation?.username}
            </span>
          ))}
          <InviteToProject projectPid={project.projectPid} />
        </div>
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
