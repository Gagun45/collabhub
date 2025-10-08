import { Card, CardContent } from "@/components/ui/card";
import type { ProjectType } from "@/lib/types";
import AddColumnBtn from "./AddColumnBtn/AddColumnBtn";
import Board from "./Board/Board";
import { useEffect, useState } from "react";
import { useEditProjectTitleMutation } from "@/redux/apis/projects.api";
import { Input } from "@/components/ui/input";

interface Props {
  project: ProjectType;
}

const ProjectCard = ({ project }: Props) => {
  const { projectPid } = project;
  const [title, setTitle] = useState(project.title);
  useEffect(() => {
    setTitle(project.title);
  }, [project.title]);
  const [editMode, setEditMode] = useState(false);
  const [editProjectTitle] = useEditProjectTitleMutation();
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
        {editMode ? (
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
          <h2 className="break-all font-bold" onClick={() => setEditMode(true)}>
            {title}
          </h2>
        )}
        <AddColumnBtn projectPid={project!.projectPid} />
        <Board project={project!} />
      </CardContent>
    </Card>
  );
};
export default ProjectCard;
