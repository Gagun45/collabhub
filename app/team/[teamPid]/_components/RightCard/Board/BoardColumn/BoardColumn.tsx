import { useSortable } from "@dnd-kit/sortable";
import type { Column } from "@prisma/client";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  useDeleteColumnMutation,
  useUpdateColumnTitleMutation,
} from "@/redux/apis/projects.api";
import { toast } from "sonner";

interface Props {
  column: Column;
  projectPid: string;
}

const BoardColumn = ({ column, projectPid }: Props) => {
  const [title, setTitle] = useState(column.title);
  const [editMode, setEditMode] = useState(false);
  const [updateColTitle, { isLoading }] = useUpdateColumnTitleMutation();
  const [deleteColumn, { isLoading: isDeleting }] = useDeleteColumnMutation();
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
    const result = await updateColTitle({
      columnId: column.id,
      newTitle: title,
    });
    if (!result.data?.success) {
      toast.error("Failed to update title");
      setTitle(column.title);
    }
    setEditMode(false);
  };

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-80 opacity-40 flex flex-col min-h-36 rounded-md bg-blue-400 p-2 gap-2 shrink-0"
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
      className="flex w-3/4 xl:w-80 min-w-96 max-w-144 flex-col min-h-36 rounded-md bg-blue-400 p-2 gap-2 shrink-0"
    >
      <div>
        <Button
          disabled={isDeleting}
          onClick={() => deleteColumn({ columnId: column.id, projectPid })}
        >
          Delete column
        </Button>
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
