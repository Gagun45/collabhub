import { Button } from "@/components/ui/button";
import type { Column, Task as TaskType } from "@prisma/client";
import Task from "./Task/Task";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoveHorizontalIcon, TrashIcon } from "lucide-react";
import { useDeleteColumnMutation } from "@/redux/apis/kanban.api";
import EditableColumnTitle from "./EditableColumnTitle/EditableColumnTitle";
import AddTaskBtn from "./AddTaskBtn/AddTaskBtn";
import { usePidContext } from "../../../ProjectPidContext";

interface Props {
  column: Column;
  tasks: TaskType[];
}

const BoardColumn = ({ column, tasks }: Props) => {
  const { projectPid } = usePidContext();
  const { columnPid, title } = column;

  const [deleteColumn] = useDeleteColumnMutation();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.columnPid,
    data: { type: "Column", column },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  if (isDragging)
    return (
      <div
        className="w-full min-w-80 max-w-84 opacity-35 rounded-md flex flex-col gap-2 pb-2 shrink-0 border-2 overflow-hidden border-blue-400"
        ref={setNodeRef}
        style={style}
      >
        <div className="flex items-center bg-main px-1 py-4 gap-2">
          <Button
            className="size-6 cursor-grab"
            variant={"ghost"}
            {...listeners}
            {...attributes}
            style={{ touchAction: "none" }}
          >
            <MoveHorizontalIcon className="size-4" />
          </Button>
          <EditableColumnTitle columnPid={columnPid} columnTitle={title} />
          <Button className="size-8 ml-auto" variant={"destructive"}>
            <TrashIcon />
          </Button>
        </div>

        <div className="w-full flex flex-col gap-4 px-4 py-2">
          {tasks.length === 0 && (
            <span className="text-center p-2">No tasks yet!</span>
          )}
          <SortableContext items={tasks.map((t) => t.taskPid)}>
            {tasks.map((task) => (
              <Task task={task} key={task.taskPid} />
            ))}
          </SortableContext>
        </div>
        <AddTaskBtn columnPid={columnPid} />
      </div>
    );
  return (
    <div
      className="w-full min-w-80 max-w-84 rounded-md flex flex-col gap-2 pb-4 shrink-0 border-2 overflow-hidden border-blue-400"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex items-center bg-main p-4 gap-2">
        <Button
          className="size-6 cursor-grab"
          variant={"ghost"}
          {...listeners}
          {...attributes}
          style={{ touchAction: "none" }}
        >
          <MoveHorizontalIcon className="size-4" />
        </Button>
        <EditableColumnTitle columnPid={columnPid} columnTitle={title} />

        <Button
          className="size-8 ml-auto"
          variant={"destructive"}
          onClick={() =>
            deleteColumn({
              columnPid,
              projectPid,
            })
          }
        >
          <TrashIcon />
        </Button>
      </div>

      <div className="w-full flex flex-col gap-4 p-4">
        {tasks.length === 0 && (
          <span className="text-center p-2">No tasks yet!</span>
        )}
        <SortableContext items={tasks.map((t) => t.taskPid)}>
          {tasks.map((task) => (
            <Task task={task} key={task.taskPid} />
          ))}
        </SortableContext>
      </div>
      <AddTaskBtn columnPid={columnPid} />
    </div>
  );
};
export default BoardColumn;
