import { useSortable } from "@dnd-kit/sortable";
import type { Column } from "@prisma/client";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateColumnTitleMutation } from "@/redux/apis/projects.api";

interface Props {
  column: Column;
}

const BoardColumn = ({ column }: Props) => {
  const [title, setTitle] = useState(column.title);
  const [editMode, setEditMode] = useState(false);
  const [updateColTitle, { isLoading }] = useUpdateColumnTitleMutation();
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    disabled: editMode,
    data: { type: "Column" },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const resetTitle = () => {
    setTitle(column.title);
    setEditMode(false);
  };

  const onUpdate = async () => {
    if (!title) {
      setTitle(column.title);
      setEditMode(false);
      return;
    }
    if (title === column.title) {
      setEditMode(false);
      return;
    }
    await updateColTitle({ columnId: column.id, newTitle: title });
    setEditMode(false);
  };

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-64 opacity-40 flex flex-col min-h-36 rounded-md bg-blue-400 p-2 gap-2"
      >
        <div>
          <Button>Delete column</Button>
          <Button onClick={() => setEditMode((prev) => !prev)}>Edit</Button>
          <Button {...attributes} {...listeners}>
            Move
          </Button>
        </div>

        <span className="border-b-2 border-t-2 ">{title}</span>
      </div>
    );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-64 flex flex-col min-h-36 rounded-md bg-blue-400 p-2 gap-2"
    >
      <div>
        <Button>Delete column</Button>
        <Button onClick={() => setEditMode(true)}>
          {isLoading ? "Editing..." : "Edit"}
        </Button>

        <Button {...attributes} {...listeners}>
          Move
        </Button>
      </div>
      {editMode ? (
        <Input
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            switch (e.key) {
              case "Escape":
                resetTitle();
                break;
              case "Enter":
                onUpdate();
                break;
            }
          }}
          onBlur={() => {
            onUpdate();
          }}
        />
      ) : (
        <span className="border-b-2 border-t-2 ">
          {title} - {column.index}
        </span>
      )}
    </div>
  );
};
export default BoardColumn;
