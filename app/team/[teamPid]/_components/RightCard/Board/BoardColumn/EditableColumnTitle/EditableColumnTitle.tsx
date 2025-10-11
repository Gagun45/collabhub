import { Input } from "@/components/ui/input";
import { useEditColumnTitleMutation } from "@/redux/apis/kanban.api";
import { useState } from "react";
import { usePidContext } from "../../../../ProjectPidContext";

interface Props {
  columnTitle: string;
  columnPid: string;
}

const EditableColumnTitle = ({ columnTitle, columnPid }: Props) => {
  const {projectPid} = usePidContext();
  const [editMode, setEditMode] = useState(false);
  const [editColumnTitle] = useEditColumnTitleMutation();
  const [title, setTitle] = useState(columnTitle);
  const resetTitle = () => {
    setTitle(columnTitle);
    setEditMode(false);
  };

  const onEditTitle = () => {
    if (!title || title === columnTitle) {
      resetTitle();
      return;
    }
    editColumnTitle({ columnPid, projectPid, newColumnTitle: title });
    setEditMode(false);
  };

  if (editMode)
    return (
      <Input
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
    );

  return (
    <span className="break-all" onClick={() => setEditMode(true)}>
      {title}
    </span>
  );
};
export default EditableColumnTitle;
