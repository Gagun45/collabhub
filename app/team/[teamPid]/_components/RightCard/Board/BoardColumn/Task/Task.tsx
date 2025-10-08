import { Button } from "@/components/ui/button";
import {
  useDeleteTaskMutation,
  useEditTaskTitleMutation,
} from "@/redux/apis/projects.api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@prisma/client";
import { MoveIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  task: Task;
  projectPid: string;
}

const Task = ({ task, projectPid }: Props) => {
  const { columnPid, taskPid } = task;
  const [deleteTask] = useDeleteTaskMutation();
  const [editTaskTitle] = useEditTaskTitleMutation();
  const [title, setTitle] = useState(task.title);
  const [editMode, setEditMode] = useState(false);
  const resetTitle = () => {
    setTitle(task.title);
    setEditMode(false);
  };
  const onEditTitle = () => {
    if (!title || title === task.title) {
      resetTitle();
      return;
    }
    editTaskTitle({ columnPid, taskPid, newTaskTitle: title, projectPid });
    setEditMode(false);
  };
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.taskPid,
    data: { type: "Task", task },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  if (isDragging)
    return (
      <div
        className="opacity-35 outline-4 outline-blue-600 bg-blue-400 rounded-md px-2 py-4 flex items-center gap-2"
        ref={setNodeRef}
        style={style}
      >
        <Button
          className="size-6"
          variant={"ghost"}
          {...listeners}
          {...attributes}
          style={{ touchAction: "none" }}
        >
          <MoveIcon className="size-4" />
        </Button>
        <span className="break-all">{task.title}</span>
        <Button
          className="size-6 ml-auto"
          variant={"destructive"}
          onClick={() =>
            deleteTask({
              projectPid,
              taskPid: task.taskPid,
              columnPid: task.columnPid,
            })
          }
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>
    );
  return (
    <div
      className="bg-blue-400 rounded-md px-2 py-4 flex items-center gap-2"
      ref={setNodeRef}
      style={style}
    >
      <Button
        className="size-6"
        variant={"ghost"}
        {...listeners}
        {...attributes}
        style={{ touchAction: "none" }}
      >
        <MoveIcon className="size-4" />
      </Button>
      {editMode ? (
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
      ) : (
        <span className="break-all" onClick={() => setEditMode(true)}>
          {title}
        </span>
      )}

      <Button
        className="size-6 ml-auto"
        variant={"destructive"}
        onClick={() =>
          deleteTask({
            projectPid,
            taskPid: task.taskPid,
            columnPid: task.columnPid,
          })
        }
      >
        <TrashIcon className="size-4" />
      </Button>
    </div>
  );
};
export default Task;
