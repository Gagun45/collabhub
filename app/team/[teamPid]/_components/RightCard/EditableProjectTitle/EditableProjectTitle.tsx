import { Input } from "@/components/ui/input";
import { useEditProjectTitleMutation } from "@/redux/apis/projects.api";
import type { $Enums } from "@prisma/client";
import { useEffect, useState } from "react";
import { usePidContext } from "../../ProjectPidContext";

interface Props {
  role: $Enums.ProjectRole;
  projectTitle: string;
}

const EditableProjectTitle = ({ projectTitle, role }: Props) => {
  const { projectPid, teamPid } = usePidContext();
  const [editProjectTitle] = useEditProjectTitleMutation();
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(projectTitle);
  const resetTitle = () => {
    setNewTitle(projectTitle);
    setEditMode(false);
  };

  const onEditTitle = () => {
    if (!newTitle || newTitle === projectTitle) {
      resetTitle();
      return;
    }
    editProjectTitle({ newProjectTitle: newTitle, projectPid, teamPid });
    setEditMode(false);
  };
  useEffect(() => {
    setNewTitle(projectTitle);
  }, [projectTitle]);

  if (role === "USER")
    return <h2 className="break-all font-bold">{newTitle}</h2>;

  if (editMode)
    return (
      <Input
        className="w-content"
        autoFocus
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
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
    );

  return (
    <h2 className="break-all font-bold" onClick={() => setEditMode(true)}>
      {newTitle}
    </h2>
  );
};
export default EditableProjectTitle;
