import { Button } from "@/components/ui/button";
import { useDeleteTaskMutation } from "@/redux/apis/projects.api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@prisma/client";
import { MoveIcon, TrashIcon } from "lucide-react";

interface Props {
  task: Task;
  projectPid: string;
}

const Task = ({ task, projectPid }: Props) => {
  const [deleteTask] = useDeleteTaskMutation();
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
};
export default Task;
