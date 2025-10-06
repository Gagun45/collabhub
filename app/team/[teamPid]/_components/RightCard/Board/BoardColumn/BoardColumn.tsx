import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  useCreateNewTaskMutation,
  useDeleteColumnMutation,
  useUpdateColumnTitleMutation,
} from "@/redux/apis/projects.api";
import { toast } from "sonner";
import type { ColumnType } from "@/lib/types";
import Task from "./Task/Task";

interface Props {
  column: ColumnType;
  projectPid: string;
}

const BoardColumn = ({ column, projectPid }: Props) => {
  const [title, setTitle] = useState(column.title);
  const [editMode, setEditMode] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [updateColTitle, { isLoading }] = useUpdateColumnTitleMutation();
  const [deleteColumn, { isLoading: isDeleting }] = useDeleteColumnMutation();
  const [createTask] = useCreateNewTaskMutation();
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.columnPid,
    disabled: editMode,
    data: { type: "Column" },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const resetTitle = () => {
    setTitle(column.title);
    setEditMode(false);
  };
  const onTaskCreate = async () => {
    if (!newTaskTitle) return;
    await createTask({ columnId: column.id, taskTitle: newTaskTitle });
    setNewTaskTitle("");
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
        className="flex opacity-35 w-3/4 xl:w-80 min-w-96 max-w-144 flex-col min-h-36 rounded-md bg-blue-400 p-2 gap-2 shrink-0"
      >
        <div className="space-x-1">
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
          <div>
            <Input
              placeholder="Task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <Button onClick={onTaskCreate}>Add Task</Button>
          </div>
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex w-3/4 xl:w-80 min-w-96 max-w-144 flex-col min-h-36 rounded-md bg-blue-400 p-2 gap-2 shrink-0"
    >
      <div className="space-x-1">
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
        <div>
          <Input
            placeholder="Task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <Button onClick={onTaskCreate}>Add Task</Button>
        </div>
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
      {/* <SortableContext items={column.Task.map((t) => t.taskPid)}>
        {column.Task.map((task) => (
          <Task task={task} key={task.id} columnPid={column.columnPid} />
        ))}
      </SortableContext> */}
    </div>
  );
};
export default BoardColumn;
