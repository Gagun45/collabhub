import { Button } from "@/components/ui/button";
import type { Column, Task as TaskType } from "@prisma/client";
import Task from "./Task/Task";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCreateNewTaskMutation } from "@/redux/apis/projects.api";

interface Props {
  column: Column;
  tasks: TaskType[];
  projectPid: string;
}

const BoardColumn = ({ column, tasks }: Props) => {
  const [newTask, setNewTask] = useState("");
  const [createTask] = useCreateNewTaskMutation();
  const onAddNewTask = async () => {
    if (!newTask) return;
    await createTask({ columnPid: column.columnPid, taskTitle: newTask });
    setNewTask("");
  };
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
        className="w-80 opacity-30 bg-blue-400 flex flex-col gap-2 shrink-0"
        ref={setNodeRef}
        style={style}
      >
        <span {...attributes} {...listeners}>
          {column!.title}
        </span>
        <div className="bg-slate-300 w-full min-h-24">
          {tasks!.map((task) => (
            <Task task={task} key={task.taskPid} />
          ))}
        </div>
        <Button>Add task</Button>
      </div>
    );
  return (
    <div
      className="w-80 bg-blue-400 flex flex-col gap-2 shrink-0"
      ref={setNodeRef}
      style={style}
    >
      <span {...attributes} {...listeners}>
        {column.title}
      </span>
      <div className="bg-slate-300 w-full min-h-24">
        <SortableContext items={tasks.map((t) => t.taskPid)}>
          {tasks.map((task) => (
            <Task task={task} key={task.taskPid} />
          ))}
        </SortableContext>
      </div>
      <div>
        <Input
          placeholder="Task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button onClick={onAddNewTask}>Add task</Button>
      </div>
    </div>
  );
};
export default BoardColumn;
