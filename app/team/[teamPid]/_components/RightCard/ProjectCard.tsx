import { Card, CardContent } from "@/components/ui/card";
import type { ProjectType } from "@/lib/types";
import AddColumnBtn from "./AddColumnBtn/AddColumnBtn";
import Board from "./Board/Board";
import { useEffect, useState } from "react";
import {
  useDeleteProjectMutation,
  useEditProjectTitleMutation,
} from "@/redux/apis/projects.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { $Enums } from "@prisma/client";
import InviteToProject from "./InviteToProject/InviteToProject";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  project: ProjectType;
  role: $Enums.ProjectRole;
}

const ProjectCard = ({ project, role }: Props) => {
  const { projectPid } = project;
  const [title, setTitle] = useState(project.title);
  useEffect(() => {
    setTitle(project.title);
  }, [project.title]);
  const [editMode, setEditMode] = useState(false);
  const [editProjectTitle] = useEditProjectTitleMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const router = useRouter();

  const onDeleteProject = async () => {
    try {
      await deleteProject({ projectPid }).unwrap();
      router.push("/my-teams");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const resetTitle = () => {
    setTitle(project.title);
    setEditMode(false);
  };

  const onEditTitle = () => {
    if (!title || title === project.title) {
      resetTitle();
      return;
    }
    editProjectTitle({ newProjectTitle: title, projectPid });
    setEditMode(false);
  };
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
          {role === "USER" && <h2 className="break-all font-bold">{title}</h2>}

          {role === "ADMIN" &&
            (editMode ? (
              <Input
                className="w-content"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={resetTitle}
                onKeyDown={(e) => {
                  switch (e.key) {
                    case "Escape":
                      resetTitle();
                      break;
                    case "Enter":
                      onEditTitle();
                      break;
                  }
                }}
              />
            ) : (
              <h2
                className="break-all font-bold"
                onClick={() => setEditMode(true)}
              >
                {title}
              </h2>
            ))}

          {role === "ADMIN" && (
            <Button
              onClick={onDeleteProject}
              variant={"destructive"}
              className="ml-auto"
            >
              Delete project
            </Button>
          )}
        </div>
        <AddColumnBtn projectPid={projectPid} />
        <Board projectPid={projectPid} />
      </CardContent>
    </Card>
  );
};
export default ProjectCard;
